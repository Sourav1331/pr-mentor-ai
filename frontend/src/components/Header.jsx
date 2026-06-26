import React from "react";
import { Github, Moon, Sun } from "../icons";

export default function Header({ darkMode, onToggleDarkMode }) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950">
            <Github size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">PR Mentor AI</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Understand pull requests faster with AI-powered GitHub API analysis.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
