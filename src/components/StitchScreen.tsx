import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";

const NAV: Record<string, string> = {
  dashboard: "/",
  "upload & ingest": "/upload",
  "co-po-pso map": "/mapping",
  "obe audit & checks": "/audit",
  "approval & governance": "/approval",
  "export dossier": "/export",
};

type Props = { html: string; css: string; js: string };

export function StitchScreen({ html, css, js }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const w = window as unknown as { __sfReady: (fn: () => void) => void };
    w.__sfReady = (fn) => fn();
    const script = document.createElement("script");
    script.textContent = js;
    document.body.appendChild(script);

    const root = ref.current;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("aside a");
      if (!a) return;
      const label = (a.textContent || "").replace(/\bNew\b/, "").replace(/\s+/g, " ").trim().toLowerCase();
      const to = NAV[label];
      if (to) {
        e.preventDefault();
        navigate({ to });
      }
    };
    root?.addEventListener("click", onClick);
    return () => {
      root?.removeEventListener("click", onClick);
      script.remove();
    };
  }, [js, navigate]);

  return (
    <div className="sf-page min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
