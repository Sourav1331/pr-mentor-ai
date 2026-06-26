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
          <div key={item.key} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <Icon size={18} className="text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{item.value}</p>
          </div>
        );
      })}
    </section>
  );
}
