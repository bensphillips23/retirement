import { Scenario, defaultScenario } from "./models/scenario";

const KEY = "ermc_scenarios_v1";
const ACTIVE_KEY = "ermc_active_scenario_id_v1";

export function loadScenarios(): Scenario[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [defaultScenario()];
    const parsed = JSON.parse(raw) as Scenario[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [defaultScenario()];
    return parsed;
  } catch {
    return [defaultScenario()];
  }
}

export function saveScenarios(scenarios: Scenario[]) {
  localStorage.setItem(KEY, JSON.stringify(scenarios));
}

export function loadActiveScenarioId(scenarios: Scenario[]): string {
  const id = localStorage.getItem(ACTIVE_KEY);
  if (id && scenarios.some(s => s.id === id)) return id;
  return scenarios[0]?.id ?? "";
}

export function saveActiveScenarioId(id: string) {
  localStorage.setItem(ACTIVE_KEY, id);
}
