"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import {
  getStudentProgress,
  saveStudentProgress,
  type StudentProgress,
} from "@/lib/studentProgress";

const XP_PER_RANK = 300;
const CASES_PER_COURT = 6;

const rankNames = [
  "Court Clerk",
  "Junior Advocate",
  "Associate Counsel",
  "Senior Counsel",
  "Lead Counsel",
  "Courtroom Strategist",
  "Chief Justice",
];

type RecentActivity = {
  key: string;
  date: string;
  game: string;
  title: string;
  result: string;
  positive: boolean;
};

function safeDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function StudentDashboard() {
  const reduceMotion = useReducedMotion();

  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const refreshProgress = useCallback(() => {
    const latest = getStudentProgress();

    setProgress(latest);
    setNameDraft(latest.profile.displayName ?? "");
  }, []);

  useEffect(() => {
    refreshProgress();

    window.addEventListener("student-progress-updated", refreshProgress);
    window.addEventListener("storage", refreshProgress);

    return () => {
      window.removeEventListener("student-progress-updated", refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, [refreshProgress]);

  const dashboard = useMemo(() => {
    if (!progress) return null;

    const hallucination = progress.games.hallucinationCourt;
    const ethics = progress.games.ethicsCourt;
    const prompting = progress.games.promptingCourt;

    const ethicsAttempts = ethics?.totalAttempts ?? 0;
    const ethicsCorrect = ethics?.correctAttempts ?? 0;

    const promptingAttempts = prompting?.totalAttempts ?? 0;
    const promptingWins = prompting?.wins ?? 0;

    const totalAttempts =
      hallucination.totalAttempts + ethicsAttempts + promptingAttempts;

    const totalWins =
      hallucination.correctAttempts + ethicsCorrect + promptingWins;

    const accuracy =
      totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : null;

    const completedCases =
      hallucination.completedLevels.length +
      (ethics?.completedLevels.length ?? 0) +
      (prompting?.completedLevels.length ?? 0);

    const rankLevel = Math.floor(progress.xp / XP_PER_RANK) + 1;

    const rankName = rankNames[Math.min(rankLevel - 1, rankNames.length - 1)];

    const nextRankName = rankNames[Math.min(rankLevel, rankNames.length - 1)];

    const hasMaxRank = rankLevel >= rankNames.length;
    const xpIntoRank = progress.xp % XP_PER_RANK;

    const games = [
      {
        id: "hallucination-court",

        title: "Hallucination Court",
        description: "Separate reliable evidence from fabricated claims.",
        href: "/hallucination-court",
        attempts: hallucination.totalAttempts,
        completed: hallucination.completedLevels.length,
        unlocked: hallucination.highestUnlockedLevel,
        performance: hallucination.totalAttempts
          ? Math.round(
              (hallucination.correctAttempts / hallucination.totalAttempts) *
                100,
            )
          : null,
        performanceLabel: "accuracy",
      },
      {
        id: "prompting-court",

        title: "Prompting Court",
        description: "Practice writing precise and effective prompts.",
        href: "/prompting-court",
        attempts: promptingAttempts,
        completed: prompting?.completedLevels.length ?? 0,
        unlocked: prompting?.highestUnlockedLevel ?? 1,
        performance: promptingAttempts
          ? Math.round((promptingWins / promptingAttempts) * 100)
          : null,
        performanceLabel: "win rate",
      },
      {
        id: "ethics-court",

        title: "Ethics Court",
        description: "Examine the human impact of artificial intelligence.",
        href: "/ethics-court",
        attempts: ethicsAttempts,
        completed: ethics?.completedLevels.length ?? 0,
        unlocked: ethics?.highestUnlockedLevel ?? 1,
        performance: ethicsAttempts
          ? Math.round((ethicsCorrect / ethicsAttempts) * 100)
          : null,
        performanceLabel: "accuracy",
      },
    ];

    const activity: RecentActivity[] = [
      ...hallucination.history.map((item) => ({
        key: `h-${item.completedAt}-${item.level} `,
        date: item.completedAt,
        game: "Hallucination Court",
        title: `Case ${item.level}`,
        result: item.correct ? "Correct ruling" : "Attempt recorded",
        positive: item.correct,
      })),

      ...(ethics?.history ?? []).map((item) => ({
        key: `e-${item.completedAt}-${item.level} `,
        date: item.completedAt,
        game: "Ethics Court",
        title: `Case ${item.level}`,
        result: item.correct ? "Ethical ruling" : "Attempt recorded",
        positive: item.correct,
      })),

      ...(prompting?.history ?? []).map((item) => ({
        key: `p-${item.completedAt}-${item.level}`,
        date: item.completedAt,
        game: "Prompting Court",
        title: `Case ${item.level} `,
        result: item.won ? "Case won" : "Case not won",
        positive: item.won,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return {
      games,
      accuracy,
      completedCases,
      rankLevel,
      rankName,
      nextRankName,
      hasMaxRank,
      xpPercent: hasMaxRank
        ? 100
        : Math.round((xpIntoRank / XP_PER_RANK) * 100),
      xpToNext: hasMaxRank ? 0 : XP_PER_RANK - xpIntoRank,
      activity,
    };
  }, [progress]);

  const reveal = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: {
      duration: reduceMotion ? 0 : 0.45,
      delay: reduceMotion ? 0 : delay,
      ease: "easeOut" as const,
    },
  });

  function saveDisplayName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!progress) return;

    const updated: StudentProgress = {
      ...progress,
      profile: {
        ...progress.profile,
        displayName: nameDraft.trim().slice(0, 32) || null,
      },
      updatedAt: new Date().toISOString(),
    };

    const saved = saveStudentProgress(updated);

    setProgress(updated);
    setEditingName(false);

    setSavedMessage(
      saved
        ? "Your name has been saved."
        : "Your browser could not save your name.",
    );

    window.setTimeout(() => setSavedMessage(""), 2800);
  }

  if (!progress || !dashboard) {
    return (
      <main className="db-page">
        <section className="db-hero">
          <SiteNav />

          <div className="db-container db-hero-inner db-loading">
            <div>
              <p className="db-eyebrow">YOUR COURTROOM</p>
              <h1>
                Welcome back,
                <span>Counsel.</span>
              </h1>
              <p className="db-hero-text">
                Loading your saved courtroom record...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const displayName = progress.profile.displayName || "Counsel";
  const hasActivity = dashboard.activity.length > 0;

  return (
    <main className="db-page">
      {/* HERO */}
      <section className="db-hero">
        <SiteNav />

        <div className="db-container db-hero-inner">
          <motion.div
            className="db-hero-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: "easeOut",
            }}
          >
            <p className="db-eyebrow db-hero-eyebrow">YOUR COURTROOM RECORD</p>

            <h1>
              Welcome back,
              <span>{displayName}.</span>
            </h1>

            <p className="db-hero-text">
              {hasActivity
                ? "Here's how your cases are going. Pick up where you left off."
                : "Your first case is waiting. Choose a court and take it at your own pace."}
            </p>
          </motion.div>

          <motion.aside
            className="db-rank-seal"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : 0.12,
              ease: "easeOut",
            }}
          >
            <span className="db-rank-label">CURRENT RANK</span>

            <strong>{String(dashboard.rankLevel).padStart(2, "0")}</strong>

            <b>{dashboard.rankName}</b>

            <span className="db-rank-xp">
              {progress.xp.toLocaleString()} total XP
            </span>
          </motion.aside>
        </div>
      </section>

      {/* DASHBOARD CONTENT */}
      <section className="db-content">
        <div className="db-wrap">
          {/* STATISTICS */}
          <motion.div {...reveal(0)}>
            <div className="stats db-stats">
              <div className="stat">
                <div className="stat-title">Experience</div>

                <div className="stat-value">
                  {progress.xp.toLocaleString()}
                  <small>XP</small>
                </div>

                <div className="stat-desc db-stat-desc">
                  <progress
                    className="progress progress-primary db-progress"
                    value={dashboard.xpPercent}
                    max={100}
                    aria-label="Progress to next rank"
                  />

                  <span>
                    {dashboard.hasMaxRank
                      ? "Highest rank reached"
                      : `${dashboard.xpToNext} XP to ${dashboard.nextRankName}`}
                  </span>
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Cases explored</div>

                <div className="stat-value">
                  {dashboard.completedCases}
                  <small> / 18</small>
                </div>

                <div className="stat-desc">
                  Completed across all three courts
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Success rate</div>

                <div className="stat-value">
                  {dashboard.accuracy === null ? "—" : `${dashboard.accuracy}%`}
                </div>

                <div className="stat-desc">Based on your recorded attempts</div>
              </div>
            </div>
          </motion.div>

          {/* COURT PROGRESS */}
          <section className="db-section">
            <motion.div className="db-section-heading" {...reveal(0)}>
              <div>
                <p className="db-eyebrow">YOUR PROGRESS</p>
                <h2>
                  The three <em>courts.</em>
                </h2>
              </div>

              <Link href="/games" className="db-text-link">
                Explore all games <span aria-hidden="true">→</span>
              </Link>
            </motion.div>

            <div className="db-game-grid">
              {dashboard.games.map((game, index) => (
                <motion.article
                  key={game.id}
                  className="card db-card db-game-card"
                  {...reveal(index * 0.07)}
                >
                  <div className="card-body">
                    <h3>{game.title}</h3>

                    <p className="db-game-description">{game.description}</p>

                    <div className="db-game-divider" />

                    <div className="db-game-progress-row">
                      <span>Cases explored</span>

                      <strong>
                        {game.completed}/{CASES_PER_COURT}
                      </strong>
                    </div>

                    <progress
                      className="progress progress-primary db-progress"
                      value={Math.min(game.completed, CASES_PER_COURT)}
                      max={CASES_PER_COURT}
                      aria-label={`${game.title} progress`}
                    />

                    <div className="db-game-meta">
                      <span>Level {game.unlocked} unlocked</span>

                      {game.performance !== null && (
                        <span>
                          {game.performance}% {game.performanceLabel}
                        </span>
                      )}
                    </div>

                    <Link
                      href={game.href}
                      className="btn btn-primary db-game-button"
                    >
                      {game.completed > 0 ? "Continue court" : "Enter court"}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* HISTORY + PROFILE */}
          <div className="db-lower">
            <motion.section className="card db-card db-panel" {...reveal(0)}>
              <div className="card-body">
                <div className="db-panel-heading">
                  <div>
                    <p className="db-eyebrow">YOUR RECORD</p>
                    <h2>
                      Recent <em>activity.</em>
                    </h2>
                  </div>

                  <span className="db-record-count">
                    {dashboard.activity.length} / 5
                  </span>
                </div>

                {hasActivity ? (
                  <ul className="db-history">
                    {dashboard.activity.map((item) => (
                      <li key={item.key}>
                        <span
                          className={`db-history-indicator ${
                            item.positive ? "is-positive" : ""
                          }`}
                          aria-hidden="true"
                        >
                          {item.positive ? "✓" : "–"}
                        </span>

                        <div className="db-history-copy">
                          <strong>{item.title}</strong>
                          <span>{item.game}</span>
                        </div>

                        <div className="db-history-result">
                          <span
                            className={`badge db-result-badge ${
                              item.positive ? "is-positive" : "is-neutral"
                            }`}
                          >
                            {item.result}
                          </span>

                          <time dateTime={item.date}>
                            {safeDate(item.date)}
                          </time>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="db-empty">
                    <h3>Your record starts here.</h3>
                    <p>
                      Complete your first case to see your progress and activity
                      here.
                    </p>

                    <Link href="/games" className="btn btn-primary">
                      Browse the courts →
                    </Link>
                  </div>
                )}
              </div>
            </motion.section>

            <motion.aside
              className="card db-card db-panel db-profile"
              {...reveal(0.08)}
            >
              <div className="card-body">
                <p className="db-eyebrow">PERSONALIZATION</p>

                <h2>
                  Make it <em>yours.</em>
                </h2>

                <p className="db-profile-description">
                  Choose a display name for your courtroom record. Your progress
                  is saved in this browser.
                </p>

                {editingName ? (
                  <form className="db-name-form" onSubmit={saveDisplayName}>
                    <label htmlFor="db-display-name">Display name</label>

                    <input
                      id="db-display-name"
                      className="input input-bordered db-name-input"
                      value={nameDraft}
                      onChange={(event) => setNameDraft(event.target.value)}
                      maxLength={32}
                      placeholder="Enter a display name"
                    />

                    <div className="db-name-actions">
                      <button type="submit" className="btn btn-primary">
                        Save name
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          setEditingName(false);
                          setNameDraft(progress.profile.displayName ?? "");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline db-profile-button"
                    onClick={() => setEditingName(true)}
                  >
                    {progress.profile.displayName
                      ? "Edit display name"
                      : "Add a display name"}
                  </button>
                )}

                {savedMessage && (
                  <p className="db-saved" role="status">
                    {savedMessage}
                  </p>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
