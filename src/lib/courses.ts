import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeCourse, type CourseDraft } from "./course-schema";

export type Course = CourseDraft & { id: string; source_filename: string; created_at: string };

function toCourse(row: Record<string, unknown>): Course {
  return {
    ...normalizeCourse(row),
    id: String(row["id"]),
    source_filename: String(row["source_filename"] ?? ""),
    created_at: String(row["created_at"] ?? ""),
  };
}

export const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: async () => {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => toCourse(r as Record<string, unknown>));
  },
});

export const courseQuery = (id: string) =>
  queryOptions({
    queryKey: ["courses", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? toCourse(data as Record<string, unknown>) : null;
    },
  });
