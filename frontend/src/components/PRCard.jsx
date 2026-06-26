import React from "react";
import {
  CheckCircle2,
  Clipboard,
  ExternalLink,
  FileCode2,
  GitBranch,
  ShieldAlert,
  XCircle
} from "../icons";

const difficultyStyles = {
  beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
};

const sizeStyles = {
  small: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  medium: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  large: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
};

function checklistIcon(status) {
  if (status === "pass") return <CheckCircle2 size={16} className="text-emerald-600" />;
  if (status === "fail") return <XCircle size={16} className="text-red-600" />;
  return <ShieldAlert size={16} className="text-amber-600" />;
}

export default function PRCard({ pr }) {
  const createdDate = pr.created_at ? new Date(pr.created_at).toLocaleDateString() : "Unknown date";

  const copyComment = async () => {
    await navigator.clipboard.writeText(pr.suggested_review_comment);
  };

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <GitBranch size={13} /> #{pr.number}
            </span>
            <span className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${difficultyStyles[pr.difficulty]}`}>
              {pr.difficulty} · {pr.difficulty_score}/10
            </span>
            <span className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${sizeStyles[pr.pr_size]}`}>
              {pr.pr_size}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-normal text-slate-950 dark:text-white">{pr.title}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Opened by {pr.author} on {createdDate}</p>
        </div>
        <a
          href={pr.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Open PR <ExternalLink size={16} />
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Changed files" value={pr.changed_files_count} />
        <Metric label="Additions" value={`+${pr.additions}`} tone="text-emerald-600" />
        <Metric label="Deletions" value={`-${pr.deletions}`} tone="text-red-600" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pr.learning_tags.map((tag) => (
          <span key={tag} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <TextBlock title="Summary" text={pr.summary} />
        <TextBlock title="Beginner explanation" text={pr.beginner_explanation} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Review checklist</h3>
          <div className="mt-3 space-y-2">
            {pr.review_checklist.map((item) => (
              <div key={item.item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                {checklistIcon(item.status)}
                <span>{item.item}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Suggested maintainer comment</h3>
            <button
              type="button"
              onClick={copyComment}
              className="focus-ring inline-flex h-8 items-center gap-1 rounded-lg border border-slate-300 px-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Clipboard size={14} /> Copy
            </button>
          </div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
            {pr.suggested_review_comment}
          </p>
        </section>
      </div>

      <section className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
          <ShieldAlert size={16} /> Possible risks
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {pr.possible_risks.map((risk) => (
            <li key={risk}>- {risk}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
          <FileCode2 size={16} /> Changed files
        </h3>
        <div className="mt-3 max-h-56 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">
          {pr.changed_files.map((file) => (
            <div key={file.filename} className="grid gap-2 border-b border-slate-100 px-3 py-2 text-sm last:border-b-0 dark:border-slate-800 sm:grid-cols-[1fr_auto]">
              <span className="min-w-0 break-all font-mono text-xs text-slate-700 dark:text-slate-300">{file.filename}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {file.status} · <span className="text-emerald-600">+{file.additions}</span> <span className="text-red-600">-{file.deletions}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function Metric({ label, value, tone = "text-slate-950 dark:text-white" }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function TextBlock({ title, text }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </section>
  );
}
