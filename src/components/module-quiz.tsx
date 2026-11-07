"use client";

import { useState } from "react";
import { submitModuleQuizAnswer } from "@/app/programmes/quiz-actions";

type Question = { id: string; prompt: string; options: string[] };

export function ModuleQuiz({ moduleId, questions, initialAnsweredIds }: { moduleId: string; questions: Question[]; initialAnsweredIds: string[] }) {
  const [answeredIds, setAnsweredIds] = useState(initialAnsweredIds);
  const [displayIndex, setDisplayIndex] = useState(initialAnsweredIds.length);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [busy, setBusy] = useState(false);
  const question = questions[displayIndex];

  async function submitAnswer() {
    if (!question || !selected || busy) return;
    setBusy(true); setFeedback(""); setCorrect(false);
    const result = await submitModuleQuizAnswer({ moduleId, questionId: question.id, answer: selected });
    setFeedback(result.message); setCorrect(result.ok);
    if (result.ok) setAnsweredIds((ids) => [...ids, question.id]);
    setBusy(false);
  }

  if (!questions.length) return <p className="mt-8 rounded-2xl bg-amber-50 p-5 text-amber-900">This module quiz is not available yet.</p>;
  if (!question) return <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6"><p className="font-bold text-green-900">Quiz complete — all answers correct.</p>{feedback && <p className="mt-2 text-sm leading-6 text-green-900">{feedback}</p>}<p className="mt-2 text-sm leading-6 text-green-900">You can now complete this module and continue.</p></div>;

  return <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-7">
    <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-bold">Quick check</h3><span className="text-sm font-semibold text-[var(--muted)]">Question {answeredIds.length + 1} of {questions.length}</span></div>
    <p className="mt-4 text-lg font-semibold leading-7">{question.prompt}</p>
    <fieldset className="mt-4 space-y-3"><legend className="sr-only">Select one answer</legend>{question.options.map((option) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${selected === option ? "border-[var(--blue)] bg-blue-50" : "border-[var(--line)] bg-white hover:border-[var(--blue)]"}`}><input type="radio" name={`answer-${question.id}`} value={option} checked={selected === option} onChange={() => { setSelected(option); setFeedback(""); setCorrect(false); }} className="mt-1 accent-[var(--blue)]" /><span className="leading-6">{option}</span></label>)}</fieldset>
    {feedback && <p role="status" className={`mt-4 rounded-xl p-4 text-sm leading-6 ${correct ? "bg-green-100 text-green-900" : "bg-amber-50 text-amber-950"}`}>{feedback}</p>}
    {correct && <button onClick={() => { setFeedback(""); setCorrect(false); setSelected(""); setDisplayIndex((index) => index + 1); }} className="mt-4 rounded-full border border-[var(--blue)] px-5 py-3 font-semibold text-[var(--blue)]">{answeredIds.length === questions.length ? "Finish quiz" : "Next question →"}</button>}
    {!correct && <button onClick={submitAnswer} disabled={!selected || busy} className="mt-5 rounded-full bg-[var(--blue)] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Checking…" : "Check answer"}</button>}
  </section>;
}
