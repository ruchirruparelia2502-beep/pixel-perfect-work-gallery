export type Outcome = { code: string; statement: string; bloom: string };
export type Unit = { title: string; topics: string; hours: string };

export type CourseDraft = {
  code: string;
  title: string;
  department: string;
  semester: string;
  credits: string;
  regulation: string;
  preamble: string;
  prerequisites: string[];
  outcomes: Outcome[];
  units: Unit[];
  textbooks: string[];
};

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

/** Coerces untrusted AI output into a safe CourseDraft shape. */
export function normalizeCourse(input: unknown): CourseDraft {
  const o = obj(input);
  return {
    code: str(o["code"]),
    title: str(o["title"]) || "Untitled course",
    department: str(o["department"]),
    semester: str(o["semester"]),
    credits: str(o["credits"]),
    regulation: str(o["regulation"]),
    preamble: str(o["preamble"]),
    prerequisites: arr(o["prerequisites"]).map(str).filter(Boolean),
    outcomes: arr(o["outcomes"])
      .map((x, i) => {
        const r = obj(x);
        return { code: str(r["code"]) || `CO${i + 1}`, statement: str(r["statement"]), bloom: str(r["bloom"]) };
      })
      .filter((x) => x.statement),
    units: arr(o["units"])
      .map((x) => {
        const r = obj(x);
        return { title: str(r["title"]), topics: str(r["topics"]), hours: str(r["hours"]) };
      })
      .filter((x) => x.title || x.topics),
    textbooks: arr(o["textbooks"]).map(str).filter(Boolean),
  };
}
