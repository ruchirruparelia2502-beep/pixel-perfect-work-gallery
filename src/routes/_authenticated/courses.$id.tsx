import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseView } from "@/components/CourseView";
import { courseQuery } from "@/lib/courses";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/courses/$id")({
  head: () => ({ meta: [{ title: "Course — SpecForge" }, { name: "description", content: "Course specification details." }] }),
  loader: ({ context, params }) => context.queryClient.ensureQueryData(courseQuery(params.id)),
  component: CoursePage,
});

function CoursePage() {
  const { id } = Route.useParams();
  const { data: course } = useSuspenseQuery(courseQuery(id));
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function remove() {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) { toast.error("Could not delete course."); return; }
    await qc.invalidateQueries({ queryKey: ["courses"] });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All courses
        </Link>
        {course && (
          <Button variant="outline" size="sm" className="rounded-full" onClick={remove}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>
      {course ? (
        <>
          {course.source_filename && <p className="text-xs text-muted-foreground">From {course.source_filename}</p>}
          <CourseView course={course} />
        </>
      ) : (
        <p className="text-muted-foreground">Course not found.</p>
      )}
    </div>
  );
}
