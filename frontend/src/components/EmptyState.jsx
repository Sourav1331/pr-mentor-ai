import React from "react";
import { SearchX } from "../icons";

export default function EmptyState({ title = "No pull requests to show", message = "Try another repository or adjust your filters." }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <SearchX className="mx-auto text-slate-400" size={34} />
      <h2 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
