"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import {
  getStudentProgress,
  recordHallucinationResult,
  type StudentProgress,
} from "../lib/studentProgress";

type Stage = "brief" | "arguments" | "evidence" | "verdict";
type ArgumentId = "unsupported" | "supported";

type CaseArgument = {
  id: ArgumentId;
  opening: string;
  sourceOrganization: string;
  sourceTitle: string;
  sourceExcerpt: string;
  sourceNote: string;
  sourceUrl: string;
};

type HallucinationCase = {
  id: string;
  level: number;
  caseNumber: string;
  title: string;
  topic: string;
  difficulty: string;
  caseContext: string;
  prompt: string;
  correctArgumentId: ArgumentId;
  arguments: [CaseArgument, CaseArgument];
  feedback: {
    correctHeading: string;
    incorrectHeading: string;
    correctExplanation: string;
    incorrectExplanation: string;
    skill: string;
    takeaway: string;
  };
};

const source = (
  id: ArgumentId,
  opening: string,
  excerpt: string,
  note: string,
  title: string,
  organization = "National Institutes of Health",
): CaseArgument => ({
  id,
  opening,
  sourceOrganization: organization,
  sourceTitle: title,
  sourceExcerpt: excerpt,
  sourceNote: note,
  sourceUrl: "https://www.nih.gov/",
});

