import React from "react";
import { Scenario, defaultScenario } from "../models/scenario";

type Props = {
  scenarios: Scenario[];
  activeId: string;
  onSetActive: (id: string) => void;
  onChange: (scenarios: Scenario[]) => void;
};

export default function ScenarioList({ scenarios, activeId, onSetActive, onChange }: Props) {
  const active = scenarios.find(s => s.id === activeId);

  function addScenario() {
    const s = defaultScenario();
    s.household.scenarioName = `Scenario ${scenarios.length + 1}`;
    onChange([s, ...scenarios]);
    onSetActive(s.id);
  }

  function duplicateActive() {
    if (!active) return;
    const now = new Date().toISOString();
    const copy: Scenario = {
      ...structuredClone(active),
      id: crypto.randomUUID(),
      createdAtISO: now,
      updatedAtISO: now,
      household: { ...active.household, scenarioName: `${active.household.scenarioName} (copy)` }
    };
    onChange([copy, ...scenarios]);
    onSetActive(copy.id);
  }

  function deleteActive() {
    if (scenarios.length <= 1) return;
    const idx = scenarios.findIndex(s => s.id === activeId);
    const next = scenarios.filter(s => s.id !== activeId);
    const nextActive = next[Math.max(0, idx - 1)]?.id ?? next[0].id;
    onChange(next);
    onSetActive(nextActive);
  }

  return (
    <div className="card">
      <div style={{ display: "grid", gap: 10 }}>
        <div className="row">
          <label>Scenario</label>
          <select value={activeId} onChange={(e) => onSetActive(e.target.value)}>
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>
                {s.household.scenarioName}
              </option>
            ))}
          </select>
        </div>

        <div className="btnRow">
          <button onClick={addScenario}>New</button>
          <button onClick={duplicateActive}>Duplicate</button>
          <button onClick={deleteActive} disabled={scenarios.length <= 1}>Delete</button>
        </div>

        <div className="small">
          Saved locally in your browser (LocalStorage). Perfect for GitHub Pages.
        </div>
      </div>
    </div>
  );
}
