import { Problem, Team, LeaderboardEntry, RadioMessage } from '@/types';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-a1',
    code: 'A1',
    sector: 'A',
    title: 'Aerodynamic Drag Vector',
    tier: 'Easy',
    points: 100,
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    statement: `The Scuderia aerodynamicists have measured velocity vectors across $N$ downforce sensors along the front wing. Each sensor reports a drag coefficient $v_i$.

Given an array of $N$ integers representing sensor readings, determine the maximum contiguous subsegment sum of drag coefficients, subject to the condition that you can invert the sign of at most one reading.`,
    constraints: [
      '1 ≤ N ≤ 2 · 10⁵',
      '-10⁹ ≤ v_i ≤ 10⁹',
      'Memory limit: 256 megabytes',
      'Time limit: 1.0 seconds',
    ],
    samples: [
      {
        id: 's1',
        input: '5\n2 -3 4 -1 5',
        expectedOutput: '15',
        explanation: 'Invert -3 to 3, yielding [2, 3, 4, -1, 5]. The contiguous sum is 2+3+4-1+5 = 13 or 2+3+4+1+5 = 15 by choosing -1.',
      },
      {
        id: 's2',
        input: '3\n-5 -2 -8',
        expectedOutput: '8',
        explanation: 'Inverting -8 gives 8, which is the maximum single element subsegment.',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 10,
        text: 'Consider prefix and suffix maximum subarray sums (Kadane’s algorithm in both directions).',
      },
      {
        level: 2,
        costPercent: 20,
        costPoints: 20,
        text: 'For each index i, evaluate prefixMax[i-1] + (-v[i]) + suffixMax[i+1].',
      },
      {
        level: 3,
        costPercent: 30,
        costPoints: 30,
        text: 'Handle the case where no element is inverted or where all numbers are negative separately.',
      },
    ],
    fastestLapTeamId: 'TEAM-007',
    fastestLapTime: '00:08:14',
  },
  {
    id: 'prob-a2',
    code: 'A2',
    sector: 'A',
    title: 'Pitstop Tyre Degradation Curve',
    tier: 'Easy',
    points: 100,
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    statement: `During a pit stop sequence, the team must change sets of tyres. There are $M$ tire compounds available, each having a degradation slope $D_j$ and initial grip $G_j$.

Calculate the minimal lap time delta achievable across a race distance of $K$ laps with at most $P$ pitstops.`,
    constraints: [
      '1 ≤ M ≤ 50',
      '1 ≤ K ≤ 1000',
      '0 ≤ P ≤ 5',
      '1 ≤ G_j, D_j ≤ 100',
    ],
    samples: [
      {
        id: 's1',
        input: '2 10 1\n10 1\n15 3',
        expectedOutput: '65',
        explanation: 'Optimal compound switch at lap 5.',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 10,
        text: 'Dynamic programming state: dp[lap][stops][current_compound].',
      },
    ],
  },
  {
    id: 'prob-b1',
    code: 'B1',
    sector: 'B',
    title: 'Gearbox Telemetry Sync',
    tier: 'Medium',
    points: 200,
    timeLimit: '1.5s',
    memoryLimit: '512 MB',
    statement: `Race control broadcasts telemetry frequencies across an undirected tree network connecting $N$ telemetry towers. 

Each tower $u$ has a frequency $F_u$. You must answer $Q$ queries of the form: given two towers $u$ and $v$, find the bitwise XOR sum of all frequencies on the simple path between $u$ and $v$, and whether that value is a palindrome in binary representation.`,
    constraints: [
      '2 ≤ N ≤ 10⁵',
      '1 ≤ Q ≤ 10⁵',
      '0 ≤ F_u < 2³⁰',
    ],
    samples: [
      {
        id: 's1',
        input: '4 2\n1 2 3 4\n1 2\n2 3\n3 4\n1 4\n2 3',
        expectedOutput: 'YES 4\nNO 1',
        explanation: 'Query 1 path is 1-2-3-4 with XOR 1^2^3^4 = 4 (binary 100).',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 20,
        text: 'Use binary lifting / Lowest Common Ancestor (LCA) combined with prefix XORs from the root.',
      },
      {
        level: 2,
        costPercent: 20,
        costPoints: 40,
        text: 'PrefixXOR(u) ^ PrefixXOR(v) ^ F[LCA(u,v)] gives the exact path XOR in O(log N).',
      },
    ],
    fastestLapTeamId: 'TEAM-042',
    fastestLapTime: '00:24:32',
  },
  {
    id: 'prob-b2',
    code: 'B2',
    sector: 'B',
    title: 'Slipstream Overtake Matrix',
    tier: 'Medium',
    points: 200,
    timeLimit: '2.0s',
    memoryLimit: '512 MB',
    statement: `Cars are positioned on a 2D circuit grid represented by an $N \\times M$ grid. In each second, a car can move to an adjacent cell or draft in the slipstream of a car directly ahead, skipping $K$ cells instantly.

Find the minimum time needed for car #1 at $(1, 1)$ to overtake the lead car at $(N, M)$.`,
    constraints: [
      '2 ≤ N, M ≤ 500',
      '1 ≤ K ≤ 50',
    ],
    samples: [
      {
        id: 's1',
        input: '4 4 2\n. . # .\n. # . .\n. . . .\n# . . .',
        expectedOutput: '5',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 20,
        text: '0-1 BFS or Dijkstra with state (r, c, draft_available).',
      },
    ],
  },
  {
    id: 'prob-c1',
    code: 'C1',
    sector: 'C',
    title: 'Monaco Hairpin Flow Optimization',
    tier: 'Hard',
    points: 300,
    timeLimit: '2.5s',
    memoryLimit: '512 MB',
    statement: `Simulate the maximum vehicle throughput through the historic Fairmont hairpin. 

The track geometry is modeled as a directed flow network with capacities and delay costs. Compute the minimum cost maximum flow such that no two racing lines intersect under safety threshold $\\delta$.`,
    constraints: [
      'N ≤ 1200 vertices, M ≤ 4000 edges',
      'Capacities ≤ 10⁶, Costs ≤ 10⁶',
    ],
    samples: [
      {
        id: 's1',
        input: '4 5 1 4\n1 2 2 1\n1 3 1 2\n2 4 1 3\n3 4 2 1\n2 3 1 1',
        expectedOutput: 'Flow: 3, Cost: 9',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 30,
        text: 'Successive Shortest Path algorithm with SPFA / Dijkstra with potentials.',
      },
      {
        level: 2,
        costPercent: 20,
        costPoints: 60,
        text: 'Split vertices to enforce non-intersection constraints.',
      },
    ],
  },
  {
    id: 'prob-d1',
    code: 'D1',
    sector: 'D',
    title: 'Telemetry Encryption Key',
    tier: 'Hard',
    points: 300,
    timeLimit: '3.0s',
    memoryLimit: '512 MB',
    statement: `Radio encryption uses elliptic curve points over a finite field $\\mathbb{F}_p$. Decode the scrambled telemetry stream by finding the discrete logarithm under Montgomery multiplication.`,
    constraints: [
      'Prime p < 2⁶⁰',
      'Query count Q ≤ 20',
    ],
    samples: [
      {
        id: 's1',
        input: '23 5 8',
        expectedOutput: '16',
      },
    ],
    hints: [
      {
        level: 1,
        costPercent: 10,
        costPoints: 30,
        text: 'Baby-step Giant-step or Pollard’s rho algorithm for discrete logarithm.',
      },
    ],
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'TEAM-042',
    name: 'Scuderia Syntax',
    tableNumber: 14,
    zone: 'Zone B',
    pin: '4242',
    members: [
      { name: 'Alex Verstappen', collegeId: '22CS089' },
      { name: 'Carlos Hamilton', collegeId: '22CS102' },
      { name: 'Lando Leclerc', collegeId: '22CS155' },
    ],
    status: 'racing',
    strikes: 0,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.14',
    redeemedHints: {
      'prob-a1': [1],
    },
  },
  {
    id: 'TEAM-007',
    name: 'Apex Coders',
    tableNumber: 3,
    zone: 'Zone A',
    pin: '1007',
    members: [
      { name: 'James Bond' },
      { name: 'Q Branch' },
      { name: 'Moneypenny' },
    ],
    status: 'racing',
    strikes: 0,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.3',
    redeemedHints: {},
  },
  {
    id: 'TEAM-012',
    name: 'Turbo Chargers',
    tableNumber: 8,
    zone: 'Zone A',
    pin: '2012',
    members: [
      { name: 'Rohan Sharma' },
      { name: 'Priya Nair' },
      { name: 'Aman Verma' },
    ],
    status: 'racing',
    strikes: 1,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.8',
    redeemedHints: {},
  },
  {
    id: 'TEAM-088',
    name: 'Null Pointers F1',
    tableNumber: 22,
    zone: 'Zone B',
    pin: '3088',
    members: [
      { name: 'Karthik R' },
      { name: 'Sneha Patel' },
      { name: 'Varun Joshi' },
    ],
    status: 'yellow',
    strikes: 2,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.22',
    redeemedHints: {
      'prob-b1': [1, 2],
    },
  },
  {
    id: 'TEAM-099',
    name: 'Red Flag Survivors',
    tableNumber: 29,
    zone: 'Zone B',
    pin: '4099',
    members: [
      { name: 'Devendra K' },
      { name: 'Ananya Roy' },
      { name: 'Siddharth M' },
    ],
    status: 'red',
    strikes: 3,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.29',
    redeemedHints: {},
  },
  {
    id: 'TEAM-105',
    name: 'Overclocked Monkeys',
    tableNumber: 35,
    zone: 'Zone C',
    pin: '5105',
    members: [
      { name: 'Nikhil Gowda' },
      { name: 'Bhavna K' },
      { name: 'Chirag Rao' },
    ],
    status: 'ready',
    strikes: 0,
    lastHeartbeat: new Date().toISOString(),
    ipAddress: '192.168.1.35',
    redeemedHints: {},
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    teamId: 'TEAM-007',
    teamName: 'Apex Coders',
    tableNumber: 3,
    solvedCount: 4,
    netScore: 800,
    penaltyMinutes: 98,
    lastSolveMinute: 54,
    problemStats: {
      A1: { solved: true, solveMinute: 8, attempts: 1, fastestLap: true, hintsUsedCount: 0, pointsAwarded: 100 },
      A2: { solved: true, solveMinute: 21, attempts: 1, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 100 },
      B1: { solved: true, solveMinute: 38, attempts: 2, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 200 },
      C1: { solved: true, solveMinute: 54, attempts: 1, fastestLap: true, hintsUsedCount: 0, pointsAwarded: 300 },
    },
  },
  {
    rank: 2,
    teamId: 'TEAM-042',
    teamName: 'Scuderia Syntax',
    tableNumber: 14,
    solvedCount: 3,
    netScore: 590, // 100 + 200 + 300 - 10 hint = 590
    penaltyMinutes: 112,
    lastSolveMinute: 62,
    problemStats: {
      A1: { solved: true, solveMinute: 14, attempts: 1, fastestLap: false, hintsUsedCount: 1, pointsAwarded: 90 },
      B1: { solved: true, solveMinute: 24, attempts: 1, fastestLap: true, hintsUsedCount: 0, pointsAwarded: 200 },
      C1: { solved: true, solveMinute: 62, attempts: 2, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 300 },
    },
  },
  {
    rank: 3,
    teamId: 'TEAM-012',
    teamName: 'Turbo Chargers',
    tableNumber: 8,
    solvedCount: 3,
    netScore: 400,
    penaltyMinutes: 125,
    lastSolveMinute: 49,
    problemStats: {
      A1: { solved: true, solveMinute: 16, attempts: 2, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 100 },
      A2: { solved: true, solveMinute: 31, attempts: 1, fastestLap: true, hintsUsedCount: 0, pointsAwarded: 100 },
      B2: { solved: true, solveMinute: 49, attempts: 1, fastestLap: true, hintsUsedCount: 0, pointsAwarded: 200 },
    },
  },
  {
    rank: 4,
    teamId: 'TEAM-088',
    teamName: 'Null Pointers F1',
    tableNumber: 22,
    solvedCount: 2,
    netScore: 240, // 100 + 200 - 60 hints = 240
    penaltyMinutes: 84,
    lastSolveMinute: 44,
    problemStats: {
      A1: { solved: true, solveMinute: 22, attempts: 1, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 100 },
      B1: { solved: true, solveMinute: 44, attempts: 2, fastestLap: false, hintsUsedCount: 2, pointsAwarded: 140 },
    },
  },
  {
    rank: 5,
    teamId: 'TEAM-105',
    teamName: 'Overclocked Monkeys',
    tableNumber: 35,
    solvedCount: 1,
    netScore: 100,
    penaltyMinutes: 19,
    lastSolveMinute: 19,
    problemStats: {
      A1: { solved: true, solveMinute: 19, attempts: 1, fastestLap: false, hintsUsedCount: 0, pointsAwarded: 100 },
    },
  },
];

export const INITIAL_RADIO: RadioMessage[] = [
  {
    id: 'rad-1',
    sender: 'RACE CONTROL',
    message: 'Welcome to Code Grand Prix 2026! Scrutineering gates are now active.',
    timestamp: '10:00 AM',
    isUrgent: false,
  },
  {
    id: 'rad-2',
    sender: 'RACE CONTROL',
    message: 'Notice to Sector B: Problem B1 clarifies graph is undirected without self-loops.',
    timestamp: '10:35 AM',
    isUrgent: true,
  },
];

