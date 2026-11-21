"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, type ChangeEvent, type CSSProperties, type FormEvent, type ReactNode } from "react";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import AcquittalBrand from "@/components/AcquittalBrand";
import { promptingCases, type PromptingCase } from "@/lib/prompting-court/cases";
import {
  getStudentProgress,
  recordPromptingResult,
  type PromptingGameProgress,
  type StudentProgress,
} from "@/lib/studentProgress";

type View = "briefing" | "room" | "suspect" | "pad" | "judge" | "verdict";
type Turn = { question: string; response: string; revealedClueIds: string[] };
type JudgeResult = {
  score: number;
  grade: string;
  won: boolean;
  categoryScores: {
    relevance: number;
    specificity: number;
    followUp: number;
    evidenceReasoning: number;
    respectfulEthics: number;
  };
  strengths: string[];
  improvements: string[];
  keyFactsDiscovered: string[];
  keyFactsMissed: string[];
  judgeComment: string;
};

const categoryLabels: Array<{ key: keyof JudgeResult["categoryScores"]; label: string }> = [
  { key: "relevance", label: "Relevance" },
  { key: "specificity", label: "Specificity" },
  { key: "followUp", label: "Follow-up questions" },
  { key: "evidenceReasoning", label: "Evidence reasoning" },
  { key: "respectfulEthics", label: "Respectful conduct" },
];

const slide = {
  initial: { opacity: 0, x: 24, filter: "blur(4px)" },
  animate: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -20, filter: "blur(3px)" },
};

function parseError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }
  return fallback;
}

function CaseProgressDots({ completed, current }: { completed: number[]; current: number }) {
  return (
    <div className="pc-progress-dots" aria-label={`Level ${current} of 6`}>
      {promptingCases.map((item) => (
        <span
          key={item.id}
          className={`${completed.includes(item.level) ? "is-complete" : ""} ${current === item.level ? "is-current" : ""}`}
          title={`Case ${item.level}`}
        />
      ))}
    </div>
  );
}

function ViewHeading({ title }: { title: ReactNode }) {
  return (
    <div className="pc-view-heading">
      <h2>{title}</h2>
    </div>
  );
}

