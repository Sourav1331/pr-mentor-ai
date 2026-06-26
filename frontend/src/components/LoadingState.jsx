import React from "react";

export default function LoadingState() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 h-5 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
