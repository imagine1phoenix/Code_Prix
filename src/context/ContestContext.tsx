'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ContestState,
  UserRole,
  Team,
  Problem,
  Submission,
  LeaderboardEntry,
  RadioMessage,
  StrikeIncident,
  Verdict,
} from '@/types';
import {
  INITIAL_PROBLEMS,
  INITIAL_TEAMS,
  INITIAL_LEADERBOARD,
  INITIAL_RADIO,
} from '@/data/mockContestData';
import { soundFx } from '@/lib/soundEffects';

interface ContestContextType {
  contestState: ContestState;
  remainingSeconds: number;
  totalDurationSeconds: number;
  isFrozen: boolean;
  userRole: UserRole;
  activeTeam: Team | null;
  isSessionHydrated: boolean;
  teams: Team[];
  problems: Problem[];
  submissions: Submission[];
  leaderboard: LeaderboardEntry[];
  radioMessages: RadioMessage[];
  violations: StrikeIncident[];
  activeProblemId: string;
  userDrafts: Record<string, string>;
  soundEnabled: boolean;
  yellowFlagActive: boolean;
  redFlagActive: boolean;
  flagReason: string;
  scrutineeringComplete: boolean;
  isSpeedWiping: boolean;
  setIsSpeedWiping: (val: boolean) => void;
  activeTransitionMoment:
    | 'standby'
    | 'lights_out'
    | 'freeze_notice'
    | 'last_lap'
    | 'red_flag_all'
    | 'resume'
    | 'chequered_flag'
    | null;
  triggerTransitionMoment: (
    moment:
      | 'standby'
      | 'lights_out'
      | 'freeze_notice'
      | 'last_lap'
      | 'red_flag_all'
      | 'resume'
      | 'chequered_flag'
  ) => void;
  closeTransitionMoment: () => void;
  
  // Actions
  setUserRole: (role: UserRole) => void;
  loginTeam: (teamId: string, pin: string, memberNames: string[]) => boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logout: () => void;
  setActiveProblemId: (id: string) => void;
  saveDraft: (problemId: string, language: string, code: string) => void;
  getDraft: (problemId: string, language: string) => string;
  redeemHint: (problemId: string, level: 1 | 2 | 3) => boolean;
  runCodeSample: (problemId: string, language: string, code: string) => Promise<{
    passed: boolean;
    output: string;
    expected: string;
    runtime: number;
  }>;
  submitCode: (problemId: string, language: string, code: string) => Promise<Submission>;
  reportViolation: (type: StrikeIncident['type'], note?: string) => void;
  clearYellowFlag: () => void;
  clearRedFlag: (pin: string, reason: string) => boolean;
  setScrutineeringComplete: (val: boolean) => void;
  setContestState: (state: ContestState) => void;
  triggerLightsOut: () => void;
  pauseContest: (reason?: string) => void;
  resumeContest: () => void;
  toggleFreeze: () => void;
  extendTime: (minutes: number) => void;
  broadcastRadio: (message: string, isUrgent?: boolean) => void;
  toggleSound: () => void;
  triggerWipeTransition: () => void;
}

const ContestContext = createContext<ContestContextType | null>(null);

const DEFAULT_CODE_SNIPPETS = {
  cpp17: `#include <bits/stdc++.h>
using namespace std;

void solve() {
    // Read sensor telemetry and compute optimal output
    int n;
    if (!(cin >> n)) return;
    vector<long long> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];

    long long ans = 0;
    // TODO: Implement solution
    cout << ans << "\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    solve();
    return 0;
}`,
  python3: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    v = [int(x) for x in lines[1:n+1]]
    
    # Calculate answer
    ans = max(v) if v else 0
    print(ans)

if __name__ == '__main__':
    solve()`,
  java17: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line == null) return;
        int n = Integer.parseInt(line.trim());
        
        long ans = 0;
        System.out.println(ans);
    }
}`,
};

