import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { normalizeCourse, type CourseDraft } from "./course-schema";

const MAX_BYTES = 15 * 1024 * 1024;

const PROMPT = `You read university course syllabi / course specifications.
Extract ONLY what is present in the document. Never invent data; use "" or [] when missing.
Return a JSON object with exactly these keys:
{
  "code": string, "title": string, "department": string, "semester": string,
  "credits": string (e.g. "4 (L-T-P: 3-0-2)"), "regulation": string,
  "preamble": string (course description/objectives, concise),
  "prerequisites": string[],
  "outcomes": [{ "code": string (e.g. "CO1"), "statement": string, "bloom": string (Bloom level like "L2 Understand", "" if absent) }],
  "units": [{ "title": string, "topics": string, "hours": string }],
  "textbooks": string[]
}`;

export const extractSyllabus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        filename: z.string().min(1).max(255),
        mimeType: z.string().min(1).max(120),
        base64: z.string().min(1).max(Math.ceil((MAX_BYTES * 4) / 3) + 8),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<{ course: CourseDraft | null; error: string | null }> => {
    const { generateChatCompletion, GatewayError } = await import("@lovable.dev/ai-gateway");
    const isText = data.mimeType.startsWith("text/");
    const content = isText
      ? [
          { type: "text" as const, text: PROMPT },
          {
            type: "text" as const,
            text: `Document (${data.filename}):\n\n${atob(data.base64)}`,
          },
        ]
      : [
          { type: "text" as const, text: PROMPT },
          {
            type: "file" as const,
            file: {
              filename: data.filename,
              file_data: `data:${data.mimeType};base64,${data.base64}`,
            },
          },
        ];
    try {
      const res = await generateChatCompletion({
        model: "google/gemini-3.8-flash",
        messages: [{ role: "user", content }],
        response_format: { type: "json_object" },
      });
      const text = res.choices?.[0]?.message?.content;
      if (typeof text !== "string" || !text.trim()) {
        return { course: null, error: "The AI returned no data for this file." };
      }
      const json = JSON.parse(text.replace(/^```(json)?|```$/g, "").trim());
      return { course: normalizeCourse(json), error: null };
    } catch (e) {
      console.error("extractSyllabus failed", e);
      if (e instanceof GatewayError) {
        if (e.httpStatus === 402) return { course: null, error: "AI credits are used up. Please top up and try again." };
        if (e.httpStatus === 429) return { course: null, error: "Too many requests right now. Please wait a moment and retry." };
      }
      return { course: null, error: "Could not read this syllabus. Try a clearer PDF or a text file." };
    }
  });
