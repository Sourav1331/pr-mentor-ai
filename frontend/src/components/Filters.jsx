import React from "react";

export default function Filters({ filters, setFilters, availableTags }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={filters.search}
        onChange={(event) => update("search", event.target.value)}
        placeholder="Search title or author"
        className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
      <select value={filters.difficulty} onChange={(event) => update("difficulty", event.target.value)} className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
        <option value="all">All difficulty</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select value={filters.tag} onChange={(event) => update("tag", event.target.value)} className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
        <option value="all">All learning tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      <select value={filters.size} onChange={(event) => update("size", event.target.value)} className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
        <option value="all">All PR sizes</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      <select value={filters.tests} onChange={(event) => update("tests", event.target.value)} className="focus-ring rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
        <option value="all">Tests: all</option>
        <option value="yes">Tests added</option>
        <option value="no">No tests found</option>
      </select>
    </section>
  );
}
