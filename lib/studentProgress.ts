import { hallucinationCases } from "./hallucinationCases";

/**
 * Browser-local learner progress storage.
 *
 * This is intentionally anonymous and local-only until the project adds
 * authentication and a backend database. Keep schemaVersion so a future
 * dashboard/backend migration can safely transform older records.
 */
export const STUDENT_PROGRESS_STORAGE_KEY = "ai-learning-portal.student-progress.v1";

export type GameResult = {
  gameId: "hallucination-court";
  level: number;
  caseId: string;
  correct: boolean;
  selectedArgument: "unsupported" | "supported";
  completedAt: string;
};

export type PromptingGameResult = {
  gameId: "prompting-court";
  level: number;
  caseId: string;
  score: number;
  won: boolean;
  questionCount: number;
  completedAt: string;
};

export type PromptingGameProgress = {
  highestUnlockedLevel: number;
  completedLevels: number[];
  totalAttempts: number;
  wins: number;
  bestScore: number;
  history: PromptingGameResult[];
};

function createEmptyPromptingProgress(): PromptingGameProgress {
  return {
    highestUnlockedLevel: 1,
    completedLevels: [],
    totalAttempts: 0,
    wins: 0,
    bestScore: 0,
    history: [],
  };
}

export type EthicsGameResult = {
  gameId: "ethics-court";
  level: number;
  caseId: string;
  correct: boolean;
  selectedArgument: "unethical" | "responsible";
  completedAt: string;
};

export type EthicsGameProgress = {
  highestUnlockedLevel: number;
  completedLevels: number[];
  totalAttempts: number;
  correctAttempts: number;
  currentStreak: number;
  bestStreak: number;
  history: EthicsGameResult[];
};

function createEmptyEthicsProgress(): EthicsGameProgress {
  return {
    highestUnlockedLevel: 1,
    completedLevels: [],
    totalAttempts: 0,
    correctAttempts: 0,
    currentStreak: 0,
    bestStreak: 0,
    history: [],
  };
}

export type StudentProgress = {
  schemaVersion: 1;
  /** Total XP earned across all three games. */
  xp: number;
  /** Milestone keys prevent replaying a case to farm XP. */
  xpAwards: string[];
  learnerId: string;
  profile: {
    displayName: string | null;
  };
  createdAt: string;
  updatedAt: string;
  games: {
    hallucinationCourt: {
      highestUnlockedLevel: number;
      completedLevels: number[];
      totalAttempts: number;
      correctAttempts: number;
      currentStreak: number;
      bestStreak: number;
      history: GameResult[];
    };
    /** Optional while reading older v1 records; filled on first ethics use. */
    ethicsCourt?: EthicsGameProgress;
    /** Optional while reading records created before Prompting Court existed. */
    promptingCourt?: PromptingGameProgress;
  };
};

