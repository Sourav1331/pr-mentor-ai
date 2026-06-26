import React from "react";

export default function Filters({ filters, setFilters, availableTags }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const fieldClass =
    "focus-ring rounded-lg border border-teal-200/20 bg-stone-950/80 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500";

  return (
    <section className="glass-panel grid gap-3 rounded-lg p-4 md:grid-cols-2 xl:grid-cols-5">
      <input
        value={filters.search}
        onChange={(event) => update("search", event.target.value)}
        placeholder="Search title or author"
        className={fieldClass}
      />
      <select value={filters.difficulty} onChange={(event) => update("difficulty", event.target.value)} className={fieldClass}>
        <option value="all">All difficulty</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>
      <select value={filters.tag} onChange={(event) => update("tag", event.target.value)} className={fieldClass}>
        <option value="all">All learning tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <select value={filters.size} onChange={(event) => update("size", event.target.value)} className={fieldClass}>
        <option value="all">All PR sizes</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      <select value={filters.tests} onChange={(event) => update("tests", event.target.value)} className={fieldClass}>
        <option value="all">Tests: all</option>
        <option value="yes">Tests added</option>
        <option value="no">No tests found</option>
      </select>
    </section>
  );
}
