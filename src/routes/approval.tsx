import { createFileRoute } from "@tanstack/react-router";
import { StitchScreen } from "@/components/StitchScreen";
import html from "@/screens/approval.html?raw";
import css from "@/screens/approval.css.txt?raw";
import js from "@/screens/approval.js.txt?raw";

export const Route = createFileRoute("/approval")({
  head: () => ({
    meta: [
      { title: "Approval & Governance — SpecForge" },
      { name: "description", content: "Curriculum approval and governance workflow." },
      { property: "og:title", content: "Approval & Governance — SpecForge" },
      { property: "og:description", content: "Curriculum approval and governance workflow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApprovalPage,
});

function ApprovalPage() {
  return <StitchScreen html={html} css={css} js={js} />;
}
