import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, LogOut, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/upload", label: "Upload & Ingest", icon: Upload },
] as const;

export function AppShell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1400px] flex-col gap-4 rounded-[38px] border border-border bg-card/60 p-4 shadow-shell md:flex-row lg:gap-6 lg:p-5">
        <aside className="flex flex-col justify-between rounded-[32px] bg-sidebar p-5 text-sidebar-foreground md:w-[210px] md:shrink-0">
          <div>
            <div className="mb-8 flex items-center gap-2.5 px-1">
              <div className="h-3 w-3 rounded-full bg-sidebar-primary" />
              <span className="text-xl font-bold tracking-tight text-primary-foreground">
                spec<span className="text-sidebar-primary">forge</span>
              </span>
            </div>
            <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider opacity-60">Navigation</p>
            <nav className="space-y-1">
              {nav.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition hover:bg-sidebar-accent"
                  activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={signOut}
            className="mt-8 flex items-center gap-3 rounded-2xl border-t border-sidebar-border px-3 pt-4 text-sm transition hover:text-sidebar-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </aside>
        <main className="min-w-0 flex-1 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
