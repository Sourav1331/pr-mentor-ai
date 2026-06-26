import React from "react";
import { AlertTriangle } from "../icons";

export default function ErrorState({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
      <AlertTriangle size={20} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">Analysis failed</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}
