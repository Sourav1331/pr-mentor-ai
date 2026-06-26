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
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({
    repoUrl: "https://github.com/fastapi/fastapi",
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
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((value) => !value)} />
        <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8">
          <RepoForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} />
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
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Repository</p>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{result.repo}</h2>
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
