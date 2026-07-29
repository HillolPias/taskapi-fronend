import { getProjects } from "@/lib/api";
import { Project } from "@/lib/types";
import ProjectListClient from "./ProjectListClient";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default async function HomePage() {
  const projects: Project[] = await getProjects();

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6">
        <header className="flex items-center justify-between pt-14 pb-10 border-b border-hairline">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Ledger
            </h1>
            <p className="font-mono text-xs text-slate mt-1">
              tasks, kept plainly
            </p>
          </div>

          <Link
            href="/chat"
            className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent transition-colors"
          >
            <MessageCircle size={16} strokeWidth={2} />
            Assistant
          </Link>
        </header>

        <section className="py-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate">
              Projects
            </h2>
            <span className="font-mono text-xs text-slate">
              {projects.length} total
            </span>
          </div>

          <ProjectListClient initialProjects={projects} />
        </section>
      </div>
    </main>
  );
}