const hallucinationCases: HallucinationCase[] = [
  {
    id: "sleep", level: 1, caseNumber: "001", title: "The Sleep Claim", topic: "Health", difficulty: "FOUNDATIONS",
    caseContext: "Two summaries make competing claims about what sleep can do.", prompt: "Which claim is supported by the source?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "The source proves that one good night's sleep permanently repairs lost memory.", "The study examined short-term performance after sleep.", "It does not establish permanent repair or a universal effect.", "Sleep and memory research"),
      source("supported", "The source reports that sleep can support memory consolidation under the conditions studied.", "Sleep is involved in the consolidation of memories.", "This wording preserves the study's limited claim.", "Sleep and memory research"),
    ],
    feedback: { correctHeading: "The record supports this reading.", incorrectHeading: "That claim outruns the record.", correctExplanation: "The source describes a qualified relationship rather than a permanent or universal result.", incorrectExplanation: "The source discusses consolidation in a specific context, not permanent memory repair.", skill: "Watch the scope.", takeaway: "A plausible result is not automatically a universal one." },
  },
  {
    id: "climate", level: 2, caseNumber: "002", title: "The Climate Claim", topic: "Climate", difficulty: "FOUNDATIONS",
    caseContext: "A temperature trend is being used to support two different conclusions.", prompt: "Which argument stays within the evidence?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "One cool month disproves long-term global warming.", "Short-term variability occurs within long-term climate trends.", "A single month cannot test a multi-decade trend.", "Climate change: vital signs", "NASA"),
      source("supported", "Short-term variation does not by itself overturn a long-term warming trend.", "Climate is the long-term average of weather.", "The distinction between weather and climate is central here.", "Climate change: vital signs", "NASA"),
    ],
    feedback: { correctHeading: "The timescale matters.", incorrectHeading: "A short snapshot is not the whole record.", correctExplanation: "The supported argument distinguishes daily or monthly weather from climate trends.", incorrectExplanation: "The source explicitly warns that short-term variation cannot settle a long-term question.", skill: "Match the timescale.", takeaway: "Do not use a short observation to make a long-term claim." },
  },
  {
    id: "antibiotics", level: 3, caseNumber: "003", title: "The Antibiotic Claim", topic: "Medicine", difficulty: "INTERMEDIATE",
    caseContext: "The court must separate treatment of bacterial illness from treatment of every infection.", prompt: "Which counsel describes the evidence accurately?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "Antibiotics cure viral infections because they kill germs.", "Antibiotics are medicines that fight bacterial infections.", "The source specifically limits their action to bacteria.", "Antibiotic use and resistance", "CDC"),
      source("supported", "Antibiotics treat some bacterial infections but do not work against viruses.", "Antibiotics do not work on viruses, such as those that cause colds and flu.", "This is the source's explicit limitation.", "Antibiotic use and resistance", "CDC"),
    ],
    feedback: { correctHeading: "The distinction is supported.", incorrectHeading: "The argument generalizes too far.", correctExplanation: "The source separates bacterial infections from viral infections.", incorrectExplanation: "The fact that antibiotics fight some germs does not mean they treat viruses.", skill: "Define the category.", takeaway: "Broad words like 'germs' can hide an important qualification." },
  },
  {
    id: "history", level: 4, caseNumber: "004", title: "The History Claim", topic: "History", difficulty: "INTERMEDIATE",
    caseContext: "A primary source is being asked to establish more than it actually records.", prompt: "Which lawyer respects the source's limits?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "A diary entry proves that everyone in the city shared the writer's opinion.", "The entry records the author's personal observations.", "A single perspective cannot represent an entire population.", "Primary sources", "National Archives"),
      source("supported", "A diary can show one person's perspective, but not everyone's view.", "Primary sources provide firsthand testimony from an individual or group.", "The source's point of view and limits must be considered.", "Primary sources", "National Archives"),
    ],
    feedback: { correctHeading: "The source is being used carefully.", incorrectHeading: "One voice cannot stand for everyone.", correctExplanation: "The supported argument treats the diary as evidence of a perspective, not a census of opinion.", incorrectExplanation: "The source is firsthand, but it is still limited to its author and context.", skill: "Check representation.", takeaway: "A primary source is not automatically a complete source." },
  },
  {
    id: "technology", level: 5, caseNumber: "005", title: "The Technology Claim", topic: "Technology", difficulty: "ADVANCED",
    caseContext: "A study's observed association is being presented as a cause.", prompt: "Which conclusion avoids inventing causation?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "Because two variables appear together, one must cause the other.", "An association does not necessarily mean that one variable causes the other.", "The source explicitly cautions against this inference.", "Understanding research results", "National Institutes of Health"),
      source("supported", "An association may be informative without proving that one variable causes the other.", "Correlation does not necessarily imply causation.", "Other explanations may account for the relationship.", "Understanding research results", "National Institutes of Health"),
    ],
    feedback: { correctHeading: "The conclusion is appropriately cautious.", incorrectHeading: "Association is not proof of cause.", correctExplanation: "The supported argument preserves the distinction between correlation and causation.", incorrectExplanation: "A relationship between measurements alone cannot establish why they occur together.", skill: "Separate correlation from causation.", takeaway: "Ask what the study design can actually prove." },
  },
  {
    id: "space", level: 6, caseNumber: "006", title: "The Space Claim", topic: "Space", difficulty: "ADVANCED",
    caseContext: "A model's possibility is being confused with a confirmed discovery.", prompt: "Which argument states the evidence honestly?", correctArgumentId: "supported",
    arguments: [
      source("unsupported", "A theoretical model confirms that life exists beyond Earth.", "Models can help scientists test ideas and make predictions.", "A model is not direct confirmation of a discovery.", "How science works", "NASA"),
      source("supported", "A model can make a prediction, but further evidence is needed to confirm a discovery.", "Scientific models are tested against observations and revised when necessary.", "The claim remains open until observations support it.", "How science works", "NASA"),
    ],
    feedback: { correctHeading: "The ruling preserves uncertainty.", incorrectHeading: "A possibility is not a finding.", correctExplanation: "The source describes models as tools for testing ideas, not as proof by themselves.", incorrectExplanation: "A theoretical model may be useful without confirming that its prediction is true.", skill: "Distinguish prediction from proof.", takeaway: "Evidence must be tested against observations before a claim is confirmed." },
  },
];

