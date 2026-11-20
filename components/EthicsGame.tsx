"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import { ethicsCases, type EthicsArgumentId } from "../lib/ethicsCases";
import {
  getStudentProgress,
  recordEthicsResult,
  type StudentProgress,
} from "@/lib/studentProgress";

type Stage = "brief" | "arguments" | "evidence" | "verdict";
const attorneyNames = ["Avery Cole", "Jordan Reyes", "Morgan Ellis", "Riley Bennett", "Taylor Brooks", "Casey Morgan", "Drew Parker", "Sasha Quinn"];

function shuffleArguments(): EthicsArgumentId[] {
  return Math.random() < 0.5 ? ["unethical", "responsible"] : ["responsible", "unethical"];
}

function shuffleNames(): [string, string] {
  const names = [...attorneyNames];
  for (let i = names.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  return [names[0], names[1]];
}

export default function EthicsGame() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("brief");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [argumentOrder, setArgumentOrder] = useState<EthicsArgumentId[]>(["unethical", "responsible"]);
  const [counselNames, setCounselNames] = useState<[string, string]>(["Avery Cole", "Jordan Reyes"]);
  const [selectedArgument, setSelectedArgument] = useState<EthicsArgumentId | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [progressSaved, setProgressSaved] = useState<boolean | null>(null);

  useEffect(() => setProgress(getStudentProgress()), []);

  const currentCase = ethicsCases[currentLevel - 1];
  const gameProgress = progress?.games.ethicsCourt;
  const completedLevels = gameProgress?.completedLevels ?? [];
  const highestUnlockedLevel = gameProgress?.highestUnlockedLevel ?? 1;
  const completedCount = completedLevels.length;
  const accuracy = gameProgress?.totalAttempts
    ? Math.round((gameProgress.correctAttempts / gameProgress.totalAttempts) * 100)
    : 0;
  const progressPercent = Math.round((completedCount / ethicsCases.length) * 100);
  const isCorrect = selectedArgument === "responsible";
  const orderedArguments = useMemo(
    () => argumentOrder.map((id) => ({ id, text: currentCase.arguments[id] })),
    [argumentOrder, currentCase],
  );
  const animate = !reduceMotion;

  function beginHearing() {
    setArgumentOrder(shuffleArguments());
    setCounselNames(shuffleNames());
    setSelectedArgument(null);
    setProgressSaved(null);
    setStage("arguments");
  }

  function deliverVerdict(argumentId: EthicsArgumentId) {
    setSelectedArgument(argumentId);
    const result = recordEthicsResult(
      {
        level: currentLevel,
        caseId: currentCase.id,
        correct: argumentId === "responsible",
        selectedArgument: argumentId,
      },
      progress ?? undefined,
    );
    setProgress(result.progress);
    setProgressSaved(result.persisted);
    setStage("verdict");
  }

  function openLevel(level: number) {
    if (level > highestUnlockedLevel) return;
    setCurrentLevel(level);
    setSelectedArgument(null);
    setArgumentOrder(["unethical", "responsible"]);
    setProgressSaved(null);
    setStage("brief");
  }

  function replayCase() {
    setSelectedArgument(null);
    setArgumentOrder(["unethical", "responsible"]);
    setProgressSaved(null);
    setStage("brief");
  }

  return (
    <main className="ethics-game-page">
      <section className="ec-top">
        <SiteNav />
        <div className="ec-page-heading">
          <div className="ec-heading-copy">
            <p className="ec-eyebrow"><span /> THE AI COURTROOM <b>/</b> ETHICS DIVISION</p>
            <h1>Ethics <em>Court.</em></h1>
            <p>Six dilemmas. Two arguments. Decide which lawyer puts people, fairness, and responsibility first.</p>
          </div>
          <div className="ec-case-stamp" aria-label={`Level ${currentLevel}, one round`}>
            <span>THE ETHICS DOCKET</span>
            <strong>CASE {currentCase.caseNumber}</strong>
            <small>LEVEL {String(currentLevel).padStart(2, "0")} · ROUND 01 / 01</small>
          </div>
        </div>
      </section>

      <section className="ec-game-area">
        <div className="ec-game-wrap">
          <div className="ec-case-meta">
            <div className="ec-breadcrumb">
              <Link href="/">Home</Link><span>/</span><Link href="/games">Games</Link><span>/</span><strong>Ethics Court</strong>
            </div>
            <div className="ec-progress" aria-label={`${completedCount} of ${ethicsCases.length} levels completed`}>
              <span>{completedCount} / {ethicsCases.length} COMPLETE</span>
              <div><span style={{ width: `${progressPercent}%` }} /></div>
              <span>{accuracy}% ACCURACY</span>
            </div>
          </div>

          <section className="ec-level-selector" aria-label="Choose an ethics case">
            <div className="ec-level-heading">
              <div><p className="ec-kicker">YOUR ETHICS DOCKET</p><h2>Six tests of <em>judgment.</em></h2></div>
              <p>Complete a case to open the next one. Revisit any level you have unlocked.</p>
            </div>
            <div className="ec-level-list">
              {ethicsCases.map((caseItem) => {
                const unlocked = caseItem.level <= highestUnlockedLevel;
                const completed = completedLevels.includes(caseItem.level);
                const current = currentLevel === caseItem.level;
                return (
                  <button
                    key={caseItem.id}
                    type="button"
                    className={`ec-level-option ${current ? "is-current" : ""} ${completed ? "is-complete" : ""} ${!unlocked ? "is-locked" : ""}`}
                    onClick={() => openLevel(caseItem.level)}
                    disabled={!unlocked}
                    aria-current={current ? "step" : undefined}
                  >
                    <span className="ec-level-number">{completed ? "✓" : !unlocked ? "⌑" : String(caseItem.level).padStart(2, "0")}</span>
                    <span className="ec-level-copy"><strong>{caseItem.title.replace("The ", "")}</strong><small>{caseItem.difficulty}</small></span>
                    {current ? <span className="ec-current-mark">CURRENT</span> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="ec-case-intro">
            <div>
              <p className="ec-kicker">LEVEL {String(currentLevel).padStart(2, "0")} · {currentCase.topic.toUpperCase()}</p>
              <h2>{currentCase.title.split(" ").slice(0, -1).join(" ")}<br /><em>{currentCase.title.split(" ").slice(-1).join("")}</em></h2>
              <p className="ec-context">{currentCase.context}</p>
            </div>
            <div className="ec-question-card">
              <span>THE QUESTION BEFORE THE COURT</span>
              <p>{currentCase.question}</p>
              <small>ETHICS FILE · {currentCase.caseNumber}</small>
            </div>
          </div>

          <div className="ec-courtroom-frame">
            <div className="ec-scene-topline"><span><i /> {stage === "brief" ? "AWAITING THE COURT" : "ETHICS HEARING IN SESSION"}</span><span>FAIRNESS · PRIVACY · ACCOUNTABILITY</span></div>
            <div className={`ec-courtroom-scene ${stage !== "brief" ? "is-active" : ""}`}>
              <Image src="/ethics-courtroom-scene.png" alt="An ethics-themed courtroom viewed from the judge's bench, with a justice scale and two lawyers facing each other." fill priority sizes="(max-width: 900px) 100vw, 1200px" className="ec-scene-image" />
              <div className="ec-scene-overlay" />
              <div className="ec-scene-caption"><span>THE ETHICS CHAMBER</span><span>YOU ARE THE JUDGE</span></div>
              <AnimatePresence mode="wait">
                {stage !== "brief" ? (
                  <motion.div key={`${currentCase.id}-arguments`} className="ec-dialogue-grid" initial={animate ? { opacity: 0 } : false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                    {orderedArguments.map((argument, index) => (
                      <motion.article key={argument.id} className={`ec-speech-bubble ${index === 0 ? "is-left" : "is-right"}`} initial={animate ? { opacity: 0, y: 26, x: index === 0 ? -18 : 18 } : false} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : index * 0.28 }}>
                        <div className="ec-speech-topline"><span>0{index + 1}</span><div><strong>{counselNames[index]}</strong><small>COUNSEL {index === 0 ? "A" : "B"}</small></div><b>“</b></div>
                        <p>{argument.text}</p>
                      </motion.article>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
              {stage === "brief" ? (
                <motion.div className="ec-call-to-order" initial={animate ? { opacity: 0, y: 18 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.42 }}>
                  <span>⚖</span><p>Two lawyers are ready to make their case.</p>
                  <button className="ec-button ec-button-gold" type="button" onClick={beginHearing}>Open the ethics hearing <b>→</b></button>
                </motion.div>
              ) : null}
              {stage === "arguments" ? <motion.div className="ec-scene-next" initial={animate ? { opacity: 0, y: 12 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.36, delay: reduceMotion ? 0 : 0.72 }}><button className="ec-button ec-button-gold" type="button" onClick={() => setStage("evidence")}>Review the principles <b>→</b></button></motion.div> : null}
              {stage === "evidence" || stage === "verdict" ? <div className="ec-evidence-seal"><span>ETHICAL</span><strong>REVIEW</strong></div> : null}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {stage === "evidence" || stage === "verdict" ? (
              <motion.section key={`${currentCase.id}-evidence`} className="ec-evidence-section" initial={animate ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reduceMotion ? 0 : 0.45 }}>
                <div className="ec-evidence-heading"><div><p className="ec-kicker">THE ETHICAL FRAMEWORK</p><h3>Review the <em>principles.</em></h3></div><p>Read the source material and decide which argument better protects people and supports responsible AI use.</p></div>
                <div className="ec-evidence-grid">
                  {currentCase.sources.map((source, index) => (
                    <article className="ec-exhibit-card" key={`${source.title}-${index}`}>
                      <div className="ec-exhibit-topline"><span>REFERENCE 0{index + 1}</span><span>ORIGINAL GUIDANCE</span></div>
                      <p className="ec-source-org">{source.organization}</p><h4>{source.title}</h4>
                      <blockquote>“{source.excerpt}”</blockquote><p className="ec-source-relevance">{source.relevance}</p>
                      <a href={source.url} target="_blank" rel="noreferrer">Read the specific source <span>↗</span></a>
                    </article>
                  ))}
                </div>
                {stage === "evidence" ? (
                  <motion.div className="ec-verdict-prompt" initial={animate ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.35 }}>
                    <div><span>YOUR RULING</span><h3>Which lawyer made the more ethical argument?</h3><p>Choose the position that best respects the people affected—not simply the one that makes AI sound most useful.</p></div>
                    <div className="ec-verdict-options">
                      {orderedArguments.map((argument, index) => <button className="ec-verdict-choice" key={argument.id} type="button" onClick={() => deliverVerdict(argument.id)}><span>{index === 0 ? "A" : "B"}</span><strong>Choose Counsel {index === 0 ? "A" : "B"}</strong><small>{counselNames[index]}</small><b>→</b></button>)}
                    </div>
                  </motion.div>
                ) : null}
                {stage === "verdict" && selectedArgument ? (
                  <motion.div className={`ec-verdict-result ${isCorrect ? "is-correct" : "is-incorrect"}`} initial={animate ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.4 }} role="status" aria-live="polite">
                    <div className="ec-result-icon">{isCorrect ? "✓" : "×"}</div>
                    <div className="ec-result-copy"><p className="ec-kicker">{isCorrect ? "RULING · ETHICALLY SOUND" : "RULING · RECONSIDER THE PRINCIPLES"}</p><h3>{isCorrect ? currentCase.feedback.correctHeading : currentCase.feedback.incorrectHeading}</h3><p>{currentCase.feedback.explanation}</p><div className="ec-learning-note"><strong>{currentCase.feedback.skill}</strong><span>{currentCase.feedback.takeaway}</span></div><p className={`ec-save-note ${progressSaved === false ? "is-unsaved" : ""}`}>{progressSaved === false ? "Progress could not be saved in this browser." : "Your ethics-case result is saved in this browser for the future student dashboard."} No name or password is collected here.</p><div className="ec-result-actions"><button className="ec-button ec-button-dark" type="button" onClick={replayCase}>Replay this case ↻</button>{currentLevel < ethicsCases.length && highestUnlockedLevel > currentLevel ? <button className="ec-button ec-button-gold" type="button" onClick={() => openLevel(currentLevel + 1)}>Next level →</button> : null}<Link href="/games">Return to all games →</Link></div></div>
                    <aside className="ec-level-complete"><span>LEVEL {String(currentLevel).padStart(2, "0")}</span><strong>{isCorrect ? "1 / 1" : "0 / 1"}</strong><small>{isCorrect ? "CORRECT" : "ATTEMPT RECORDED"}</small><small>{completedCount} / {ethicsCases.length} COMPLETED</small></aside>
                  </motion.div>
                ) : null}
              </motion.section>
            ) : null}
          </AnimatePresence>

          <div className="ec-bottom-nav"><Link href="/">← Back home</Link><span>THE AI COURTROOM · ETHICS DIVISION</span><Link href="/games">All games →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
