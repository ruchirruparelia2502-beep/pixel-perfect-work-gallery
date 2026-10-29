import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/audit.html?raw";
import css from "@/screens/audit.css.txt?raw";
import js from "@/screens/audit.js.txt?raw";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "OBE Audit & Checks — SpecForge" },
      { name: "description", content: "Run outcome-based education audit checks." },
      { property: "og:title", content: "OBE Audit & Checks — SpecForge" },
      { property: "og:description", content: "Run outcome-based education audit checks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
