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
  beginner: "border-teal-200/30 bg-teal-300/10 text-teal-100",
  intermediate: "border-emerald-200/30 bg-emerald-300/10 text-emerald-100",
  advanced: "border-stone-200/25 bg-stone-300/10 text-stone-100"
};

const sizeStyles = {
  small: "border-teal-200/30 bg-teal-300/10 text-teal-100",
  medium: "border-emerald-200/30 bg-emerald-300/10 text-emerald-100",
  large: "border-stone-200/25 bg-stone-300/10 text-stone-100"
};

function checklistIcon(status) {
  if (status === "pass") return <CheckCircle2 size={16} className="text-teal-300" />;
  if (status === "fail") return <XCircle size={16} className="text-stone-200" />;
  return <ShieldAlert size={16} className="text-emerald-300" />;
}

export default function PRCard({ pr }) {
  const createdDate = pr.created_at ? new Date(pr.created_at).toLocaleDateString() : "Unknown date";

  const copyComment = async () => {
    await navigator.clipboard.writeText(pr.suggested_review_comment);
  };

  return (
    <article className="glass-panel relative overflow-hidden rounded-lg p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-200/80 to-transparent" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="signal-chip inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium">
              <GitBranch size={13} /> #{pr.number}
            </span>
            <span className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${difficultyStyles[pr.difficulty]}`}>
              {pr.difficulty} - {pr.difficulty_score}/10
            </span>
            <span className={`rounded-md border px-2 py-1 text-xs font-semibold capitalize ${sizeStyles[pr.pr_size]}`}>
              {pr.pr_size}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-normal text-white">{pr.title}</h2>
          <p className="mt-1 text-sm text-slate-400">Opened by {pr.author} on {createdDate}</p>
        </div>
        <a
          href={pr.url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-teal-200/25 bg-teal-300/10 px-3 text-sm font-medium text-teal-100 hover:bg-teal-300/20"
        >
          Open PR <ExternalLink size={16} />
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Changed files" value={pr.changed_files_count} />
        <Metric label="Additions" value={`+${pr.additions}`} tone="text-teal-200" />
        <Metric label="Deletions" value={`-${pr.deletions}`} tone="text-stone-300" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pr.learning_tags.map((tag) => (
          <span key={tag} className="rounded-md border border-teal-200/20 bg-teal-300/10 px-2 py-1 text-xs font-medium text-teal-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <TextBlock title="Summary" text={pr.summary} />
        <TextBlock title="Beginner explanation" text={pr.beginner_explanation} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-teal-200/10 bg-stone-950/50 p-4">
          <h3 className="text-sm font-semibold text-teal-100">Review checklist</h3>
          <div className="mt-3 space-y-2">
            {pr.review_checklist.map((item) => (
              <div key={item.item} className="flex items-center gap-2 text-sm text-slate-300">
                {checklistIcon(item.status)}
                <span>{item.item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-teal-200/10 bg-stone-950/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-teal-100">Suggested maintainer comment</h3>
            <button
              type="button"
              onClick={copyComment}
              className="focus-ring inline-flex h-8 items-center gap-1 rounded-lg border border-teal-200/25 bg-teal-300/10 px-2 text-xs font-medium text-teal-100 hover:bg-teal-300/20"
            >
              <Clipboard size={14} /> Copy
            </button>
          </div>
          <p className="mt-3 rounded-lg border border-teal-200/10 bg-stone-950/40 p-3 text-sm leading-6 text-stone-300">
            {pr.suggested_review_comment}
          </p>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-teal-200/10 bg-stone-950/40 p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-teal-100">
          <ShieldAlert size={16} /> Possible risks
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {pr.possible_risks.map((risk) => (
            <li key={risk}>- {risk}</li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-teal-100">
          <FileCode2 size={16} /> Changed files
        </h3>
        <div className="mt-3 max-h-56 overflow-auto rounded-lg border border-teal-200/10 bg-stone-950/50">
          {pr.changed_files.map((file) => (
            <div key={file.filename} className="grid gap-2 border-b border-teal-200/10 px-3 py-2 text-sm last:border-b-0 sm:grid-cols-[1fr_auto]">
              <span className="min-w-0 break-all font-mono text-xs text-slate-300">{file.filename}</span>
              <span className="text-xs text-slate-400">
                {file.status} - <span className="text-teal-200">+{file.additions}</span> <span className="text-stone-300">-{file.deletions}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function Metric({ label, value, tone = "text-white" }) {
  return (
    <div className="rounded-lg border border-teal-200/10 bg-stone-950/50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function TextBlock({ title, text }) {
  return (
    <section className="rounded-lg border border-teal-200/10 bg-stone-950/40 p-4">
      <h3 className="text-sm font-semibold text-teal-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </section>
  );
}
