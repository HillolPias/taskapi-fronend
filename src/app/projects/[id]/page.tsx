// src/app/projects/[id]/page.tsx
import { getProject } from "@/lib/api";
import { ProjectWithTasks } from "@/lib/types";
import TaskList from "./TaskList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project: ProjectWithTasks = await getProject(Number(id));
  const doneCount = project.tasks.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-2xl mx-auto px-6">
        <header className="pt-14 pb-6 border-b border-hairline">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-slate hover:text-accent transition-colors mb-3 w-fit"
          >
            <ArrowLeft size={13} />
            projects
          </Link>

          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink truncate">
              {project.name}
            </h1>
            <span className="font-mono text-xs text-slate shrink-0">
              P-{String(project.id).padStart(3, "0")}
            </span>
          </div>

          <p className="font-mono text-xs text-slate mt-2">
            {project.tasks.length} tasks · {doneCount} done
          </p>
        </header>

        <section className="py-10">
          <TaskList projectId={project.id} initialTasks={project.tasks} />
        </section>
      </div>
    </main>
  );
}
