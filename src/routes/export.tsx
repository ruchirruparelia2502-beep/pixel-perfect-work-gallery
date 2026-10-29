import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/export.html?raw";
import css from "@/screens/export.css.txt?raw";
import js from "@/screens/export.js.txt?raw";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export Dossier — SpecForge" },
      { name: "description", content: "Preview and export the university specification." },
      { property: "og:title", content: "Export Dossier — SpecForge" },
      { property: "og:description", content: "Preview and export the university specification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExportPage,
});

function ExportPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
