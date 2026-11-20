import { NextResponse } from "next/server";
import { promptingCases } from "@/lib/prompting-court/cases";
import { promptingCaseSecrets } from "@/lib/prompting-court/caseSecrets";
import { callGeminiJson, makeJudgeInstruction } from "@/lib/prompting-court/gemini";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

type Turn = { question: string; response: string };
const scoreKeys = ["relevance", "specificity", "followUp", "evidenceReasoning", "respectfulEthics"] as const;

function isTurn(value: unknown): value is Turn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Partial<Turn>;
  return typeof turn.question === "string" && turn.question.length <= 1200 &&
    typeof turn.response === "string" && turn.response.length <= 1800;
}

function cleanList(value: unknown, limit = 4): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, limit).map((item) => item.trim().slice(0, 240))
    : [];
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const input = body as { caseId?: unknown; turns?: unknown };
    if (typeof input.caseId !== "string" || !Array.isArray(input.turns)) {
      return NextResponse.json({ error: "A case and interrogation transcript are required." }, { status: 400 });
    }
    const caseItem = promptingCases.find((item) => item.id === input.caseId);
    const secret = promptingCaseSecrets[input.caseId];
    if (input.turns.length > 8) {
      return NextResponse.json({ error: "A case allows up to eight questions." }, { status: 400 });
    }
    const turns = input.turns.filter(isTurn).slice(0, 8);
    if (!caseItem || !secret) return NextResponse.json({ error: "That case could not be found." }, { status: 404 });
    if (turns.length === 0) return NextResponse.json({ error: "Ask at least one question before requesting a verdict." }, { status: 400 });

    const transcript = turns.map((turn, index) => `Exchange ${index + 1}\nLawyer: ${turn.question}\nWitness: ${turn.response}`).join("\n\n");
    const result = await callGeminiJson({
      systemInstruction: { parts: [{ text: makeJudgeInstruction(secret) }] },
      contents: [{ role: "user", parts: [{ text: `Case: ${caseItem.title}\nObjective: ${caseItem.objective}\n\nFull cross-examination transcript:\n${transcript}\n\nEvaluate the lawyer's questioning using the five-part rubric. Return only the required JSON.` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 900, responseMimeType: "application/json" },
    });
    if (!result || typeof result !== "object") throw new Error("The judge returned an unreadable verdict.");
    const output = result as Record<string, unknown>;
    const rawScores = output.categoryScores && typeof output.categoryScores === "object"
      ? output.categoryScores as Record<string, unknown>
      : {};
    const categoryScores = Object.fromEntries(scoreKeys.map((key) => {
      const value = Number(rawScores[key]);
      return [key, Number.isFinite(value) ? Math.max(0, Math.min(20, Math.round(value))) : 0];
    })) as Record<(typeof scoreKeys)[number], number>;
    const score = scoreKeys.reduce((sum, key) => sum + categoryScores[key], 0);
    const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

    return NextResponse.json({
      score,
      grade,
      won: score >= 70,
      categoryScores,
      strengths: cleanList(output.strengths),
      improvements: cleanList(output.improvements),
      keyFactsDiscovered: cleanList(output.keyFactsDiscovered, 6),
      keyFactsMissed: cleanList(output.keyFactsMissed, 6),
      judgeComment: typeof output.judgeComment === "string" ? output.judgeComment.trim().slice(0, 700) : "The court has reviewed your questioning.",
      caseId: caseItem.id,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The judge could not deliver a verdict right now.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : message.includes("timed out") ? 504 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
