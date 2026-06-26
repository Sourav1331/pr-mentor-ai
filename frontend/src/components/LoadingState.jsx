import React from "react";

export default function LoadingState() {
  return (
    <div className="glass-panel rounded-lg p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-3 w-3 animate-ping rounded-full bg-teal-300" />
        <div className="h-5 w-44 animate-pulse rounded bg-teal-300/20" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-lg border border-teal-200/10 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-teal-300/20" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-stone-300/10" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-stone-300/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