export default function PromptingExperience() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [view, setView] = useState<View>("briefing");
  const [activeCaseId, setActiveCaseId] = useState(promptingCases[0].id);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState("");
  const [suspectLoading, setSuspectLoading] = useState(false);
  const [judgeLoading, setJudgeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [progressSaved, setProgressSaved] = useState<boolean | null>(null);

  useEffect(() => {
    setProgress(getStudentProgress());
  }, []);

  const gameProgress: PromptingGameProgress | undefined = progress?.games.promptingCourt;
  const completedLevels = gameProgress?.completedLevels ?? [];
  const highestUnlocked = gameProgress?.highestUnlockedLevel ?? 1;
  const completedCount = completedLevels.length;
  const activeCase = useMemo<PromptingCase>(
    () => promptingCases.find((item) => item.id === activeCaseId) ?? promptingCases[0],
    [activeCaseId],
  );
  const latestTurn = turns.length > 0 ? turns[turns.length - 1] : undefined;
  const questionLimitReached = turns.length >= 8;

  function startCase(caseItem: PromptingCase) {
    if (caseItem.level > highestUnlocked) return;
    setActiveCaseId(caseItem.id);
    setTurns([]);
    setQuestion("");
    setJudgeResult(null);
    setError(null);
    setProgressSaved(null);
    setView("room");
  }

  function returnToRoom() {
    setError(null);
    setView("room");
  }

  async function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 8 || suspectLoading || questionLimitReached) return;
    setError(null);
    setSuspectLoading(true);
    try {
      const response = await fetch("/api/prompting-court/suspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: activeCase.id,
          question: trimmedQuestion,
          turns: turns.map(({ question: priorQuestion, response: priorResponse }) => ({
            question: priorQuestion,
            response: priorResponse,
          })),
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(parseError(payload, "The witness could not respond. Please try again."));
      const data = payload as { reply?: unknown; revealedClueIds?: unknown };
      if (typeof data.reply !== "string") throw new Error("The witness response was incomplete. Please try again.");
      const revealedClueIds = Array.isArray(data.revealedClueIds)
        ? data.revealedClueIds.filter((id): id is string => typeof id === "string")
        : [];
      setTurns((current) => [...current, { question: trimmedQuestion, response: data.reply as string, revealedClueIds }]);
      setQuestion("");
      setView("suspect");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong. Please try again.");
    } finally {
      setSuspectLoading(false);
    }
  }

  async function askJudge() {
    if (turns.length === 0 || judgeLoading) return;
    setError(null);
    setJudgeLoading(true);
    setView("judge");
    try {
      const response = await fetch("/api/prompting-court/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: activeCase.id,
          turns: turns.map(({ question: userQuestion, response: suspectResponse }) => ({
            question: userQuestion,
            response: suspectResponse,
          })),
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(parseError(payload, "The judge could not deliver a verdict."));
      const result = payload as JudgeResult;
      if (typeof result.score !== "number" || !result.categoryScores) throw new Error("The judge returned an incomplete verdict.");
      setJudgeResult(result);
      const recorded = recordPromptingResult({
        level: activeCase.level,
        caseId: activeCase.id,
        score: result.score,
        won: result.won,
        questionCount: turns.length,
      }, progress ?? undefined);
      setProgress(recorded.progress);
      setProgressSaved(recorded.persisted);
      setView("verdict");
    } catch (judgeError) {
      setError(judgeError instanceof Error ? judgeError.message : "Something went wrong while grading.");
      setView("judge");
    } finally {
      setJudgeLoading(false);
    }
  }

  function continueToNextCase() {
    const next = promptingCases.find((item) => item.level === activeCase.level + 1);
    if (next && next.level <= (gameProgress?.highestUnlockedLevel ?? highestUnlocked)) startCase(next);
    else setView("briefing");
  }

  function motionProps() {
    return reduceMotion ? {} : {
      initial: slide.initial,
      animate: slide.animate,
      exit: slide.exit,
      transition: { duration: 0.36, ease: [0.22, 0.75, 0.25, 1] as const },
    };
  }

  return (
    <main className="prompting-court-page">
      <header className="pc-site-header">
        <SiteNav />
      </header>
      <section className="pc-masthead">
        <div className="pc-masthead-inner">
          <div>
            <p className="pc-eyebrow"><span /> <AcquittalBrand /> / PROMPTING DIVISION</p>
            <h1>Prompting <em>Court.</em></h1>
          </div>
          <div className="pc-case-progress-card">
            <span>YOUR CASE PROGRESS</span>
            <strong>{completedCount} <small>/ 6</small></strong>
            <CaseProgressDots completed={completedLevels} current={view === "briefing" ? highestUnlocked : activeCase.level} />
            <small>{gameProgress?.wins ?? 0} CASES WON</small>
          </div>
        </div>
      </section>

      <section className="pc-main-area">
        <div className="pc-main-wrap">
          <div className="pc-crumb-row">
            <div className="pc-breadcrumb">
              <Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><strong>Prompting Court</strong>
            </div>
            {view !== "briefing" && (
              <button className="pc-back-to-cases" type="button" onClick={() => setView("briefing")}>← Case files</button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {view === "briefing" && (
              <motion.section key="briefing" className="pc-briefing" {...motionProps()}>
                <div className="pc-briefing-intro">
                  <ViewHeading title={<>Choose your <em>case.</em></>} />
                  <div className="pc-rules-card">
                    <span className="pc-court-symbol">§</span>
                    <strong>Your job as counsel</strong>
                    <p>Ask up to eight questions, then request the judge's verdict.</p>
                  </div>
                </div>
                <div className="pc-case-grid">
                  {promptingCases.map((caseItem) => {
                    const unlocked = caseItem.level <= highestUnlocked;
                    const completed = completedLevels.includes(caseItem.level);
                    return (
                      <button
                        key={caseItem.id}
                        type="button"
                        className={`pc-case-card ${unlocked ? "is-unlocked" : "is-locked"} ${completed ? "is-complete" : ""}`}
                        disabled={!unlocked}
                        onClick={() => startCase(caseItem)}
                      >
                        <span className="pc-case-card-top"><small>CASE {caseItem.caseNumber}</small><b>{completed ? "✓ COMPLETE" : unlocked ? "OPEN FILE →" : "LOCKED"}</b></span>
                        <span className="pc-case-card-number">0{caseItem.level}</span>
                        <strong>{caseItem.title}</strong>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {view === "room" && (
              <motion.section key="room" className="pc-room-view" {...motionProps()}>
                <div className="pc-room-intro">
                  <div>
                    <p className="pc-eyebrow">{activeCase.caseNumber} · {activeCase.category}</p>
                    <h2>{activeCase.title}</h2>
                    <p>{activeCase.caseBrief}</p>
                  </div>
                  <div className="pc-room-round"><span>ROUND</span><strong>01 <i>/</i> 01</strong><small>{turns.length} QUESTIONS ASKED</small></div>
                </div>
                <div className="pc-scene-frame">
                  <Image
                    src="/realActTwo.jpg"
                    alt="A lawyer questions a witness in front of a judge in a wood-paneled courtroom."
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 1200px"
                    className="pc-scene-image"
                  />
                  <div className="pc-scene-shade" />
                  <div className="pc-scene-title"><span>THE CROSS-EXAMINATION</span><strong>Choose where to focus.</strong></div>
                  <button className="pc-hotspot pc-hotspot-witness" type="button" onClick={() => setView("suspect")} aria-label="Open the witness statement">
                    <span>01</span><strong>The Witness</strong><b>↗</b>
                  </button>
                  <button className="pc-hotspot pc-hotspot-paper" type="button" onClick={() => setView("pad")} aria-label="Open your legal pad">
                    <span>02</span><strong>Your Legal Pad</strong><b>↗</b>
                  </button>
                  <button className="pc-hotspot pc-hotspot-judge" type="button" onClick={() => { setError(null); setView("judge"); }} disabled={turns.length === 0} aria-label="Go to the judge">
                    <span>03</span><strong>The Judge</strong><b>↗</b>
                  </button>
                  <div className="pc-scene-footer"><span>THE PEOPLE VS. THE UNKNOWN ACCOUNT</span><span>YOU ARE COUNSEL</span></div>
                </div>
              </motion.section>
            )}

            {view === "suspect" && (
              <motion.section key="suspect" className="pc-interview-view" {...motionProps()}>
                <div className="pc-view-topbar"><span>01 / WITNESS STAND</span><button type="button" onClick={returnToRoom}>← Return to courtroom</button></div>
                <div className="pc-suspect-layout">
                  <div className="pc-witness-portrait">
                    <Image src="/realActTwo.jpg" alt="The witness seated at the courtroom stand." fill sizes="(max-width: 760px) 100vw, 44vw" className="pc-portrait-image" />
                    <div className="pc-portrait-label"><small>WITNESS FOR THIS CASE</small><strong>{activeCase.witnessName}</strong><span>{activeCase.witnessRole}</span></div>
                  </div>
                  <div className="pc-interview-copy">
                    <p className="pc-eyebrow">THE WITNESS' ACCOUNT</p>
                    <h2>“Let me explain what <em>I remember.</em>”</h2>
                    <div className="pc-witness-profile"><strong>Background</strong><p>{activeCase.witnessDescription}</p></div>
                    <div className="pc-dialogue-card"><span>OPENING STATEMENT</span><p>“{activeCase.openingStatement}”</p></div>
                    {turns.length > 0 && (
                      <div className="pc-latest-response"><span>RESPONSE TO YOUR QUESTION {turns.length}</span><p>“{latestTurn?.response}”</p></div>
                    )}
                    <div className="pc-action-row">
                      <button className="pc-button pc-button-forest" type="button" onClick={() => setView("pad")}>Ask a question <span>→</span></button>
                      <button className="pc-button pc-button-outline" type="button" onClick={returnToRoom}>Back to scene</button>
                    </div>
                  </div>
                </div>
                {turns.length > 1 && (
                  <div className="pc-transcript-list">
                    <h3>Earlier exchanges</h3>
                    {turns.slice(0, -1).map((turn, index) => (
                      <article key={`${index}-${turn.question}`}><span>YOU · QUESTION {index + 1}</span><p>{turn.question}</p><span>WITNESS</span><p>{turn.response}</p></article>
                    ))}
                  </div>
                )}
              </motion.section>
            )}

            {view === "pad" && (
              <motion.section key="pad" className="pc-legal-pad-view" {...motionProps()}>
                <div className="pc-view-topbar"><span>02 / COUNSEL'S DESK</span><button type="button" onClick={returnToRoom}>← Return to courtroom</button></div>
                <div className="pc-pad-layout">
                  <div className="pc-pad-sidebar">
                    <p className="pc-eyebrow">YOUR OBJECTIVE</p>
                    <h2>{activeCase.objective}</h2>
                    <div className="pc-focus-list"><strong>Possible lines of inquiry</strong>{activeCase.suggestedFocus.map((tip) => <p key={tip}><span>✦</span>{tip}</p>)}</div>
                    <div className="pc-question-counter"><strong>{turns.length}<small>/ 8</small></strong><span>QUESTIONS USED</span><div><i style={{ width: `${(turns.length / 8) * 100}%` }} /></div></div>
                  </div>
                  <div className="pc-paper-sheet">
                    <div className="pc-paper-head"><span>THE PEOPLE VS. THE UNKNOWN ACCOUNT</span><span>COUNSEL'S NOTES · {activeCase.caseNumber}</span></div>
                    <h2>Cross-examination <em>questions.</em></h2>
                    <p className="pc-paper-instruction">Use fictional case details only. Do not enter real personal information.</p>
                    <form onSubmit={submitQuestion} className="pc-question-form">
                      <label htmlFor="pc-question">Your next question</label>
                      <textarea id="pc-question" value={question} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setQuestion(event.currentTarget.value)} maxLength={1200} rows={5} placeholder="For example: Can you walk me through what happened between the initial count and the final deposit?" disabled={suspectLoading || questionLimitReached} />
                      <div className="pc-form-bottom"><small>{question.trim().length}/1,200 characters · {8 - turns.length} questions remaining</small><button className="pc-button pc-button-forest" type="submit" disabled={suspectLoading || question.trim().length < 8 || questionLimitReached}>{suspectLoading ? "Witness is responding…" : "Submit to witness →"}</button></div>
                    </form>
                    {error && <p className="pc-error-message" role="alert">{error}</p>}
                    {turns.length > 0 && <div className="pc-notes-history"><h3>Questions already asked</h3>{turns.map((turn, index) => <article key={`${index}-${turn.question}`}><span>QUESTION {index + 1}</span><p>{turn.question}</p><small>Witness response received · {turn.revealedClueIds.length ? `${turn.revealedClueIds.length} new detail${turn.revealedClueIds.length === 1 ? "" : "s"} surfaced` : "No new details yet"}</small></article>)}</div>}
                    {questionLimitReached && <p className="pc-limit-note">You've used all eight questions. Return to the room when you're ready to ask the judge for a verdict.</p>}
                    <div className="pc-paper-actions"><button type="button" className="pc-button pc-button-outline" onClick={() => setView("suspect")}>← Back to witness</button><button type="button" className="pc-button pc-button-green" disabled={turns.length === 0} onClick={() => { setError(null); setView("judge"); }}>I'm ready for the judge →</button></div>
                  </div>
                </div>
              </motion.section>
            )}

            {view === "judge" && (
              <motion.section key="judge" className="pc-judge-view" {...motionProps()}>
                <div className="pc-view-topbar"><span>03 / THE BENCH</span><button type="button" onClick={() => setView("pad")}>← Return to legal pad</button></div>
                <div className="pc-judge-panel">
                  <div className="pc-judge-emblem">⚖</div>
                  <h2>Ready to hear <em>your case?</em></h2>
                  <div className="pc-judge-stats"><div><strong>{turns.length}</strong><span>QUESTIONS ASKED</span></div><div><strong>{turns.filter((turn) => turn.revealedClueIds.length > 0).length}</strong><span>ANSWERS WITH NEW DETAILS</span></div><div><strong>5</strong><span>GRADING DIMENSIONS</span></div></div>
                  {error && <p className="pc-error-message" role="alert">{error}</p>}
                  <div className="pc-action-row pc-action-center"><button type="button" className="pc-button pc-button-outline" onClick={() => setView("pad")} disabled={judgeLoading}>Continue questioning</button><button type="button" className="pc-button pc-button-green pc-verdict-submit" onClick={askJudge} disabled={judgeLoading || turns.length === 0}>{judgeLoading ? "The judge is reviewing…" : "Submit my case for a verdict →"}</button></div>
                  <small className="pc-judge-footnote">AI-generated feedback is educational practice, not a formal assessment.</small>
                </div>
              </motion.section>
            )}

            {view === "verdict" && judgeResult && (
              <motion.section key="verdict" className="pc-verdict-view" {...motionProps()}>
                <div className="pc-verdict-banner"><span>THE COURT HAS REACHED A DECISION</span><strong>{judgeResult.won ? "CASE WON" : "CASE NOT WON"}</strong><small>{activeCase.caseNumber} · FINAL RULING</small></div>
                <div className="pc-score-panel">
                  <div className="pc-score-ring" style={{ "--pc-score": `${judgeResult.score}%` } as CSSProperties}><div><strong>{judgeResult.score}</strong><span>/ 100</span></div></div>
                  <div className="pc-score-copy"><p className="pc-eyebrow">THE JUDGE'S EVALUATION</p><h2>{judgeResult.grade} <em>Grade</em></h2><p>{judgeResult.judgeComment}</p></div>
                </div>
                <div className="pc-score-breakdown"><h3>How your questioning scored</h3>{categoryLabels.map(({ key, label }) => <div className="pc-score-row" key={key}><span>{label}</span><div><i style={{ width: `${judgeResult.categoryScores[key] * 5}%` }} /></div><strong>{judgeResult.categoryScores[key]}/20</strong></div>)}</div>
                <div className="pc-feedback-grid"><article><h3>What you did well</h3>{(judgeResult.strengths.length ? judgeResult.strengths : ["You completed the cross-examination and requested a review."]).map((item) => <p key={item}><span>✓</span>{item}</p>)}</article><article><h3>How to improve</h3>{(judgeResult.improvements.length ? judgeResult.improvements : ["Try asking more specific follow-up questions."]).map((item) => <p key={item}><span>→</span>{item}</p>)}</article></div>
                <div className="pc-facts-grid"><article><h3>Details you uncovered</h3>{(judgeResult.keyFactsDiscovered.length ? judgeResult.keyFactsDiscovered : ["The judge did not identify a clearly established key fact in the transcript."]).map((item) => <p key={item}>{item}</p>)}</article><article><h3>Details still in the record</h3>{(judgeResult.keyFactsMissed.length ? judgeResult.keyFactsMissed : ["You addressed the main facts available in this case."]).map((item) => <p key={item}>{item}</p>)}</article></div>
                <p className={`pc-save-status ${progressSaved === false ? "is-error" : ""}`}>{progressSaved === false ? "Your verdict could not be saved in this browser." : "Your verdict has been saved locally for the future student dashboard."}</p>
                <div className="pc-verdict-actions"><button type="button" className="pc-button pc-button-outline" onClick={() => startCase(activeCase)}>Retry this case</button><button type="button" className="pc-button pc-button-forest" onClick={continueToNextCase}>{activeCase.level < 6 ? "Continue to next case →" : "Return to case files →"}</button><Link href="/games">All games</Link></div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="pc-bottom-links"><Link href="/">← Home</Link><span><AcquittalBrand /> · PROMPTING DIVISION</span><Link href="/games">All games →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
