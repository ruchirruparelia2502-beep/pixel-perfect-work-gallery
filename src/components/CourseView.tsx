import type { CourseDraft } from "@/lib/course-schema";

export function CourseView({ course }: { course: CourseDraft }) {
  const meta = [
    ["Code", course.code],
    ["Department", course.department],
    ["Semester", course.semester],
    ["Credits", course.credits],
    ["Regulation", course.regulation],
  ].filter(([, v]) => v);

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] bg-card p-6">
        <h2 className="text-2xl font-extrabold tracking-tight">{course.title}</h2>
        {meta.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {meta.map(([k, v]) => (
              <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        {course.preamble && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{course.preamble}</p>}
        {course.prerequisites.length > 0 && (
          <p className="mt-3 text-sm">
            <span className="font-semibold">Prerequisites:</span> {course.prerequisites.join(", ")}
          </p>
        )}
      </div>

      <Section title="Course outcomes" tile="bg-tile-yellow" empty={course.outcomes.length === 0}>
        <ul className="space-y-2">
          {course.outcomes.map((o) => (
            <li key={o.code + o.statement} className="flex gap-3 rounded-2xl bg-card/70 p-3 text-sm">
              <span className="font-bold">{o.code}</span>
              <span className="flex-1">{o.statement}</span>
              {o.bloom && <span className="h-fit rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{o.bloom}</span>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Units" tile="bg-tile-green" empty={course.units.length === 0}>
        <div className="space-y-2">
          {course.units.map((u, i) => (
            <div key={i} className="rounded-2xl bg-card/70 p-3 text-sm">
              <div className="flex justify-between gap-3 font-bold">
                <span>{u.title || `Unit ${i + 1}`}</span>
                {u.hours && <span className="opacity-70">{u.hours} hrs</span>}
              </div>
              {u.topics && <p className="mt-1 text-muted-foreground">{u.topics}</p>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Textbooks & references" tile="bg-tile-blue" empty={course.textbooks.length === 0}>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {course.textbooks.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, tile, empty, children }: { title: string; tile: string; empty: boolean; children: React.ReactNode }) {
  return (
    <div className={`${tile} rounded-[28px] p-6`}>
      <h3 className="mb-3 text-lg font-bold">{title}</h3>
      {empty ? <p className="text-sm opacity-70">Not found in the document.</p> : children}
    </div>
  );
}
