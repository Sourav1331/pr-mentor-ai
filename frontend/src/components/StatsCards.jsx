import React from "react";
import { BookOpen, FileText, Gauge, GitPullRequestArrow, TestTube2 } from "../icons";

const iconMap = {
  total: GitPullRequestArrow,
  beginner: BookOpen,
  tests: TestTube2,
  docs: FileText,
  large: Gauge
};

export default function StatsCards({ result }) {
  const stats = [
    { key: "total", label: "Total PRs analyzed", value: result?.total_prs ?? 0 },
    { key: "beginner", label: "Beginner-friendly PRs", value: result?.stats?.beginner_friendly ?? 0 },
    { key: "tests", label: "PRs with tests", value: result?.stats?.tests_added ?? 0 },
    { key: "docs", label: "Documentation PRs", value: result?.stats?.docs_updated ?? 0 },
    { key: "large", label: "Large PRs", value: result?.stats?.large_prs ?? 0 }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((item) => {
        const Icon = iconMap[item.key];
        return (
          <div key={item.key} className="glass-panel group relative overflow-hidden rounded-lg p-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/60 to-transparent opacity-70" />
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">{item.label}</p>
              <span className="rounded-lg border border-teal-200/20 bg-teal-300/10 p-2 text-teal-200">
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            <div className="mt-3 h-1 rounded-full bg-stone-800">
              <div className="h-1 w-2/3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-300" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
