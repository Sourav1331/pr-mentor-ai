import React from "react";
import { Github, GitPullRequestArrow, Moon, Sun } from "../icons";

export default function Header({ theme, setTheme, onScanHint }) {
  const isDark = theme === "dark";

  return (
    <header className="relative z-20 border-b border-teal-200/10 bg-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-200/30 bg-teal-300/10 text-teal-100 shadow-glow">
            <Github size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-normal text-white">PR Mentor AI</h1>
            <p className="text-xs text-stone-400">GitHub REST API review console</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <HeaderChip icon={GitPullRequestArrow} label="PR scan" onClick={onScanHint} />
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-200/20 bg-teal-300/10 text-teal-100 shadow-soft-panel backdrop-blur-xl transition hover:bg-teal-300/15"
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeaderChip({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-teal-200/15 bg-teal-300/10 px-3 py-2 text-xs font-semibold text-teal-100 shadow-soft-panel backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-teal-300/15"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
