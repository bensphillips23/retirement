import React from "react";
import ScenarioList from "./ui/ScenarioList";
import ScenarioEditor from "./ui/ScenarioEditor";
import ResultsCharts from "./ui/ResultsCharts";
import { Scenario } from "./models/scenario";
import { loadActiveScenarioId, loadScenarios, saveActiveScenarioId, saveScenarios } from "./storage";
import { runSimulation } from "./engine/simulate";

export default function App() {
  const [scenarios, setScenarios] = React.useState<Scenario[]>(() => loadScenarios());
  const [activeId, setActiveId] = React.useState<string>(() => loadActiveScenarioId(loadScenarios()));
  const [results, setResults] = React.useState<ReturnType<typeof runSimulation> | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);

  const activeScenario = React.useMemo(
    () => scenarios.find(s => s.id === activeId) ?? scenarios[0],
    [scenarios, activeId]
  );

  React.useEffect(() => {
    saveScenarios(scenarios);
  }, [scenarios]);

  React.useEffect(() => {
    if (activeId) saveActiveScenarioId(activeId);
  }, [activeId]);

  function updateScenario(updated: Scenario) {
    setScenarios(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  }

  function run() {
    if (!activeScenario) return;
    setIsRunning(true);
    setTimeout(() => {
      try {
        const r = runSimulation(activeScenario);
        setResults(r);
      } finally {
        setIsRunning(false);
      }
    }, 30);
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>Early Retirement Monte Carlo</div>
          <div className="small">Two-person household • Multiple scenarios • Runs in-browser</div>
        </div>
        <div className="btnRow">
          <button className="primary" onClick={run} disabled={isRunning}>
            {isRunning ? "Running…" : "Run Simulation"}
          </button>
        </div>
      </div>

      <div className="grid">
        <div style={{ display: "grid", gap: 16 }}>
          <ScenarioList
            scenarios={scenarios}
            activeId={activeId}
            onSetActive={setActiveId}
            onChange={(next) => setScenarios(next)}
          />
          {activeScenario && (
            <ScenarioEditor scenario={activeScenario} onUpdate={updateScenario} />
          )}
        </div>

        <ResultsCharts results={results} />
      </div>
    </div>
  );
}
