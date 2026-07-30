// src/app/chat/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { sendChatMessage } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, ArrowUp } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong reaching the assistant. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-6 flex flex-col flex-1">
        <header className="flex items-center justify-between pt-14 pb-6 border-b border-hairline shrink-0">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-slate hover:text-accent transition-colors mb-3"
            >
              <ArrowLeft size={13} />
              projects
            </Link>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              Assistant
            </h1>
          </div>
          <span className="font-mono text-xs text-slate">gpt-4o-mini</span>
        </header>

        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {messages.length === 0 && (
            // <div className="border border-dashed border-hairline rounded-md px-4 py-6 text-center">
            //   <p className="text-sm text-slate">
            //     Ask about your projects, or ask it to create and complete tasks.
            //   </p>
            //   <p className="font-mono text-xs text-slate/70 mt-2">
            //     &quot;what projects do i have?&quot; · &quot;create a task
            //     called buy milk under project 1&quot;
            //   </p>
            // </div>
            <div className="border border-dashed border-hairline rounded-md px-4 py-6 text-center">
              <p className="text-sm text-slate">
                Manage your projects and tasks using natural language.
              </p>

              <div className="mt-3 space-y-1 font-mono text-xs text-slate/70">
                <p>&quot;What projects do I have?&quot;</p>
                <p>&quot;Create a project called Personal&quot;</p>
                <p>
                  &quot;Add a task &apos;Buy groceries&apos; to Personal&quot;
                </p>
                <p>&quot;Show incomplete tasks in project 1&quot;</p>
                <p>&quot;Mark task 3 as completed&quot;</p>
                <p>&quot;Rename task 5 to Buy milk&quot;</p>
                <p>&quot;Move task 2 to project 3&quot;</p>
                <p>&quot;What&apos;s the progress of project 1?&quot;</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate">
                {msg.role === "user" ? "You" : "Ledger"}
              </span>
              <div
                className={
                  msg.role === "user"
                    ? "inline-block rounded-md bg-accent/10 px-3 py-2 text-[15px] text-ink"
                    : "text-[15px] text-ink leading-relaxed"
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate">
                Ledger
              </span>
              <div className="text-[15px] text-slate/70">thinking…</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-hairline py-5 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your tasks..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-hairline bg-transparent px-3 py-2 text-sm text-ink placeholder:text-slate/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            aria-label="Send message"
            className="flex items-center justify-center rounded-md bg-accent w-9 h-9 text-white hover:bg-accent/90 disabled:opacity-50 transition-colors shrink-0"
          >
            <ArrowUp size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}