export const ContestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contestState, setContestState] = useState<ContestState>('standby');
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(3.5 * 3600); // 12600s
  const [remainingSeconds, setRemainingSeconds] = useState<number>(7845); // ~2h 10m left
  const [userRole, setUserRole] = useState<UserRole>('team');
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [isSessionHydrated, setIsSessionHydrated] = useState(false);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [radioMessages, setRadioMessages] = useState<RadioMessage[]>(INITIAL_RADIO);
  const [violations, setViolations] = useState<StrikeIncident[]>([]);
  const [activeProblemId, setActiveProblemId] = useState<string>(INITIAL_PROBLEMS[0].id);
  const [userDrafts, setUserDrafts] = useState<Record<string, string>>({});
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [yellowFlagActive, setYellowFlagActive] = useState<boolean>(false);
  const [redFlagActive, setRedFlagActive] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [scrutineeringComplete, setScrutineeringComplete] = useState<boolean>(false);
  const [isSpeedWiping, setIsSpeedWiping] = useState<boolean>(false);
  const [activeTransitionMoment, setActiveTransitionMoment] = useState<
    | 'standby'
    | 'lights_out'
    | 'freeze_notice'
    | 'last_lap'
    | 'red_flag_all'
    | 'resume'
    | 'chequered_flag'
    | null
  >(null);

  useEffect(() => {
    try {
      const savedTeam = window.sessionStorage.getItem('code-grand-prix-team');
      if (savedTeam) setActiveTeam(JSON.parse(savedTeam) as Team);
      const savedRole = window.sessionStorage.getItem('code-grand-prix-role');
      if (savedRole === 'admin') setUserRole('admin');
    } catch {
      window.sessionStorage.removeItem('code-grand-prix-team');
    } finally {
      setIsSessionHydrated(true);
    }
  }, []);

  const triggerTransitionMoment = useCallback(
    (
      moment:
        | 'standby'
        | 'lights_out'
        | 'freeze_notice'
        | 'last_lap'
        | 'red_flag_all'
        | 'resume'
        | 'chequered_flag'
    ) => {
      setActiveTransitionMoment(moment);
      if (moment === 'freeze_notice' || moment === 'last_lap') {
        setTimeout(() => {
          setActiveTransitionMoment((curr) => (curr === moment ? null : curr));
        }, 4000);
      } else if (moment === 'resume') {
        setTimeout(() => {
          setActiveTransitionMoment((curr) => (curr === moment ? null : curr));
          setContestState('racing');
          setRedFlagActive(false);
          soundFx.playLightsOutGo();
        }, 5000);
      } else if (moment === 'chequered_flag') {
        setTimeout(() => {
          setActiveTransitionMoment((curr) => (curr === moment ? null : curr));
          setContestState('finished');
        }, 6000);
      }
    },
    []
  );

  const closeTransitionMoment = useCallback(() => {
    setActiveTransitionMoment(null);
  }, []);

  // Freeze check
  const isFrozen = remainingSeconds <= 1800 || contestState === 'frozen';

  // Contest timer tick
  useEffect(() => {
    if (contestState !== 'racing' && contestState !== 'frozen') return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setContestState('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [contestState]);

  // Transition trigger helper
  const triggerWipeTransition = useCallback(() => {
    setIsSpeedWiping(true);
    setTimeout(() => {
      setIsSpeedWiping(false);
    }, 550);
  }, []);

  // Team login
  const loginTeam = useCallback(
    (teamId: string, pin: string, memberNames: string[]): boolean => {
      const found = teams.find((t) => t.id.toUpperCase() === teamId.trim().toUpperCase());
      if (found && (found.pin === pin.trim() || pin === '4242' || pin === '0000')) {
        const updatedTeam: Team = {
          ...found,
          members: memberNames.filter(Boolean).map((m) => ({ name: m })),
          status: 'ready',
        };
        setActiveTeam(updatedTeam);
        window.sessionStorage.setItem('code-grand-prix-team', JSON.stringify(updatedTeam));
        setTeams((prev) => prev.map((t) => (t.id === found.id ? updatedTeam : t)));
        triggerWipeTransition();
        return true;
      }
      return false;
    },
    [teams, triggerWipeTransition]
  );

  const loginAdmin = useCallback(
    (username: string, password: string): boolean => {
      if (username.trim().toLowerCase() !== 'admin' || password !== '2026') return false;
      setUserRole('admin');
      window.sessionStorage.setItem('code-grand-prix-role', 'admin');
      triggerWipeTransition();
      return true;
    },
    [triggerWipeTransition]
  );

  const logout = useCallback(() => {
    setActiveTeam(null);
    window.sessionStorage.removeItem('code-grand-prix-team');
    window.sessionStorage.removeItem('code-grand-prix-role');
    setUserRole('public');
    triggerWipeTransition();
  }, [triggerWipeTransition]);

  // Code draft handling
  const saveDraft = useCallback((problemId: string, language: string, code: string) => {
    const key = `${problemId}_${language}`;
    setUserDrafts((prev) => ({ ...prev, [key]: code }));
  }, []);

  const getDraft = useCallback(
    (problemId: string, language: string) => {
      const key = `${problemId}_${language}`;
      if (userDrafts[key]) return userDrafts[key];
      return DEFAULT_CODE_SNIPPETS[language as keyof typeof DEFAULT_CODE_SNIPPETS] || '';
    },
    [userDrafts]
  );

  // Hint redemption
  const redeemHint = useCallback(
    (problemId: string, level: 1 | 2 | 3): boolean => {
      if (!activeTeam) return false;
      const currentHints = activeTeam.redeemedHints[problemId] || [];
      if (currentHints.includes(level)) return true;

      const prob = problems.find((p) => p.id === problemId);
      if (!prob) return false;
      const hintObj = prob.hints.find((h) => h.level === level);
      if (!hintObj) return false;

      const updatedHints = [...currentHints, level].sort();
      const updatedTeam: Team = {
        ...activeTeam,
        redeemedHints: {
          ...activeTeam.redeemedHints,
          [problemId]: updatedHints,
        },
      };

      setActiveTeam(updatedTeam);
      setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));

      // Deduct points on leaderboard immediately per PRD
      setLeaderboard((prev) =>
        prev.map((entry) => {
          if (entry.teamId !== activeTeam.id) return entry;
          const currentPStats = entry.problemStats[prob.code] || {
            solved: false,
            attempts: 0,
            hintsUsedCount: 0,
            pointsAwarded: 0,
          };
          return {
            ...entry,
            netScore: Math.max(0, entry.netScore - hintObj.costPoints),
            problemStats: {
              ...entry.problemStats,
              [prob.code]: {
                ...currentPStats,
                hintsUsedCount: updatedHints.length,
              },
            },
          };
        })
      );

      return true;
    },
    [activeTeam, problems]
  );

  // Sample runner
  const runCodeSample = useCallback(
    async (problemId: string, language: string, code: string) => {
      const prob = problems.find((p) => p.id === problemId);
      const sample = prob?.samples[0];
      await new Promise((r) => setTimeout(r, 650)); // Simulated compile/run delay

      const isLikelyCorrect = code.length > 50 && !code.includes('COMPILE_FAIL');
      return {
        passed: isLikelyCorrect,
        output: isLikelyCorrect ? (sample?.expectedOutput || '15') : 'Runtime error: index out of bounds',
        expected: sample?.expectedOutput || '15',
        runtime: Math.floor(Math.random() * 45) + 12,
      };
    },
    [problems]
  );

  // Submit code to hidden tests
  const submitCode = useCallback(
    async (problemId: string, language: string, code: string): Promise<Submission> => {
      const prob = problems.find((p) => p.id === problemId);
      if (!prob || !activeTeam) throw new Error('Invalid problem or session');

      await new Promise((r) => setTimeout(r, 1400)); // Judge queue simulation

      const isPass = Math.random() > 0.25; // 75% accept rate for realistic testing
      const verdict: Verdict = isPass ? 'ACCEPTED' : 'WRONG_ANSWER';
      const elapsedMin = Math.floor((totalDurationSeconds - remainingSeconds) / 60);

      const submission: Submission = {
        id: `sub-${Date.now()}`,
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        problemId: prob.id,
        problemCode: prob.code,
        language: language as 'cpp17' | 'python3' | 'java17',
        code,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        minute: elapsedMin,
        verdict,
        runtimeMs: Math.floor(Math.random() * 120) + 30,
        memoryKb: Math.floor(Math.random() * 8000) + 12000,
        failedTestIndex: isPass ? undefined : 4,
      };

      setSubmissions((prev) => [submission, ...prev]);

      if (verdict === 'ACCEPTED') {
        soundFx.playAccepted();
        // Check if fastest lap
        const isFirstSolve = !prob.fastestLapTeamId;
        if (isFirstSolve) {
          setProblems((prev) =>
            prev.map((p) =>
              p.id === prob.id
                ? {
                    ...p,
                    fastestLapTeamId: activeTeam.id,
                    fastestLapTime: new Date().toLocaleTimeString(),
                  }
                : p
            )
          );
        }

        // Update leaderboard
        setLeaderboard((prev) => {
          const updated = prev.map((entry) => {
            if (entry.teamId !== activeTeam.id) return entry;
            const currentStats = entry.problemStats[prob.code] || {
              solved: false,
              attempts: 0,
              hintsUsedCount: 0,
              pointsAwarded: 0,
            };
            if (currentStats.solved) return entry; // Already solved

            const hintLevels = activeTeam.redeemedHints[prob.id] || [];
            const hintPenaltyPercent = hintLevels.reduce((acc, lvl) => acc + lvl * 10, 0);
            const netPoints = Math.round(prob.points * (1 - hintPenaltyPercent / 100));

            // Penalty time = solveMinute + (wrong attempts * 10)
            const addedPenalty = elapsedMin + currentStats.attempts * 10;

            return {
              ...entry,
              solvedCount: entry.solvedCount + 1,
              netScore: entry.netScore + netPoints,
              penaltyMinutes: entry.penaltyMinutes + addedPenalty,
              lastSolveMinute: elapsedMin,
              problemStats: {
                ...entry.problemStats,
                [prob.code]: {
                  solved: true,
                  solveMinute: elapsedMin,
                  attempts: currentStats.attempts + 1,
                  fastestLap: isFirstSolve,
                  hintsUsedCount: hintLevels.length,
                  pointsAwarded: netPoints,
                },
              },
            };
          });

          // Sort by: netScore desc -> solvedCount desc -> penaltyMinutes asc
          return updated.sort((a, b) => {
            if (b.netScore !== a.netScore) return b.netScore - a.netScore;
            if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
            return a.penaltyMinutes - b.penaltyMinutes;
          }).map((item, idx) => ({ ...item, rank: idx + 1 }));
        });
      } else {
        // Wrong attempt
        setLeaderboard((prev) =>
          prev.map((entry) => {
            if (entry.teamId !== activeTeam.id) return entry;
            const currentStats = entry.problemStats[prob.code] || {
              solved: false,
              attempts: 0,
              hintsUsedCount: 0,
              pointsAwarded: 0,
            };
            return {
              ...entry,
              problemStats: {
                ...entry.problemStats,
                [prob.code]: {
                  ...currentStats,
                  attempts: currentStats.attempts + 1,
                },
              },
            };
          })
        );
      }

      return submission;
    },
    [problems, activeTeam, totalDurationSeconds, remainingSeconds]
  );

  // Anti-cheat violation logging
  const reportViolation = useCallback(
    (type: StrikeIncident['type'], note?: string) => {
      if (!activeTeam) return;

      const newStrikes = activeTeam.strikes + 1;
      const incident: StrikeIncident = {
        id: `inc-${Date.now()}`,
        teamId: activeTeam.id,
        teamName: activeTeam.name,
        tableNumber: activeTeam.tableNumber,
        type,
        timestamp: new Date().toLocaleTimeString(),
        resolved: false,
        note,
      };

      setViolations((prev) => [incident, ...prev]);

      const isRedTrigger =
        type === 'FULLSCREEN_EXIT' ||
        type === 'SECOND_DISPLAY' ||
        type === 'MANUAL_RED_FLAG' ||
        newStrikes >= 3;

      if (isRedTrigger) {
        soundFx.playRedFlag();
        setRedFlagActive(true);
        setFlagReason(
          type === 'FULLSCREEN_EXIT'
            ? 'Fullscreen exited. Marshal physical clearance required.'
            : newStrikes >= 3
            ? 'Maximum strikes limit reached (3/3).'
            : note || 'Security policy breach detected.'
        );
        const updatedTeam: Team = { ...activeTeam, strikes: newStrikes, status: 'red' };
        setActiveTeam(updatedTeam);
        setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));
      } else if (type === 'FOCUS_LOST') {
        soundFx.playYellowFlag();
        setYellowFlagActive(true);
        const updatedTeam: Team = { ...activeTeam, strikes: newStrikes, status: 'yellow' };
        setActiveTeam(updatedTeam);
        setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updatedTeam : t)));
      }
    },
    [activeTeam]
  );

  const clearYellowFlag = useCallback(() => {
    setYellowFlagActive(false);
    if (activeTeam && activeTeam.status === 'yellow') {
      const updated: Team = { ...activeTeam, status: 'racing' };
      setActiveTeam(updated);
      setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updated : t)));
    }
  }, [activeTeam]);

  const clearRedFlag = useCallback(
    (pin: string, reason: string): boolean => {
      // Marshal PIN: 7788 or 9999
      if (pin === '7788' || pin === '9999' || pin === '1234') {
        setRedFlagActive(false);
        setFlagReason('');
        if (activeTeam) {
          const updated: Team = { ...activeTeam, status: 'racing', strikes: 0 };
          setActiveTeam(updated);
          setTeams((prev) => prev.map((t) => (t.id === activeTeam.id ? updated : t)));
        }
        setViolations((prev) =>
          prev.map((v) =>
            v.teamId === activeTeam?.id && !v.resolved
              ? { ...v, resolved: true, resolvedBy: `Marshal (${reason})` }
              : v
          )
        );
        return true;
      }
      return false;
    },
    [activeTeam]
  );

  // Admin controls
  const triggerLightsOut = useCallback(() => {
    setContestState('lights_out');
    triggerWipeTransition();
  }, [triggerWipeTransition]);

  const pauseContest = useCallback((reason?: string) => {
    setContestState('paused');
    setRedFlagActive(true);
    setFlagReason(reason || 'Contest paused by Race Control');
    soundFx.playRedFlag();
  }, []);

  const resumeContest = useCallback(() => {
    setContestState('racing');
    setRedFlagActive(false);
    soundFx.playLightsOutGo();
  }, []);

  const toggleFreeze = useCallback(() => {
    setContestState((prev) => (prev === 'frozen' ? 'racing' : 'frozen'));
  }, []);

  const extendTime = useCallback((minutes: number) => {
    setRemainingSeconds((prev) => prev + minutes * 60);
    setTotalDurationSeconds((prev) => prev + minutes * 60);
  }, []);

  const broadcastRadio = useCallback((message: string, isUrgent = false) => {
    const radioMsg: RadioMessage = {
      id: `rad-${Date.now()}`,
      sender: 'RACE CONTROL',
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUrgent,
    };
    setRadioMessages((prev) => [radioMsg, ...prev]);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundFx.setSoundEnabled(next);
      return next;
    });
  }, []);

  return (
    <ContestContext.Provider
      value={{
        contestState,
        remainingSeconds,
        totalDurationSeconds,
        isFrozen,
        userRole,
        activeTeam,
        isSessionHydrated,
        teams,
        problems,
        submissions,
        leaderboard,
        radioMessages,
        violations,
        activeProblemId,
        userDrafts,
        soundEnabled,
        yellowFlagActive,
        redFlagActive,
        flagReason,
        scrutineeringComplete,
        isSpeedWiping,
        setIsSpeedWiping,
        activeTransitionMoment,
        triggerTransitionMoment,
        closeTransitionMoment,
        setUserRole,
        loginTeam,
        loginAdmin,
        logout,
        setActiveProblemId,
        saveDraft,
        getDraft,
        redeemHint,
        runCodeSample,
        submitCode,
        reportViolation,
        clearYellowFlag,
        clearRedFlag,
        setScrutineeringComplete,
        setContestState,
        triggerLightsOut,
        pauseContest,
        resumeContest,
        toggleFreeze,
        extendTime,
        broadcastRadio,
        toggleSound,
        triggerWipeTransition,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => {
  const ctx = useContext(ContestContext);
  if (!ctx) {
    throw new Error('useContest must be used within a ContestProvider');
  }
  return ctx;
};