function shuffleArguments(): ArgumentId[] {
  return Math.random() < 0.5
    ? ["unsupported", "supported"]
    : ["supported", "unsupported"];
}

const counselNamePool = [
  "Avery Cole",
  "Jordan Reyes",
  "Morgan Ellis",
  "Riley Bennett",
  "Taylor Brooks",
  "Casey Morgan",
  "Drew Parker",
  "Sasha Quinn",
];

function shuffleCounselNames(): [string, string] {
  const shuffled = [...counselNamePool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return [shuffled[0], shuffled[1]];
}

function getArgument(
  argumentsForCase: [CaseArgument, CaseArgument],
  id: ArgumentId,
): CaseArgument {
  return argumentsForCase.find((argument) => argument.id === id) ?? argumentsForCase[0];
}

export default function HallucinationGame() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("brief");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [argumentOrder, setArgumentOrder] = useState<ArgumentId[]>([
    "unsupported",
    "supported",
  ]);
  const [counselNames, setCounselNames] = useState<[string, string]>([
    "Avery Cole",
    "Jordan Reyes",
  ]);
  const [selectedArgument, setSelectedArgument] = useState<ArgumentId | null>(
    null,
  );
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [progressWasSaved, setProgressWasSaved] = useState<boolean | null>(null);

  const currentCase = hallucinationCases[currentLevel - 1];
  const gameProgress = progress?.games.hallucinationCourt;
  const completedLevels = gameProgress?.completedLevels ?? [];
  const highestUnlockedLevel = gameProgress?.highestUnlockedLevel ?? 1;
  const completedCount = completedLevels.length;
  const totalLevels = hallucinationCases.length;
  const correct = selectedArgument === currentCase.correctArgumentId;
  const shouldAnimate = !reduceMotion;
  const evidenceReady = stage === "evidence" || stage === "verdict";
  const progressPercent = Math.round((completedCount / totalLevels) * 100);
  const accuracyPercent = gameProgress?.totalAttempts
    ? Math.round((gameProgress.correctAttempts / gameProgress.totalAttempts) * 100)
    : 0;

  useEffect(() => {
    setProgress(getStudentProgress());
  }, []);

  const orderedArguments = useMemo(
    () => argumentOrder.map((argumentId) => getArgument(currentCase.arguments, argumentId)),
    [argumentOrder, currentCase],
  );

  function beginHearing() {
    setArgumentOrder(shuffleArguments());
    setCounselNames(shuffleCounselNames());
    setSelectedArgument(null);
    setStage("arguments");
  }

  function revealEvidence() {
    setStage("evidence");
  }

  function deliverVerdict(argumentId: ArgumentId) {
    setSelectedArgument(argumentId);
    const result = recordHallucinationResult(
      {
        level: currentLevel,
        caseId: currentCase.id,
        correct: argumentId === currentCase.correctArgumentId,
        selectedArgument: argumentId,
      },
      progress ?? undefined,
    );
    setProgress(result.progress);
    setProgressWasSaved(result.persisted);
    setStage("verdict");
  }

  function resetCurrentCase() {
    setSelectedArgument(null);
    setArgumentOrder(["unsupported", "supported"]);
    setStage("brief");
  }

  function openLevel(level: number) {
    if (level > highestUnlockedLevel) return;
    setCurrentLevel(level);
    setSelectedArgument(null);
    setArgumentOrder(["unsupported", "supported"]);
    setStage("brief");
  }

  function goToNextLevel() {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= highestUnlockedLevel && nextLevel <= totalLevels) {
      openLevel(nextLevel);
    }
  }

  return (
    <main className="hallucination-game-page">
      <section className="hc-top mahogany-section">
        <SiteNav />
        <div className="hc-page-heading">
          <div className="hc-heading-copy">
            <p className="hc-eyebrow">
              <span className="hc-eyebrow-dot" /> THE AI COURTROOM <span>/</span> EVIDENCE DIVISION
            </p>
            <h1>
              Hallucination <em>Court.</em>
            </h1>
            <p className="hc-page-intro">
              Six cases. Six opportunities to test the evidence. Decide which lawyer
              has made the argument the sources can actually support.
            </p>
          </div>
          <div className="hc-case-stamp" aria-label={`Level ${currentLevel}, one round`}>
            <span className="hc-stamp-label">NOW HEARING</span>
            <strong>CASE {currentCase.caseNumber}</strong>
            <span>LEVEL {String(currentLevel).padStart(2, "0")} <i /> ROUND 01 / 01</span>
          </div>
        </div>
      </section>

      <section className="hc-game-area">
        <div className="hc-game-wrap">
          <div className="hc-case-meta">
            <div className="hc-breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/games">Games</Link>
              <span>/</span>
              <strong>Hallucination Court</strong>
            </div>
            <div className="hc-level-progress" aria-label={`${completedCount} of ${totalLevels} levels completed`}>
              <span>{completedCount} / {totalLevels} COMPLETE</span>
              <div className="hc-progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
              <span>{accuracyPercent}% ACCURACY</span>
            </div>
          </div>

          <section className="hc-level-selector" aria-label="Choose a courtroom level">
            <div className="hc-level-selector-heading">
              <div>
                <p className="hc-section-kicker">YOUR CASE FILES</p>
                <h2>Six levels of <em>verification.</em></h2>
              </div>
              <p>Complete a case to unlock the next one. You can return to any level you have already opened.</p>
            </div>
            <div className="hc-level-list">
              {hallucinationCases.map((caseItem) => {
                const isUnlocked = caseItem.level <= highestUnlockedLevel;
                const isCompleted = completedLevels.includes(caseItem.level);
                const isCurrent = caseItem.level === currentLevel;
                return (
                  <button
                    key={caseItem.id}
                    className={`hc-level-option ${isCurrent ? "is-current" : ""} ${isCompleted ? "is-complete" : ""} ${!isUnlocked ? "is-locked" : ""}`}
                    type="button"
                    onClick={() => openLevel(caseItem.level)}
                    disabled={!isUnlocked}
                    aria-current={isCurrent ? "step" : undefined}
                    aria-label={`Level ${caseItem.level}: ${caseItem.title}${isCompleted ? ", completed" : !isUnlocked ? ", locked" : ""}`}
                  >
                    <span className="hc-level-number">
                      {isCompleted ? "✓" : !isUnlocked ? "⌑" : String(caseItem.level).padStart(2, "0")}
                    </span>
                    <span className="hc-level-copy">
                      <strong>{caseItem.title.replace("The ", "")}</strong>
                      <small>{caseItem.difficulty}</small>
                    </span>
                    {isCurrent ? <span className="hc-level-current-mark">CURRENT</span> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="hc-case-intro-row">
            <div>
              <p className="hc-section-kicker">LEVEL {String(currentLevel).padStart(2, "0")} · {currentCase.topic}</p>
              <h2>{currentCase.title.split(" ").slice(0, -1).join(" ")}<br /><em>{currentCase.title.split(" ").slice(-1).join("")}</em></h2>
              <p className="hc-case-context">{currentCase.caseContext}</p>
            </div>
            <div className="hc-claim-card">
              <span className="hc-claim-label">THE QUESTION BEFORE THE COURT</span>
              <p>{currentCase.prompt}</p>
              <span className="hc-claim-file">FILE NO. {currentCase.caseNumber}–L</span>
            </div>
          </div>

          <div className="hc-courtroom-frame">
            <div className="hc-scene-topline">
              <span><i className="hc-live-dot" /> {stage === "brief" ? "AWAITING ORDER" : "IN SESSION"}</span>
              <span>THE PEOPLE VS. AN UNSUPPORTED CLAIM</span>
            </div>
            <div className={`hc-courtroom-scene ${stage !== "brief" ? "is-active" : ""}`}>
              <Image
                src="/hallucination-courtroom-scene.png"
                alt="A courtroom viewed from the judge's seat, with two lawyers facing the bench from opposite lecterns."
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1200px"
                className="hc-scene-image"
              />
              <div className="hc-scene-vignette" />
              <div className="hc-scene-caption">
                <span>THE COURT IS IN SESSION</span>
                <span>YOU ARE THE JUDGE</span>
              </div>
              <AnimatePresence mode="wait">
                {stage === "arguments" || evidenceReady ? (
                  <motion.div
                    key={`${currentCase.id}-arguments`}
                    className="hc-dialogue-grid"
                    initial={shouldAnimate ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  >
                    {orderedArguments.map((argument, index) => (
                      <motion.article
                        key={argument.id}
                        className={`hc-speech-bubble hc-speech-${index === 0 ? "left" : "right"}`}
                        initial={shouldAnimate ? { opacity: 0, y: 28, x: index === 0 ? -22 : 22, scale: 0.97 } : false}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.56, delay: reduceMotion ? 0 : index * 0.32, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div className="hc-speech-topline">
                          <span className="hc-attorney-number">0{index + 1}</span>
                          <div>
                            <strong>{counselNames[index]}</strong>
                            <small>COUNSEL {index === 0 ? "A" : "B"}</small>
                          </div>
                          <span className="hc-speech-mark" aria-hidden="true">“</span>
                        </div>
                        <p>{argument.opening}</p>
                      </motion.article>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {stage === "brief" ? (
                <motion.div
                  className="hc-call-to-order"
                  initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.2 }}
                >
                  <span className="hc-call-icon" aria-hidden="true">§</span>
                  <p>Two lawyers are ready to make their case.</p>
                  <button className="hc-button hc-button-gold" type="button" onClick={beginHearing}>
                    Call the court to order <span aria-hidden="true">→</span>
                  </button>
                </motion.div>
              ) : null}
              {stage === "arguments" ? (
                <motion.div
                  className="hc-scene-next"
                  initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : 0.8 }}
                >
                  <button className="hc-button hc-button-gold" type="button" onClick={revealEvidence}>
                    Examine the exhibits <span aria-hidden="true">→</span>
                  </button>
                </motion.div>
              ) : null}
              {evidenceReady ? (
                <div className="hc-evidence-seal" aria-hidden="true">
                  <span>EXHIBITS</span><strong>ADMITTED</strong>
                </div>
              ) : null}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {evidenceReady ? (
              <motion.section
                key={`${currentCase.id}-evidence`}
                className="hc-evidence-section"
                aria-labelledby="hc-evidence-title"
                initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: reduceMotion ? 0 : 0.52 }}
              >
                <div className="hc-evidence-heading">
                  <div>
                    <p className="hc-section-kicker">THE RECORD</p>
                    <h3 id="hc-evidence-title">Read the <em>evidence.</em></h3>
                  </div>
                  <p>Open the original sources. Look for the details, conditions, and qualifications that each lawyer uses—or leaves out.</p>
                </div>
                <div className="hc-evidence-grid">
                  {orderedArguments.map((argument, index) => (
                    <motion.article
                      key={argument.id}
                      className="hc-exhibit-card"
                      initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.14 * index }}
                    >
                      <div className="hc-exhibit-topline">
                        <span>EXHIBIT 0{index + 1}</span>
                        <span className="hc-exhibit-type">ORIGINAL SOURCE</span>
                      </div>
                      <p className="hc-source-organization">{argument.sourceOrganization}</p>
                      <h4>{argument.sourceTitle}</h4>
                      <blockquote>“{argument.sourceExcerpt}”</blockquote>
                      <p className="hc-source-note">{argument.sourceNote}</p>
                      <a href={argument.sourceUrl} target="_blank" rel="noreferrer" className="hc-source-link">
                        Read the full source <span aria-hidden="true">↗</span>
                      </a>
                    </motion.article>
                  ))}
                </div>

                {stage === "evidence" ? (
                  <motion.div
                    className="hc-verdict-prompt"
                    initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.42, delay: reduceMotion ? 0 : 0.55 }}
                  >
                    <div>
                      <span className="hc-verdict-overline">YOUR DECISION</span>
                      <h3>Which lawyer made the stronger case?</h3>
                      <p>Choose the argument best supported by the full sources—not the one that simply sounds more convincing.</p>
                    </div>
                    <div className="hc-verdict-options">
                      {orderedArguments.map((argument, index) => (
                        <button
                          key={argument.id}
                          className="hc-verdict-choice"
                          type="button"
                          onClick={() => deliverVerdict(argument.id)}
                        >
                          <span className="hc-choice-letter">{index === 0 ? "A" : "B"}</span>
                          <span>Choose Counsel {index === 0 ? "A" : "B"} · {counselNames[index]}</span>
                          <span className="hc-choice-arrow" aria-hidden="true">→</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}

                {stage === "verdict" && selectedArgument ? (
                  <motion.div
                    className={`hc-verdict-result ${correct ? "hc-result-correct" : "hc-result-incorrect"}`}
                    initial={shouldAnimate ? { opacity: 0, y: 24, scale: 0.985 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.45 }}
                    role="status"
                    aria-live="polite"
                  >
                    <div className="hc-result-icon" aria-hidden="true">{correct ? "✓" : "✕"}</div>
                    <div className="hc-result-copy">
                      <p className="hc-section-kicker">{correct ? "RULING: WELL REASONED" : "RULING: REVISIT THE RECORD"}</p>
                      <h3>{correct ? currentCase.feedback.correctHeading : currentCase.feedback.incorrectHeading}</h3>
                      <p>{correct ? currentCase.feedback.correctExplanation : currentCase.feedback.incorrectExplanation}</p>
                      <div className="hc-learning-note">
                        <strong>{currentCase.feedback.skill}</strong>
                        <span>{currentCase.feedback.takeaway}</span>
                      </div>
                      <p className={`hc-save-note ${progressWasSaved === false ? "is-unsaved" : ""}`}>
                        <span aria-hidden="true">◈</span> {progressWasSaved === false
                          ? "This browser did not allow progress storage, so this result may not be available next visit. No name or password is collected."
                          : "Your case result is saved in this browser for a future student dashboard. No name or password is collected here."}
                      </p>
                      <div className="hc-result-actions">
                        <button className="hc-button hc-button-dark" type="button" onClick={resetCurrentCase}>
                          Replay this case <span aria-hidden="true">↻</span>
                        </button>
                        {currentLevel < totalLevels && highestUnlockedLevel > currentLevel ? (
                          <button className="hc-button hc-button-gold" type="button" onClick={goToNextLevel}>
                            Next level <span aria-hidden="true">→</span>
                          </button>
                        ) : null}
                        <Link href="/games" className="hc-text-link">Return to all courts <span aria-hidden="true">→</span></Link>
                      </div>
                    </div>
                    <div className="hc-level-complete">
                      <span>LEVEL {String(currentLevel).padStart(2, "0")}</span>
                      <strong>{correct ? "1 / 1" : "0 / 1"}</strong>
                      <small>{correct ? "CORRECT" : "ATTEMPT RECORDED"}</small>
                      <small>{completedCount} OF {totalLevels} LEVELS OPENED</small>
                    </div>
                  </motion.div>
                ) : null}
              </motion.section>
            ) : null}
          </AnimatePresence>

          <div className="hc-bottom-nav">
            <Link href="/" className="hc-text-link">← Back home</Link>
            <span>THE AI COURTROOM <i>·</i> EVIDENCE DIVISION</span>
            <Link href="/games" className="hc-text-link">All games →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
