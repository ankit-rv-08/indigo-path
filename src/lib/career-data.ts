export interface Metric {
  id: string;
  label: string;
  score: number;
  delta: number;
  history: number[];
  tips: string[];
}

export interface Recruiter {
  id: string;
  name: string;
  company: string;
  role: string;
  lastActive: string;
  match: number;
  tags: string[];
}

export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskCategory = "DSA" | "Outreach" | "System Design";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  description: string;
  subtasks: { id: string; label: string; done: boolean }[];
  due: string;
  timeSpent: number; // minutes
  isDsaDaily?: boolean;
}

export interface Milestone {
  id: string;
  week: number;
  date: string;
  title: string;
  status: "done" | "current" | "upcoming" | "missed";
  gameplan: string[];
}

export const initialMetrics: Metric[] = [
  {
    id: "linkedin",
    label: "LinkedIn Score",
    score: 78,
    delta: +4,
    history: [60, 64, 68, 70, 72, 74, 78],
    tips: [
      "Post a system-design teardown twice a week",
      "Engage with 10 senior engineers daily",
      "Refresh headline with current LPA target",
    ],
  },
  {
    id: "github",
    label: "GitHub Commit Health",
    score: 64,
    delta: -2,
    history: [70, 72, 68, 66, 65, 64, 64],
    tips: [
      "Push at least 1 meaningful commit/day",
      "Pin 3 production-grade repos",
      "Add architecture diagrams to top repos",
    ],
  },
  {
    id: "resume",
    label: "Resume Integrity",
    score: 88,
    delta: +1,
    history: [80, 82, 84, 85, 86, 87, 88],
    tips: [
      "Quantify impact on every bullet (%, $, ms)",
      "Tighten to 1 page for SDE-1 roles",
      "Mirror JD keywords for ATS pass rate",
    ],
  },
];

export const initialRecruiters: Recruiter[] = [
  { id: "r1", name: "Priya Menon", company: "Stripe", role: "Tech Recruiter", lastActive: "2h ago", match: 94, tags: ["Backend", "Payments"] },
  { id: "r2", name: "Raj Kapoor", company: "Atlassian", role: "Sr. Recruiter", lastActive: "5h ago", match: 88, tags: ["Infra"] },
  { id: "r3", name: "Sara Liu", company: "Notion", role: "Eng Recruiter", lastActive: "1d ago", match: 81, tags: ["Frontend"] },
  { id: "r4", name: "Mohan Iyer", company: "Razorpay", role: "Recruiting Lead", lastActive: "3h ago", match: 90, tags: ["Backend", "Fintech"] },
  { id: "r5", name: "Elena Cruz", company: "Vercel", role: "Talent Partner", lastActive: "30m ago", match: 86, tags: ["DX", "Edge"] },
  { id: "r6", name: "Anil Verma", company: "Postman", role: "Recruiter", lastActive: "6h ago", match: 79, tags: ["API"] },
  { id: "r7", name: "Kavya Rao", company: "Zomato", role: "Talent Acquisition", lastActive: "2d ago", match: 74, tags: ["Backend"] },
];

export const initialTasks: Task[] = [
  { id: "t1", title: "DSA Daily — 3 LeetCode Mediums", category: "DSA", status: "pending", priority: "high", description: "Maintain streak. Today: graphs.", subtasks: [{id:"s1",label:"Problem 1",done:false},{id:"s2",label:"Problem 2",done:false},{id:"s3",label:"Problem 3",done:false}], due: "Today", timeSpent: 0, isDsaDaily: true },
  { id: "t2", title: "Cold DM 10 Recruiters", category: "Outreach", status: "in_progress", priority: "high", description: "Target FAANG-adjacent + fintech.", subtasks: [{id:"s1",label:"Stripe",done:true},{id:"s2",label:"Vercel",done:true},{id:"s3",label:"Atlassian",done:false}], due: "Today", timeSpent: 45 },
  { id: "t3", title: "Design URL Shortener", category: "System Design", status: "in_progress", priority: "medium", description: "Caching + analytics path.", subtasks: [{id:"s1",label:"API spec",done:true},{id:"s2",label:"DB schema",done:false}], due: "Tomorrow", timeSpent: 90 },
  { id: "t4", title: "Refactor Portfolio Repo", category: "System Design", status: "completed", priority: "low", description: "Split monorepo, add CI.", subtasks: [{id:"s1",label:"Split",done:true}], due: "Yesterday", timeSpent: 120 },
  { id: "t5", title: "Reply to 5 Inbound Messages", category: "Outreach", status: "pending", priority: "medium", description: "Maintain <12h reply SLA.", subtasks: [], due: "Today", timeSpent: 0 },
  { id: "t6", title: "Caching Deep-Dive Notes", category: "System Design", status: "pending", priority: "high", description: "Read DDIA Ch.5, write summary.", subtasks: [{id:"s1",label:"Read",done:false},{id:"s2",label:"Notes",done:false}], due: "Today", timeSpent: 0 },
];

// Build weekly milestones from now until Dec 31, 2026
export function buildMilestones(): Milestone[] {
  const start = new Date();
  const end = new Date("2026-12-31");
  const weeks = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 3600 * 1000)));
  const titles = [
    "DSA: Arrays Mastery", "DSA: Trees & Graphs", "System Design: Caching", "System Design: Sharding",
    "Outreach: 50 DMs", "Mock Interviews x5", "OSS Contribution", "Resume v3 Drop",
    "LinkedIn Audit", "Behavioral Stories", "Capstone Project", "Salary Negotiation Prep",
  ];
  const out: Milestone[] = [];
  for (let i = 0; i < weeks; i++) {
    const d = new Date(start.getTime() + i * 7 * 24 * 3600 * 1000);
    const status: Milestone["status"] =
      i === 2 ? "missed" : i < 2 ? "done" : i === 3 ? "current" : "upcoming";
    out.push({
      id: `m${i}`,
      week: i + 1,
      date: d.toISOString().slice(0, 10),
      title: titles[i % titles.length],
      status,
      gameplan: [
        "Block 2 hrs/day deep work",
        "Pair with 1 peer mid-week",
        "Ship a public artifact (post/repo)",
        "Review on Sunday + log learnings",
      ],
    });
  }
  return out;
}
