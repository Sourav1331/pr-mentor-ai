import React from "react";
import { GitPullRequestArrow, Sparkles } from "../icons";

export default function RepoForm({ form, setForm, onSubmit, loading }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-panel dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_150px_auto_auto] lg:items-end">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub repository URL</span>
          <input
            type="url"
            required
            value={form.repoUrl}
            onChange={(event) => setForm((current) => ({ ...current, repoUrl: event.target.value }))}
            placeholder="https://github.com/fastapi/fastapi"
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Max PRs</span>
          <input
            type="number"
            min="1"
            max="20"
            value={form.maxPrs}
            onChange={(event) => setForm((current) => ({ ...current, maxPrs: event.target.value }))}
            className="focus-ring mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-950 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-300 px-3 py-2.5 dark:border-slate-700">
          <input
            type="checkbox"
            checked={form.useLlm}
            onChange={(event) => setForm((current) => ({ ...current, useLlm: event.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <Sparkles size={16} /> Use LLM mode
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <GitPullRequestArrow size={17} />
          {loading ? "Analyzing" : "Analyze"}
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">LLM mode requires backend GROQ_API_KEY. Public repositories work without a GitHub token.</p>
    </form>
  );
}
