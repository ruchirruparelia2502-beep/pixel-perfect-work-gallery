import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/upload.html?raw";
import css from "@/screens/upload.css.txt?raw";
import js from "@/screens/upload.js.txt?raw";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload & Ingest — SpecForge" },
      { name: "description", content: "Upload and ingest course specifications and blueprints." },
      { property: "og:title", content: "Upload & Ingest — SpecForge" },
      { property: "og:description", content: "Upload and ingest course specifications and blueprints." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
