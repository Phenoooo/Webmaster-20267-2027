"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Footer from "@/components/Footer";
import SiteNav from "@/components/SiteNav";
import {
  getStudentProgress,
  saveStudentProgress,
  type StudentProgress,
} from "@/lib/studentProgress";

const XP_PER_RANK = 300;
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
  if (Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function xpForGame(progress: StudentProgress, prefix: string): number {
  return progress.xpAwards.filter((award) => award.startsWith(`${prefix}:`)).length * 50;
}

export default function StudentDashboard() {
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
    const totalAttempts = hallucination.totalAttempts + ethicsAttempts + promptingAttempts;
    const totalWins = hallucination.correctAttempts + ethicsCorrect + promptingWins;
    const accuracy = totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : 0;
    const completedCases =
      hallucination.completedLevels.length +
      (ethics?.completedLevels.length ?? 0) +
      (prompting?.completedLevels.length ?? 0);
    const rankLevel = Math.floor(progress.xp / XP_PER_RANK) + 1;
    const rankName = rankNames[Math.min(rankLevel - 1, rankNames.length - 1)];
    const xpIntoRank = progress.xp % XP_PER_RANK;
    const hasMaxRank = rankLevel >= rankNames.length;
    const xpPercent = hasMaxRank ? 100 : Math.round((xpIntoRank / XP_PER_RANK) * 100);

    const games = [
      {
        id: "hallucination-court",
        title: "Hallucination Court",
        href: "/hallucination-court",
        attempts: hallucination.totalAttempts,
        completed: hallucination.completedLevels.length,
        unlocked: hallucination.highestUnlockedLevel,
        performance: hallucination.totalAttempts
          ? Math.round((hallucination.correctAttempts / hallucination.totalAttempts) * 100)
          : 0,
        performanceLabel: "Accuracy",
        xp: xpForGame(progress, "hallucination-court"),
        symbol: "§",
      },
      {
        id: "prompting-court",
        title: "Prompting Court",
        href: "/prompting-court",
        attempts: promptingAttempts,
        completed: prompting?.completedLevels.length ?? 0,
        unlocked: prompting?.highestUnlockedLevel ?? 1,
        performance: promptingAttempts
          ? Math.round((promptingWins / promptingAttempts) * 100)
          : 0,
        performanceLabel: "Win rate",
        xp: xpForGame(progress, "prompting-court"),
        symbol: "✎",
      },
      {
        id: "ethics-court",
        title: "Ethics Court",
        href: "/ethics-court",
        attempts: ethicsAttempts,
        completed: ethics?.completedLevels.length ?? 0,
        unlocked: ethics?.highestUnlockedLevel ?? 1,
        performance: ethicsAttempts ? Math.round((ethicsCorrect / ethicsAttempts) * 100) : 0,
        performanceLabel: "Accuracy",
        xp: xpForGame(progress, "ethics-court"),
        symbol: "⚖",
      },
    ];

    const activity: RecentActivity[] = [
      ...hallucination.history.map((item) => ({
        key: `h-${item.completedAt}-${item.level}`,
        date: item.completedAt,
        game: "Hallucination Court",
        title: `Case ${String(item.level).padStart(2, "0")}`,
        result: item.correct ? "Correct ruling" : "Attempt recorded",
        positive: item.correct,
      })),
      ...(ethics?.history ?? []).map((item) => ({
        key: `e-${item.completedAt}-${item.level}`,
        date: item.completedAt,
        game: "Ethics Court",
        title: `Case ${String(item.level).padStart(2, "0")}`,
        result: item.correct ? "Ethical ruling" : "Attempt recorded",
        positive: item.correct,
      })),
      ...(prompting?.history ?? []).map((item) => ({
        key: `p-${item.completedAt}-${item.level}`,
        date: item.completedAt,
        game: "Prompting Court",
        title: `Case ${String(item.level).padStart(2, "0")}`,
        result: item.won ? "Case won" : "Case not won",
        positive: item.won,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

    return {
      games,
      accuracy,
      completedCases,
      rankLevel,
      rankName,
      xpIntoRank,
      xpPercent,
      xpToNext: hasMaxRank ? 0 : XP_PER_RANK - xpIntoRank,
      hasMaxRank,
      longestStreak: Math.max(hallucination.bestStreak, ethics?.bestStreak ?? 0),
      activity,
    };
  }, [progress]);

  function saveDisplayName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!progress) return;
    const updated: StudentProgress = {
      ...progress,
      profile: { ...progress.profile, displayName: nameDraft.trim().slice(0, 32) || null },
      updatedAt: new Date().toISOString(),
    };
    const saved = saveStudentProgress(updated);
    setProgress(updated);
    setEditingName(false);
    setSavedMessage(saved ? "Profile saved in this browser." : "This browser could not save your profile.");
    window.setTimeout(() => setSavedMessage(""), 2800);
  }

  if (!progress || !dashboard) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-hero mahogany-section"><SiteNav /><div className="dashboard-hero-inner"><p className="dashboard-eyebrow">THE AI COURTROOM · STUDENT RECORD</p><h1>Your <em>dashboard.</em></h1><p>Loading your saved courtroom record…</p></div></section>
      </main>
    );
  }

  const displayName = progress.profile.displayName || "Counsel";
  const hasActivity = dashboard.activity.length > 0;

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero mahogany-section">
        <SiteNav />
        <div className="dashboard-hero-inner">
          <div>
            <h1>Welcome back,<br /><em>{displayName}.</em></h1>
          </div>
          <div className="dashboard-rank-seal">
            <span>YOUR CURRENT RANK</span>
            <strong>{String(dashboard.rankLevel).padStart(2, "0")}</strong>
            <b>{dashboard.rankName}</b>
            <small>THE AI COURTROOM</small>
          </div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="dashboard-wrap">
          <div className="dashboard-summary-grid">
            <article className="dashboard-stat-card dashboard-xp-card">
              <span className="dashboard-stat-label">TOTAL EXPERIENCE</span>
              <strong>{progress.xp.toLocaleString()} <small>XP</small></strong>
              <div className="dashboard-xp-progress"><span style={{ width: `${dashboard.xpPercent}%` }} /></div>
              <small className="dashboard-next-rank">{dashboard.hasMaxRank ? "MAX RANK ACHIEVED" : `${dashboard.xpToNext} XP to next rank`}</small>
            </article>
            <article className="dashboard-stat-card">
              <span className="dashboard-stat-label">CASES ATTEMPTED</span>
              <strong>{dashboard.completedCases}<small> / 18</small></strong>
            </article>
            <article className="dashboard-stat-card">
              <span className="dashboard-stat-label">OVERALL SUCCESS</span>
              <strong>{dashboard.accuracy}<small>%</small></strong>
            </article>
            <article className="dashboard-stat-card">
              <span className="dashboard-stat-label">BEST STREAK</span>
              <strong>{dashboard.longestStreak}<small> cases</small></strong>
            </article>
          </div>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div><h2>Your game <em>progress.</em></h2></div>
              <Link href="/games">Explore all games →</Link>
            </div>
            <div className="dashboard-game-grid">
              {dashboard.games.map((game) => (
                <article className={`dashboard-game-card dashboard-game-${game.id}`} key={game.id}>
                  <div className="dashboard-game-topline"><span className="dashboard-game-symbol">{game.symbol}</span><span>{game.xp.toLocaleString()} XP</span></div>
                  <h3>{game.title}</h3>
                  <div className="dashboard-game-metrics"><div><strong>{game.completed}/6</strong><span>Cases attempted</span></div><div><strong>{game.performance}%</strong><span>{game.performanceLabel}</span></div><div><strong>{game.attempts}</strong><span>Total tries</span></div></div>
                  <div className="dashboard-game-progress"><span style={{ width: `${Math.min(100, (game.completed / 6) * 100)}%` }} /></div>
                  <div className="dashboard-game-bottom"><small>LEVEL {String(game.unlocked).padStart(2, "0")} UNLOCKED</small><Link href={game.href}>Continue court <span>→</span></Link></div>
                </article>
              ))}
            </div>
          </section>

          <div className="dashboard-lower-grid">
            <section className="dashboard-activity-panel">
              <div className="dashboard-section-heading compact"><div><h2>Case <em>history.</em></h2></div></div>
              {hasActivity ? (
                <div className="dashboard-activity-list">
                  {dashboard.activity.map((item) => (
                    <article className="dashboard-activity-item" key={item.key}>
                      <span className={`dashboard-activity-status ${item.positive ? "is-positive" : ""}`}>{item.positive ? "✓" : "·"}</span>
                      <div><strong>{item.title} · {item.game}</strong><p>{item.result}</p></div>
                      <time>{safeDate(item.date)}</time>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-state"><span>§</span><h3>Your first case is waiting.</h3><Link href="/games" className="dashboard-inline-link">Choose a game →</Link></div>
              )}
            </section>

            <aside className="dashboard-profile-panel">
              <h2>Make this record <em>yours.</em></h2>
              <div className="dashboard-learner-id"><span>LEARNER ID</span><code>{progress.learnerId.slice(0, 8).toUpperCase()}</code></div>
              {editingName ? (
                <form className="dashboard-name-form" onSubmit={saveDisplayName}>
                  <label htmlFor="dashboard-display-name">DISPLAY NAME</label>
                  <input id="dashboard-display-name" value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} maxLength={32} placeholder="Enter a display name" />
                  <div><button type="submit">Save name</button><button type="button" onClick={() => { setEditingName(false); setNameDraft(progress.profile.displayName ?? ""); }}>Cancel</button></div>
                </form>
              ) : (
                <button className="dashboard-edit-name" type="button" onClick={() => setEditingName(true)}>{progress.profile.displayName ? "Edit display name" : "Add a display name"} →</button>
              )}
              {savedMessage ? <p className="dashboard-saved-message" role="status">{savedMessage}</p> : null}
              <div className="dashboard-storage-note"><span>◈</span><p>Saved in this browser only.</p></div>
            </aside>
          </div>
          <div className="dashboard-bottom-links"><Link href="/">← Home</Link><Link href="/games">All games →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
