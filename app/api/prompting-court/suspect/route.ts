import { NextResponse } from "next/server";
import { getPublicPromptingCase } from "@/lib/prompting-court/cases";
import { promptingCaseSecrets } from "@/lib/prompting-court/caseSecrets";
import { callGeminiJson, makeSuspectInstruction } from "@/lib/prompting-court/gemini";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

type Turn = { question: string; response: string };

function isTurn(value: unknown): value is Turn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Partial<Turn>;
  return typeof turn.question === "string" && turn.question.length <= 1200 &&
    typeof turn.response === "string" && turn.response.length <= 1800;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const input = body as { caseId?: unknown; question?: unknown; turns?: unknown };
    if (typeof input.caseId !== "string" || typeof input.question !== "string") {
      return NextResponse.json({ error: "A case and question are required." }, { status: 400 });
    }
    const question = input.question.trim();
    if (question.length < 8 || question.length > 1200) {
      return NextResponse.json({ error: "Questions must be between 8 and 1,200 characters." }, { status: 400 });
    }
    const caseItem = getPublicPromptingCase(input.caseId);
    const secret = promptingCaseSecrets[input.caseId];
    if (!caseItem || !secret) {
      return NextResponse.json({ error: "That case could not be found." }, { status: 404 });
    }
    const suppliedTurns = Array.isArray(input.turns) ? input.turns : [];
    if (suppliedTurns.length > 7) {
      return NextResponse.json({ error: "A case allows up to eight questions." }, { status: 400 });
    }
    const turns = suppliedTurns.filter(isTurn).slice(-7);
    const historyText = turns.map((turn, index) => `Question ${index + 1}: ${turn.question}\nWitness response: ${turn.response}`).join("\n\n");

    const result = await callGeminiJson({
      systemInstruction: { parts: [{ text: makeSuspectInstruction(secret) }] },
      contents: [{
        role: "user",
        parts: [{ text: `Case: ${caseItem.title}\nWitness: ${caseItem.witnessName}\nOpening statement: ${caseItem.openingStatement}\n\nPrevious exchange:\n${historyText || "None yet."}\n\nThe student's latest question is:\n${question}\n\nAnswer as the witness. Return the required JSON.` }],
      }],
      generationConfig: { temperature: 0.55, maxOutputTokens: 450, responseMimeType: "application/json" },
    });

    if (!result || typeof result !== "object") throw new Error("The witness response was not valid.");
    const output = result as { reply?: unknown; revealedClueIds?: unknown };
    if (typeof output.reply !== "string" || !output.reply.trim()) throw new Error("The witness response was empty.");
    const validIds = new Set(secret.facts.map((fact) => fact.id));
    const revealedClueIds = Array.isArray(output.revealedClueIds)
      ? output.revealedClueIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
      : [];

    return NextResponse.json({ reply: output.reply.trim().slice(0, 1200), revealedClueIds });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The witness could not respond right now.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : message.includes("timed out") ? 504 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
