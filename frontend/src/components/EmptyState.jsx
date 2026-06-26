import React from "react";
import { SearchX } from "../icons";

export default function EmptyState({
  title = "No pull requests to show",
  message = "Try another repository or adjust your filters."
}) {
  return (
    <div className="glass-panel rounded-lg border-dashed p-8 text-center">
      <SearchX className="mx-auto text-teal-200" size={34} />
      <h2 className="mt-3 text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
    </div>
  );
}
