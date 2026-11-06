export type ContestState =
  | 'standby'
  | 'scrutineering'
  | 'grid'
  | 'lights_out'
  | 'racing'
  | 'frozen'
  | 'paused'
  | 'finished';

export type UserRole = 'team' | 'marshal' | 'admin' | 'public';

export type ProblemTier = 'Easy' | 'Medium' | 'Hard';

export type ProblemSector = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface SampleCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Hint {
  level: 1 | 2 | 3;
  costPercent: number; // 10%, 20%, 30%
  costPoints: number;
  text: string;
}

export interface Problem {
  id: string;
  code: string; // e.g., "A1", "B2", "F3"
  sector: ProblemSector;
  title: string;
  tier: ProblemTier;
  points: number; // 100, 200, 300
  timeLimit: string;
  memoryLimit: string;
  statement: string;
  constraints: string[];
  samples: SampleCase[];
  hints: Hint[];
  fastestLapTeamId?: string;
  fastestLapTime?: string;
}

export type Verdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILE_ERROR';

export interface Submission {
  id: string;
  teamId: string;
  teamName: string;
  problemId: string;
  problemCode: string;
  language: 'cpp17' | 'python3' | 'java17';
  code: string;
  timestamp: string;
  minute: number;
  verdict: Verdict;
  runtimeMs: number;
  memoryKb: number;
  failedTestIndex?: number;
  isSampleRun?: boolean;
}

export interface TeamMember {
  name: string;
  collegeId?: string;
}

export interface Team {
  id: string; // e.g. "TEAM-042"
  name: string; // e.g. "Scuderia Syntax"
  tableNumber: number;
  zone: string; // e.g. "Zone A"
  pin: string; // 4-digit PIN
  members: TeamMember[];
  status:
    | 'offline'
    | 'scrutineering'
    | 'ready'
    | 'racing'
    | 'yellow'
    | 'red'
    | 'disqualified';
  strikes: number; // max 3
  lastHeartbeat: string;
  ipAddress: string;
  redeemedHints: Record<string, number[]>; // problemId -> array of redeemed levels
}

export interface TeamLeaderboardProblemStatus {
  solved: boolean;
  solveMinute?: number;
  attempts: number;
  fastestLap?: boolean;
  hintsUsedCount: number;
  pointsAwarded: number;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  tableNumber: number;
  solvedCount: number;
  netScore: number;
  penaltyMinutes: number;
  lastSolveMinute: number;
  problemStats: Record<string, TeamLeaderboardProblemStatus>; // problemCode -> stats
}

export interface ScrutineeringCheck {
  id: string;
  title: string;
  requirement: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  details?: string;
}

export interface StrikeIncident {
  id: string;
  teamId: string;
  teamName: string;
  tableNumber: number;
  type:
    | 'FOCUS_LOST'
    | 'FULLSCREEN_EXIT'
    | 'DEVTOOLS_SHORTCUT'
    | 'OUTSIDE_PASTE'
    | 'SECOND_DISPLAY'
    | 'MANUAL_RED_FLAG';
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  note?: string;
}

export interface RadioMessage {
  id: string;
  sender: 'RACE CONTROL' | 'TEAM';
  teamId?: string;
  message: string;
  timestamp: string;
  isUrgent?: boolean;
}

