import React from "react";
import { Github } from "../icons";

export default function Header() {
  return (
    <header className="relative border-b border-teal-200/10 bg-stone-950/45 backdrop-blur-xl">
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
        <div className="hidden items-center gap-2 rounded-full border border-teal-200/15 bg-teal-300/5 px-3 py-1.5 text-xs font-medium text-teal-100 sm:flex">
          <span className="h-2 w-2 rounded-full bg-teal-300 shadow-glow" />
          Online
        </div>
      </div>
    </header>
  );
}
