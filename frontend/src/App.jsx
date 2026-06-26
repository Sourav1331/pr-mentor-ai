import React, { useMemo, useState } from "react";

import { analyzePullRequests } from "./api";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import Filters from "./components/Filters";
import Header from "./components/Header";
import LoadingState from "./components/LoadingState";
import PRCard from "./components/PRCard";
import RepoForm from "./components/RepoForm";
import StatsCards from "./components/StatsCards";

const initialFilters = {
  search: "",
  difficulty: "all",
  tag: "all",
  size: "all",
  tests: "all"
};

export default function App() {
  const [form, setForm] = useState({
    repoUrl: "",
    maxPrs: 10,
    useLlm: false
  });
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableTags = useMemo(() => {
    const tags = new Set();
    result?.pull_requests?.forEach((pr) => pr.learning_tags.forEach((tag) => tags.add(tag)));
    return [...tags].sort();
  }, [result]);

  const filteredPullRequests = useMemo(() => {
    const pullRequests = result?.pull_requests || [];
    const search = filters.search.trim().toLowerCase();

    return pullRequests.filter((pr) => {
      const matchesSearch = !search || pr.title.toLowerCase().includes(search) || pr.author.toLowerCase().includes(search);
      const matchesDifficulty = filters.difficulty === "all" || pr.difficulty === filters.difficulty;
      const matchesTag = filters.tag === "all" || pr.learning_tags.includes(filters.tag);
      const matchesSize = filters.size === "all" || pr.pr_size === filters.size;
      const matchesTests = filters.tests === "all" || (filters.tests === "yes" ? pr.tests_added : !pr.tests_added);
      return matchesSearch && matchesDifficulty && matchesTag && matchesSize && matchesTests;
    });
  }, [result, filters]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setFilters(initialFilters);

    try {
      const data = await analyzePullRequests(form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark">
      <div className="app-shell relative min-h-screen overflow-hidden text-slate-100">
        <div className="ambient-field pointer-events-none absolute inset-0" />
        <div className="ambient-orbit ambient-orbit-a pointer-events-none absolute" />
        <div className="ambient-orbit ambient-orbit-b pointer-events-none absolute" />
        <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-24" />
        <Header />
        <main className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-10 pt-12 lg:px-8">
          <section className="hero-minimal mx-auto flex min-h-[520px] w-full max-w-5xl flex-col items-center justify-center px-2 text-center">
            <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-teal-200/25 bg-teal-300/10 text-teal-100 shadow-glow">
              <span className="text-4xl font-black">PR</span>
            </div>
            <h1 className="text-5xl font-black leading-none tracking-normal text-white md:text-7xl">
              PR_<span className="bg-gradient-to-r from-stone-100 via-teal-200 to-emerald-300 bg-clip-text text-transparent">Mentor</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-stone-300">
              Decode any public GitHub repository's open pull requests. Reveal summaries, risks, learning tags, tests, docs, and maintainer review guidance in one sleek console.
            </p>
            <div className="mt-10 w-full max-w-3xl">
              <RepoForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} />
            </div>
            <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <MiniMetric label="API" value="GitHub REST" />
              <MiniMetric label="Mode" value={loading ? "Scanning" : "Ready"} />
              <MiniMetric label="PRs" value={result?.total_prs ?? "--"} />
            </div>
          </section>

          {!result && !loading && !error && (
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">What You Get</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">A maintainer-grade PR briefing</h2>
                  </div>
                  <div className="hidden rounded-full border border-teal-200/20 bg-teal-300/10 px-3 py-1 text-xs text-teal-100 sm:block">
                    no paid key required
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <FeatureCard title="Beginner explanation" text="Turns complex pull requests into plain-language learning notes." />
                  <FeatureCard title="Review checklist" text="Highlights description quality, risk level, tests, docs, and sensitive files." />
                  <FeatureCard title="Contribution scoring" text="Labels difficulty, PR size, learning tags, and review confidence." />
                  <FeatureCard title="Maintainer comment" text="Generates a professional suggested review response you can copy." />
                </div>
              </div>

              <div className="glass-panel overflow-hidden rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Preview Signal</p>
                  <span className="rounded-full bg-teal-300/10 px-3 py-1 text-xs text-teal-100">rule-based</span>
                </div>
                <div className="space-y-4">
                  <SignalRow label="Risk scan" value="security, database, CI/CD, large diff" width="w-10/12" />
                  <SignalRow label="Learning tags" value="backend, frontend, tests, docs" width="w-8/12" />
                  <SignalRow label="Review output" value="summary, checklist, comment" width="w-11/12" />
                </div>
                <div className="mt-5 rounded-xl border border-teal-200/10 bg-stone-950/50 p-4">
                  <p className="font-mono text-xs leading-6 text-stone-300">
                    {">"} Waiting for repository input...
                    <br />
                    {">"} Fetching open PRs via GitHub REST API
                    <br />
                    {">"} Analyzing changed files and review signals
                  </p>
                </div>
              </div>
            </section>
          )}
          <ErrorState message={error} />

          {loading && <LoadingState />}

          {!loading && !result && !error && (
            <EmptyState
              title="Analyze a public repository"
              message="Enter a GitHub repository URL to fetch open PRs and generate review guidance."
            />
          )}

          {!loading && result && (
            <>
              <div className="glass-panel flex flex-col gap-2 rounded-lg p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">Repository Signal</p>
                <h2 className="text-2xl font-semibold text-white">{result.repo}</h2>
                <p className="text-sm text-stone-400">Live pull request intelligence from the GitHub REST API.</p>
              </div>
              <StatsCards result={result} />

              {result.total_prs > 0 ? (
                <>
                  <Filters filters={filters} setFilters={setFilters} availableTags={availableTags} />
                  {filteredPullRequests.length > 0 ? (
                    <section className="space-y-4">
                      {filteredPullRequests.map((pr) => (
                        <PRCard key={pr.number} pr={pr} />
                      ))}
                    </section>
                  ) : (
                    <EmptyState title="No PRs match these filters" message="Adjust search, difficulty, size, tag, or tests filters." />
                  )}
                </>
              ) : (
                <EmptyState title="No open pull requests" message="This repository does not currently have open PRs." />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-teal-200/10 bg-stone-950/50 p-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-teal-100">{value}</p>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="rounded-xl border border-teal-200/10 bg-stone-950/45 p-4">
      <div className="mb-3 h-1.5 w-12 rounded-full bg-gradient-to-r from-teal-400 to-emerald-200" />
      <h3 className="font-semibold text-stone-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-400">{text}</p>
    </div>
  );
}

function SignalRow({ label, value, width }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-stone-200">{label}</span>
        <span className="truncate text-xs text-stone-500">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-stone-800">
        <div className={`${width} h-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-300`} />
      </div>
    </div>
  );
}
