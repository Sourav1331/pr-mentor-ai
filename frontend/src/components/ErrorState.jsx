import React from "react";
import { AlertTriangle } from "../icons";

export default function ErrorState({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-teal-200/30 bg-stone-950/60 p-4 text-teal-100 backdrop-blur-xl">
      <AlertTriangle size={20} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-medium">Analysis failed</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}