function createLearnerId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `learner-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyProgress(): StudentProgress {
  const now = new Date().toISOString();

  return {
    schemaVersion: 1,
    xp: 0,
    xpAwards: [],
    learnerId: createLearnerId(),
    profile: {
      displayName: null,
    },
    createdAt: now,
    updatedAt: now,
    games: {
      hallucinationCourt: {
        highestUnlockedLevel: 1,
        completedLevels: [],
        totalAttempts: 0,
        correctAttempts: 0,
        currentStreak: 0,
        bestStreak: 0,
        history: [],
      },
      ethicsCourt: createEmptyEthicsProgress(),
      promptingCourt: createEmptyPromptingProgress(),
    },
  };
}

function isStudentProgress(value: unknown): value is StudentProgress {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<StudentProgress>;
  const game = candidate.games?.hallucinationCourt;

  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.learnerId === "string" &&
    !!game &&
    Array.isArray(game.completedLevels) &&
    Array.isArray(game.history) &&
    typeof game.highestUnlockedLevel === "number" &&
    typeof game.totalAttempts === "number" &&
    typeof game.correctAttempts === "number"
  );
}

const XP_FOR_FIRST_ATTEMPT = 50;
const XP_FOR_FIRST_MASTERY = 50;

type ProgressGameId = "hallucination-court" | "ethics-court" | "prompting-court";

function xpAwardKey(gameId: ProgressGameId, level: number, milestone: "attempt" | "mastery") {
  return `${gameId}:${level}:${milestone}`;
}

/** Backfill XP milestones from results saved before the dashboard existed. */
function normalizeStudentProgress(progress: StudentProgress): StudentProgress {
  const games = {
    ...progress.games,
    ethicsCourt: progress.games.ethicsCourt ?? createEmptyEthicsProgress(),
    promptingCourt: progress.games.promptingCourt ?? createEmptyPromptingProgress(),
  };

  const existingAwards = Array.isArray(progress.xpAwards) ? [...progress.xpAwards] : [];
  const awards = new Set(existingAwards);
  const legacyRecords: Array<{
    gameId: ProgressGameId;
    level: number;
    mastered: boolean;
  }> = [
    ...games.hallucinationCourt.history.map((item) => ({
      gameId: "hallucination-court" as const,
      level: item.level,
      mastered: item.correct,
    })),
    ...games.ethicsCourt.history.map((item) => ({
      gameId: "ethics-court" as const,
      level: item.level,
      mastered: item.correct,
    })),
    ...games.promptingCourt.history.map((item) => ({
      gameId: "prompting-court" as const,
      level: item.level,
      mastered: item.won,
    })),
  ];

  for (const record of legacyRecords) {
    awards.add(xpAwardKey(record.gameId, record.level, "attempt"));
    if (record.mastered) awards.add(xpAwardKey(record.gameId, record.level, "mastery"));
  }

  // A few older records may retain completed levels but have trimmed result history.
  for (const level of games.hallucinationCourt.completedLevels) {
    awards.add(xpAwardKey("hallucination-court", level, "attempt"));
  }
  for (const level of games.ethicsCourt.completedLevels) {
    awards.add(xpAwardKey("ethics-court", level, "attempt"));
  }
  for (const level of games.promptingCourt.completedLevels) {
    awards.add(xpAwardKey("prompting-court", level, "attempt"));
  }

  const xpAwards = Array.from(awards);
  const calculatedXp = xpAwards.length * XP_FOR_FIRST_ATTEMPT;
  // Every milestone is worth 50 XP, including the mastery milestones.
  return {
    ...progress,
    xp: Math.max(typeof progress.xp === "number" ? progress.xp : 0, calculatedXp),
    xpAwards,
    games,
  };
}

function awardCaseXp(
  progress: StudentProgress,
  gameId: ProgressGameId,
  level: number,
  mastered: boolean,
): { progress: StudentProgress; xpEarned: number } {
  const awards = new Set(progress.xpAwards ?? []);
  let xpEarned = 0;
  const attemptKey = xpAwardKey(gameId, level, "attempt");
  const masteryKey = xpAwardKey(gameId, level, "mastery");

  if (!awards.has(attemptKey)) {
    awards.add(attemptKey);
    xpEarned += XP_FOR_FIRST_ATTEMPT;
  }
  if (mastered && !awards.has(masteryKey)) {
    awards.add(masteryKey);
    xpEarned += XP_FOR_FIRST_MASTERY;
  }

  return {
    progress: {
      ...progress,
      xp: (progress.xp ?? 0) + xpEarned,
      xpAwards: Array.from(awards),
    },
    xpEarned,
  };
}

/** Read the saved learner record, creating an anonymous one on first visit. */
export function getStudentProgress(): StudentProgress {
  if (typeof window === "undefined") return createEmptyProgress();

  try {
    const stored = window.localStorage.getItem(STUDENT_PROGRESS_STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isStudentProgress(parsed)) {
        const normalized = normalizeStudentProgress(parsed);
        // Upgrade older browser records in place without losing existing results.
        if (
          parsed.xp !== normalized.xp ||
          !Array.isArray(parsed.xpAwards) ||
          !parsed.games.ethicsCourt ||
          !parsed.games.promptingCourt
        ) {
          saveStudentProgress(normalized);
        }
        return normalized;
      }
    }
  } catch {
    // A blocked or malformed localStorage entry should not prevent gameplay.
  }

  const fresh = createEmptyProgress();
  saveStudentProgress(fresh);
  return fresh;
}

/** Persist a full, validated progress object. */
export function saveStudentProgress(progress: StudentProgress): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(
      STUDENT_PROGRESS_STORAGE_KEY,
      JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }),
    );
    window.dispatchEvent(new CustomEvent("student-progress-updated"));
    return true;
  } catch {
    // Storage may be unavailable in private browsing or restricted contexts.
    return false;
  }
}

/** Record one completed answer and unlock the next level in this browser. */
export function recordHallucinationResult(
  result: Omit<GameResult, "gameId" | "completedAt">,
  currentProgress?: StudentProgress,
): { progress: StudentProgress; persisted: boolean; xpEarned: number } {
  const progress = currentProgress ?? getStudentProgress();
  const game = progress.games.hallucinationCourt;
  const completedAt = new Date().toISOString();
  const nextStreak = result.correct ? game.currentStreak + 1 : 0;

  const updated: StudentProgress = {
    ...progress,
    updatedAt: completedAt,
    games: {
      ...progress.games,
      hallucinationCourt: {
        ...game,
        highestUnlockedLevel: Math.max(
          game.highestUnlockedLevel,
          Math.min(result.level + 1, hallucinationCases.length),
        ),
        completedLevels: Array.from(
          new Set([...game.completedLevels, result.level]),
        ).sort((a, b) => a - b),
        totalAttempts: game.totalAttempts + 1,
        correctAttempts: game.correctAttempts + (result.correct ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak: Math.max(game.bestStreak, nextStreak),
        // Keep a bounded history so long-term use does not grow storage forever.
        history: [
          ...game.history,
          {
            ...result,
            gameId: "hallucination-court" as const,
            completedAt,
          },
        ].slice(-200),
      },
    },
  };

  const awarded = awardCaseXp(updated, "hallucination-court", result.level, result.correct);
  const persisted = saveStudentProgress(awarded.progress);
  return { progress: awarded.progress, persisted, xpEarned: awarded.xpEarned };
}


/** Record an ethics-court result without disturbing existing hallucination progress. */
export function recordEthicsResult(
  result: {
    level: number;
    caseId: string;
    correct: boolean;
    selectedArgument: "unethical" | "responsible";
  },
  currentProgress?: StudentProgress,
): { progress: StudentProgress; persisted: boolean; xpEarned: number } {
  const progress = currentProgress ?? getStudentProgress();
  const game = progress.games.ethicsCourt ?? createEmptyEthicsProgress();
  const completedAt = new Date().toISOString();
  const nextStreak = result.correct ? game.currentStreak + 1 : 0;

  const updated: StudentProgress = {
    ...progress,
    updatedAt: completedAt,
    games: {
      ...progress.games,
      ethicsCourt: {
        ...game,
        highestUnlockedLevel: Math.max(game.highestUnlockedLevel, Math.min(result.level + 1, 6)),
        completedLevels: Array.from(new Set([...game.completedLevels, result.level])).sort((a, b) => a - b),
        totalAttempts: game.totalAttempts + 1,
        correctAttempts: game.correctAttempts + (result.correct ? 1 : 0),
        currentStreak: nextStreak,
        bestStreak: Math.max(game.bestStreak, nextStreak),
        history: [
          ...game.history,
          { ...result, gameId: "ethics-court" as const, completedAt },
        ].slice(-200),
      },
    },
  };

  const awarded = awardCaseXp(updated, "ethics-court", result.level, result.correct);
  const persisted = saveStudentProgress(awarded.progress);
  return { progress: awarded.progress, persisted, xpEarned: awarded.xpEarned };
}


/** Record a prompt-practice verdict independently from the two predefined courts. */
export function recordPromptingResult(
  result: {
    level: number;
    caseId: string;
    score: number;
    won: boolean;
    questionCount: number;
  },
  currentProgress?: StudentProgress,
): { progress: StudentProgress; persisted: boolean; xpEarned: number } {
  const progress = currentProgress ?? getStudentProgress();
  const game = progress.games.promptingCourt ?? createEmptyPromptingProgress();
  const completedAt = new Date().toISOString();
  const updated: StudentProgress = {
    ...progress,
    updatedAt: completedAt,
    games: {
      ...progress.games,
      promptingCourt: {
        ...game,
        highestUnlockedLevel: Math.max(game.highestUnlockedLevel, Math.min(result.level + 1, 6)),
        completedLevels: Array.from(new Set([...game.completedLevels, result.level])).sort((a, b) => a - b),
        totalAttempts: game.totalAttempts + 1,
        wins: game.wins + (result.won ? 1 : 0),
        bestScore: Math.max(game.bestScore, result.score),
        history: [
          ...game.history,
          { ...result, gameId: "prompting-court" as const, completedAt },
        ].slice(-200),
      },
    },
  };
  const awarded = awardCaseXp(updated, "prompting-court", result.level, result.won);
  const persisted = saveStudentProgress(awarded.progress);
  return { progress: awarded.progress, persisted, xpEarned: awarded.xpEarned };
}
