"use client";

import { useState } from "react";

type Finding = {
  id: string;
  label: string;
};

type TrainingCase = {
  id: number;
  title: string;
  level: string;
  record: string[];
  correctFindings: string[];
  explanations: Record<string, string>;
};

const findings: Finding[] = [
  { id: "allergy", label: "Possible allergy-record conflict" },
  { id: "duplicate", label: "Possible duplicate item" },
  { id: "route", label: "Instruction and form do not match" },
  { id: "quantity", label: "Required information is missing" },
  { id: "identity", label: "Patient identity details do not match" },
];

const cases: TrainingCase[] = [
  {
    id: 1,
    title: "The Mismatched Record",
    level: "Foundation",
    record: [
      "SIMULATED PATIENT: Case 014",
      "Allergy record: Ingredient L",
      "Training order: Sample product containing Ingredient L",
      "Label form: liquid",
      "Instruction: swallow one tablet",
      "Quantity field: blank",
    ],
    correctFindings: ["allergy", "route", "quantity"],
    explanations: {
      allergy:
        "The fictional allergy record and the fictional product ingredient appear to overlap. In practice, a student should flag the discrepancy for instructor review.",
      route:
        "The written instruction says tablet, while the record describes a liquid form. The record needs clarification in this training scenario.",
      quantity:
        "The quantity field is blank. This exercise asks you to notice incomplete documentation.",
    },
  },
  {
    id: 2,
    title: "The Double Entry",
    level: "Intermediate",
    record: [
      "SIMULATED PATIENT: Case 027",
      "Training item A: Sample compound R",
      "Training item B: Sample compound R, listed under a second display name",
      "Both entries are marked active",
      "No note explains why both entries appear",
      "Patient identity: Case 027 on both pages",
    ],
    correctFindings: ["duplicate"],
    explanations: {
      duplicate:
        "The same fictional compound appears twice under different display names, and both entries are marked active. The exercise is to notice the possible duplicate and request review.",
    },
  },
  {
    id: 3,
    title: "The Identity Check",
    level: "Challenge",
    record: [
      "SIMULATED PATIENT: Case 038",
      "Page one identifier: Case 038",
      "Page two identifier: Case 083",
      "Training item: Sample compound N",
      "All other fields are complete",
      "No identity correction is documented",
    ],
    correctFindings: ["identity"],
    explanations: {
      identity:
        "The two pages show different case identifiers. This training record should be paused and checked by an instructor before proceeding.",
    },
  },
];

