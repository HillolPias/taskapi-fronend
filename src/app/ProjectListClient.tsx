"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/types";
import { createProject, deleteProject } from "@/lib/api";
import { ArrowRight, Trash2, Plus } from "lucide-react";

export default function ProjectListClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createProject(newName);
      setProjects((prev) => [...prev, created]);
      setNewName("");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(projectId: number) {
    const confirmed = window.confirm(
      "Delete this project? All its tasks will be deleted too.",
    );
    if (!confirmed) return;

    await deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }

  return (
    <div>
      {projects.length === 0 ? (
        <p className="text-sm text-slate py-8 text-center border border-dashed border-hairline rounded-md">
          No projects yet — add your first one below.
        </p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {projects.map((project) => (
            <li key={project.id} className="group flex items-center gap-4 py-4">
              <span className="font-mono text-xs text-slate shrink-0 w-14">
                P-{String(project.id).padStart(3, "0")}
              </span>

              <Link
                href={`/projects/${project.id}`}
                className="flex-1 flex items-center justify-between min-w-0"
              >
                <span className="text-[15px] text-ink truncate">
                  {project.name}
                </span>
                <ArrowRight
                  size={16}
                  className="hidden md:block text-slate opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-3"
                />
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(project.id);
                }}
                aria-label={`Delete ${project.name}`}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-slate hover:text-red-600 transition-opacity shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex gap-2 mt-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New project name..."
          className="flex-1 rounded-md border border-hairline bg-transparent px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          <Plus size={15} />
          Add
        </button>
      </form>
    </div>
  );
}
