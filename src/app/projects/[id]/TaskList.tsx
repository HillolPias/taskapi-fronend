"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { updateTask, deleteTask, createTaskForProject } from "@/lib/api";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";

export default function TaskList({
  projectId,
  initialTasks,
}: {
  projectId: number;
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  async function handleToggle(task: Task) {
    const updated = await updateTask(task.id, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
  }

  async function handleDelete(taskId: number) {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await createTaskForProject(projectId, newTitle);
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(task: Task) {
    setEditingId(task.id);
    setEditValue(task.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditValue("");
  }

  async function handleSaveEdit(taskId: number) {
    if (!editValue.trim()) return;
    const updated = await updateTask(taskId, { title: editValue });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    setEditingId(null);
    setEditValue("");
  }

  return (
    <div>
      {tasks.length === 0 ? (
        <p className="text-sm text-slate py-8 text-center border border-dashed border-hairline rounded-md">
          No tasks yet — add the first one below.
        </p>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {tasks.map((task) => (
            <li key={task.id} className="group flex items-center gap-3 py-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
                className="h-4 w-4 accent-accent cursor-pointer shrink-0"
              />

              <span className="font-mono text-xs text-slate shrink-0 w-14">
                T-{String(task.id).padStart(3, "0")}
              </span>

              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                    className="flex-1 rounded-md border border-hairline bg-transparent px-2 py-1 text-[15px] text-ink focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                  />
                  <button
                    onClick={() => handleSaveEdit(task.id)}
                    aria-label="Save"
                    className="text-accent hover:text-accent/70 shrink-0"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    aria-label="Cancel"
                    className="text-slate hover:text-ink shrink-0"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 text-[15px] flex-col gap-1 md:truncate ${
                      task.completed ? "line-through text-slate" : "text-ink"
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => startEditing(task)}
                    aria-label={`Edit ${task.title}`}
                    className="text-slate hover:text-accent shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="text-slate hover:text-red-600 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex gap-2 mt-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title..."
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
