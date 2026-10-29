import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coursesQuery } from "@/lib/courses";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SpecForge" }, { name: "description", content: "Your course specifications." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(coursesQuery),
  component: Dashboard,
});

const tiles = ["bg-tile-yellow", "bg-tile-pink", "bg-tile-green", "bg-tile-blue"];

function Dashboard() {
  const { data: courses } = useSuspenseQuery(coursesQuery);
  const { user } = Route.useRouteContext();
  const outcomes = courses.reduce((n, c) => n + c.outcomes.length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Your courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/upload">
            <Upload className="h-4 w-4" /> Upload syllabus
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Courses" value={courses.length} tile="bg-tile-yellow" />
        <Stat label="Course outcomes" value={outcomes} tile="bg-tile-pink" />
        <Stat label="Units" value={courses.reduce((n, c) => n + c.units.length, 0)} tile="bg-tile-green" />
        <Stat label="Textbooks" value={courses.reduce((n, c) => n + c.textbooks.length, 0)} tile="bg-tile-blue" />
      </div>

      {courses.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 text-lg font-bold">No courses yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload your first syllabus and the AI will structure it for you.</p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/upload">Upload syllabus</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((c, i) => (
            <Link
              key={c.id}
              to="/courses/$id"
              params={{ id: c.id }}
              className={`${tiles[i % 4]} rounded-[28px] p-6 transition hover:-translate-y-0.5 hover:shadow-shell`}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-70">{c.code || "No code"}</p>
              <h3 className="mt-1 text-xl font-bold">{c.title}</h3>
              <p className="mt-3 text-sm opacity-80">
                {c.outcomes.length} outcomes · {c.units.length} units{c.credits ? ` · ${c.credits} credits` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tile }: { label: string; value: number; tile: string }) {
  return (
    <div className={`${tile} rounded-[24px] p-5`}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
    </div>
  );
}
