import React from "react";
import { Github, GitPullRequestArrow, Sparkles } from "../icons";

const repos = [
  { name: "vercel/next.js", meta: "Framework", tone: "teal" },
  { name: "facebook/react", meta: "UI library", tone: "blue" },
  { name: "microsoft/vscode", meta: "Editor", tone: "cyan" },
  { name: "langchain-ai/langchain", meta: "AI apps", tone: "emerald" },
  { name: "huggingface/transformers", meta: "Models", tone: "lime" },
  { name: "nodejs/node", meta: "Runtime", tone: "teal" },
  { name: "kubernetes/kubernetes", meta: "Infra", tone: "blue" },
  { name: "pytorch/pytorch", meta: "ML", tone: "emerald" },
  { name: "tailwindlabs/tailwindcss", meta: "CSS", tone: "cyan" },
  { name: "vitejs/vite", meta: "Build tool", tone: "lime" },
  { name: "fastapi/fastapi", meta: "Backend", tone: "teal" },
  { name: "openai/openai-python", meta: "SDK", tone: "blue" },
  { name: "supabase/supabase", meta: "Database", tone: "emerald" },
  { name: "denoland/deno", meta: "Runtime", tone: "cyan" },
  { name: "rust-lang/rust", meta: "Language", tone: "lime" },
  { name: "golang/go", meta: "Language", tone: "teal" }
];

const rows = [
  repos.slice(0, 8),
  repos.slice(4, 12),
  repos.slice(8, 16)
];

export default function RepoMarqueeBackground() {
  return (
    <div className="repo-marquee pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="repo-marquee__stage">
        {rows.map((row, index) => (
          <div
            className={`repo-marquee__row repo-marquee__row--${index + 1}`}
            key={index}
          >
            {[...row, ...row].map((repo, repoIndex) => (
              <RepoTile repo={repo} key={`${repo.name}-${repoIndex}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RepoTile({ repo }) {
  return (
    <div className={`repo-tile repo-tile--${repo.tone}`}>
      <div className="flex items-center justify-between gap-4">
        <Github size={18} />
        <Sparkles size={14} />
      </div>
      <div>
        <p className="repo-tile__name">{repo.name}</p>
        <p className="repo-tile__meta">{repo.meta}</p>
      </div>
      <div className="repo-tile__footer">
        <span>open PRs</span>
        <GitPullRequestArrow size={14} />
      </div>
    </div>
  );
}
