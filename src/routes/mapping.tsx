import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/mapping.html?raw";
import css from "@/screens/mapping.css.txt?raw";
import js from "@/screens/mapping.js.txt?raw";

export const Route = createFileRoute("/mapping")({
  head: () => ({
    meta: [
      { title: "CO-PO-PSO Map — SpecForge" },
      { name: "description", content: "Map course outcomes to program outcomes and PSOs." },
      { property: "og:title", content: "CO-PO-PSO Map — SpecForge" },
      { property: "og:description", content: "Map course outcomes to program outcomes and PSOs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MappingPage,
});

function MappingPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
