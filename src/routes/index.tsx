import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpecForge — AI course specification workspace" },
      { name: "description", content: "Upload a syllabus and let AI turn it into structured course outcomes, units and credits." },
      { property: "og:title", content: "SpecForge — AI course specification workspace" },
      { property: "og:description", content: "Upload a syllabus and let AI turn it into structured course outcomes, units and credits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2.5">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-2xl font-bold tracking-tight">
            spec<span className="text-accent">forge</span>
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">Turn any syllabus into a structured course spec.</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Upload a PDF, image or text syllabus. Gemini reads it and extracts outcomes, Bloom levels, units and credits.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/dashboard">Open workspace</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
