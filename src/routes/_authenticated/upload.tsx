import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseView } from "@/components/CourseView";
import { extractSyllabus } from "@/lib/syllabus.functions";
import type { CourseDraft } from "@/lib/course-schema";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({ meta: [{ title: "Upload & Ingest — SpecForge" }, { name: "description", content: "Upload a syllabus for AI extraction." }] }),
  component: UploadPage,
});

const ACCEPT = "application/pdf,image/png,image/jpeg,image/webp,text/plain,text/markdown";
const MAX = 15 * 1024 * 1024;

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function UploadPage() {
  const extract = useServerFn(extractSyllabus);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<CourseDraft | null>(null);
  const [busy, setBusy] = useState<"read" | "save" | null>(null);

  async function pick(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX) return toast.error("File is larger than 15 MB.");
    setFile(f);
    setDraft(null);
    setBusy("read");
    try {
      const base64 = await toBase64(f);
      const res = await extract({ data: { filename: f.name, mimeType: f.type || "text/plain", base64 } });
      if (res.error || !res.course) toast.error(res.error ?? "Could not read file");
      else setDraft(res.course);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function save() {
    if (!draft) return;
    setBusy("save");
    const { data, error } = await supabase
      .from("courses")
      .insert({ ...draft, source_filename: file?.name ?? "" })
      .select("id")
      .single();
    setBusy(null);
    if (error) return toast.error("Could not save course.");
    await qc.invalidateQueries({ queryKey: ["courses"] });
    toast.success("Course saved");
    navigate({ to: "/courses/$id", params: { id: data.id } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Upload & Ingest</h1>
        <p className="mt-1 text-sm text-muted-foreground">PDF, image or text syllabus · up to 15 MB · read by Gemini 3.8 Flash</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-border bg-card p-12 text-center transition hover:border-accent">
        {busy === "read" ? <Loader2 className="h-10 w-10 animate-spin text-accent" /> : <UploadCloud className="h-10 w-10 text-accent" />}
        <p className="mt-3 font-bold">{busy === "read" ? `Reading ${file?.name}…` : file ? file.name : "Choose a syllabus file"}</p>
        <p className="mt-1 text-xs text-muted-foreground">{busy === "read" ? "This can take up to a minute" : "Click to browse"}</p>
        <input type="file" accept={ACCEPT} className="hidden" disabled={!!busy} onChange={(e) => pick(e.target.files?.[0])} />
      </label>

      {draft && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-sidebar p-4 text-primary-foreground">
            <p className="text-sm">Review the extracted course below, then save it.</p>
            <Button variant="secondary" className="rounded-full" onClick={save} disabled={!!busy}>
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />} Save course
            </Button>
          </div>
          <CourseView course={draft} />
        </>
      )}
    </div>
  );
}
