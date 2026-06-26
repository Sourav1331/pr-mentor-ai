import React from "react";
import { GitPullRequestArrow, SearchX } from "../icons";

const examples = [
  "https://github.com/vercel/next.js",
  "https://github.com/langchain-ai/langchain",
  "https://github.com/huggingface/transformers"
];

export default function RepoForm({ form, setForm, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="relative overflow-hidden rounded-full border border-teal-200/20 bg-stone-950/65 p-2 shadow-panel backdrop-blur-xl">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_118px_auto] sm:items-center">
        <label className="relative block">
          <span className="sr-only">Repository URL</span>
          <SearchX className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 text-stone-500 sm:block" size={18} />
          <input
            type="url"
            required
            value={form.repoUrl}
            onChange={(event) => setForm((current) => ({ ...current, repoUrl: event.target.value, useLlm: false }))}
            placeholder="https://github.com/owner/repository"
            className="focus-ring h-12 w-full rounded-full border border-transparent bg-transparent px-5 text-sm text-stone-100 placeholder:text-stone-500 sm:pl-12"
          />
        </label>
        <label className="block">
          <span className="sr-only">Max PRs</span>
          <input
            type="number"
            min="1"
            max="20"
            value={form.maxPrs}
            onChange={(event) => setForm((current) => ({ ...current, maxPrs: event.target.value }))}
            className="focus-ring h-12 w-full rounded-full border border-teal-200/15 bg-stone-950/70 px-4 text-center text-sm text-stone-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-300 px-6 text-sm font-bold text-stone-950 shadow-glow hover:from-teal-400 hover:to-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <GitPullRequestArrow size={17} />
          {loading ? "Scanning" : "Launch Scan"}
        </button>
      </div>

      <div className="absolute left-1/2 top-[calc(100%+18px)] hidden -translate-x-1/2 flex-wrap justify-center gap-2 sm:flex">
        {examples.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setForm((current) => ({ ...current, repoUrl: url, useLlm: false }))}
            className="focus-ring rounded-full border border-teal-200/15 bg-teal-300/5 px-3 py-1.5 text-xs text-teal-100 hover:bg-teal-300/10"
          >
            {url.replace("https://github.com/", "")}
          </button>
        ))}
      </div>
    </form>
  );
}