export default function Home() {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(0);

  const currentCase = cases[caseIndex];
  const correctCount = selected.filter((id) =>
    currentCase.correctFindings.includes(id),
  ).length;
  const missedFindings = currentCase.correctFindings.filter(
    (id) => !selected.includes(id),
  );
  const percentage =
    completed === 0 ? 0 : Math.round((score / (completed * 3)) * 100);

  function toggleFinding(id: string) {
    if (submitted) return;
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function submitCase() {
    if (submitted) return;
    setScore((value) => value + correctCount);
    setCompleted((value) => value + 1);
    setSubmitted(true);
  }

  function changeCase(index: number) {
    setCaseIndex(index);
    setSelected([]);
    setSubmitted(false);
  }

  function resetProgress() {
    setCaseIndex(0);
    setSelected([]);
    setSubmitted(false);
    setScore(0);
    setCompleted(0);
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="ScriptSafe home">
          <span className="brand-mark">S</span>
          <span>ScriptSafe <span className="brand-light">Student Lab</span></span>
        </a>
        <span className="topbar-label">SIMULATION MODE</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PHARMACY LEARNING, MADE ACTIVE</p>
          <h1>Notice the detail.<br /><em>Build the habit.</em></h1>
          <p className="hero-description">
            Practice reviewing fictional records, spot documentation
            mismatches, and learn to explain what needs a closer look.
          </p>
          <a className="primary-link" href="#case-workspace">
            Start a case <span aria-hidden="true">↓</span>
          </a>
        </div>

        <aside className="score-card" aria-label="Learning progress">
          <div className="score-card-top">
            <span className="eyebrow">YOUR PRACTICE</span>
            <span className="score-icon" aria-hidden="true">✳</span>
          </div>
          <p className="score-number">{score}<span> pts</span></p>
          <p className="score-caption">
            {completed} {completed === 1 ? "case" : "cases"} reviewed
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Practice progress"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
          <p className="score-footnote">
            Points reward correct flags. Explanations appear after each review.
          </p>
          <button className="text-button" onClick={resetProgress}>
            Reset practice
          </button>
        </aside>
      </section>

      <section className="workspace" id="case-workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CASE REVIEW WORKSPACE</p>
            <h2>Choose a training case</h2>
          </div>
          <span className="case-count">{cases.length} fictional cases</span>
        </div>

        <nav className="case-tabs" aria-label="Training cases">
          {cases.map((trainingCase, index) => (
            <button
              className={`case-tab ${index === caseIndex ? "active" : ""}`}
              key={trainingCase.id}
              onClick={() => changeCase(index)}
              aria-pressed={index === caseIndex}
            >
              <span className="tab-number">0{trainingCase.id}</span>
              <span>{trainingCase.title}</span>
            </button>
          ))}
        </nav>

        <div className="case-layout">
          <article className="record-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">TRAINING RECORD</p>
                <h3>{currentCase.title}</h3>
              </div>
              <span className="level-badge">{currentCase.level}</span>
            </div>

            <div className="record-sheet">
              <div className="record-sheet-header">
                <span>SIMULATED / NOT A REAL PATIENT</span>
                <span>CASE {String(currentCase.id).padStart(3, "0")}</span>
              </div>
              {currentCase.record.map((line, index) => (
                <p className="record-line" key={`${currentCase.id}-${index}`}>
                  <span className="record-dot" />
                  {line}
                </p>
              ))}
            </div>

            <div className="notice-box">
              <span aria-hidden="true">ⓘ</span>
              <p>
                Review the record and select every item that needs instructor
                review. This is a learning exercise, not a clinical tool.
              </p>
            </div>
          </article>

          <article className="findings-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">YOUR REVIEW</p>
                <h3>What would you flag?</h3>
              </div>
              <span className="selection-count">{selected.length} selected</span>
            </div>

            <div className="finding-list">
              {findings.map((finding) => {
                const checked = selected.includes(finding.id);
                const isCorrect =
                  currentCase.correctFindings.includes(finding.id);
                const showCorrect = submitted && isCorrect;
                const showIncorrect = submitted && checked && !isCorrect;

                return (
                  <div
                    className={`finding-option ${checked ? "checked" : ""} ${
                      showCorrect ? "correct" : ""
                    } ${showIncorrect ? "incorrect" : ""}`}
                    key={finding.id}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFinding(finding.id)}
                        disabled={submitted}
                      />
                      <span className="custom-check" aria-hidden="true">
                        {checked ? "✓" : ""}
                      </span>
                      <span>{finding.label}</span>
                    </label>
                    {submitted && currentCase.explanations[finding.id] && (
                      <p className="explanation">
                        {currentCase.explanations[finding.id]}
                      </p>
                    )}
                    {showIncorrect && (
                      <p className="explanation">
                        This was not one of the intended flags in this case.
                        Read the record again and compare each field.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted ? (
              <button className="submit-button" onClick={submitCase}>
                Check my review <span aria-hidden="true">→</span>
              </button>
            ) : (
              <div className="result-box" role="status">
                <strong>
                  {correctCount} of {currentCase.correctFindings.length} flags
                  found
                </strong>
                {missedFindings.length > 0 ? (
                  <p>
                    Review the highlighted explanations, then try another case.
                  </p>
                ) : (
                  <p>All intended flags found. Nice careful reading.</p>
                )}
              </div>
            )}
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>ScriptSafe Student Lab</p>
        <p>
          Fictional training content only. Not for real prescriptions, patient
          care, or medication decisions.
        </p>
      </footer>
    </main>
  );
}