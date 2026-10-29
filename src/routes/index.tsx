import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/dashboard.html?raw";
import css from "@/screens/dashboard.css.txt?raw";
import js from "@/screens/dashboard.js.txt?raw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SpecForge" },
      { name: "description", content: "Faculty course specification and curriculum dashboard." },
      { property: "og:title", content: "Dashboard — SpecForge" },
      { property: "og:description", content: "Faculty course specification and curriculum dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
