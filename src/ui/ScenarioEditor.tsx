import React from "react";
import { Scenario } from "../models/scenario";

type Props = {
  scenario: Scenario;
  onUpdate: (scenario: Scenario) => void;
};

type Tab = "Household" | "You" | "Wife" | "Assumptions";

function num(x: string) {
  const v = Number(x);
  return Number.isFinite(v) ? v : 0;
}

export default function ScenarioEditor({ scenario, onUpdate }: Props) {
  const [tab, setTab] = React.useState<Tab>("Household");

  function patch(update: (s: Scenario) => void) {
    const next = structuredClone(scenario);
    update(next);
    next.updatedAtISO = new Date().toISOString();
    onUpdate(next);
  }

  const { household, personA, personB } = scenario;

  return (
    <div className="card">
      <div className="tabs">
        {(["Household","You","Wife","Assumptions"] as Tab[]).map(t => (
          <button
            key={t}
            className={`tabBtn ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Household" && (
        <>
          <div className="row">
            <label>Scenario name</label>
            <input
              type="text"
              value={household.scenarioName}
              onChange={(e) => patch(s => { s.household.scenarioName = e.target.value; })}
            />
          </div>

          <div className="row">
            <label>Current portfolio ($)</label>
            <input
              type="number"
              value={household.portfolio}
              onChange={(e) => patch(s => { s.household.portfolio = num(e.target.value); })}
            />
          </div>

          <div className="row">
            <label>Annual spending (today’s $)</label>
            <input
              type="number"
              value={household.annualSpending}
              onChange={(e) => patch(s => { s.household.annualSpending = num(e.target.value); })}
            />
          </div>

          <div className="row">
            <label>Annual contribution while working</label>
            <input
              type="number"
              value={household.annualContribution}
              onChange={(e) => patch(s => { s.household.annualContribution = num(e.target.value); })}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small" style={{ marginBottom: 6 }}>
              Stock allocation ({Math.round(household.stockWeight * 100)}% stocks / {Math.round((1 - household.stockWeight) * 100)}% bonds)
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(household.stockWeight * 100)}
              onChange={(e) => patch(s => { s.household.stockWeight = num(e.target.value) / 100; })}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small" style={{ marginBottom: 6 }}>
              Quick sliders
            </div>
            <div className="row">
              <label>Spending slider</label>
              <input
                type="range"
                min={20000}
                max={200000}
                step={1000}
                value={household.annualSpending}
                onChange={(e) => patch(s => { s.household.annualSpending = num(e.target.value); })}
              />
            </div>
            <div className="row">
              <label>Contribution slider</label>
              <input
                type="range"
                min={0}
                max={100000}
                step={1000}
                value={household.annualContribution}
                onChange={(e) => patch(s => { s.household.annualContribution = num(e.target.value); })}
              />
            </div>
          </div>
        </>
      )}

      {tab === "You" && (
        <>
          <div className="row">
            <label>Name</label>
            <input type="text" value={personA.name}
              onChange={(e) => patch(s => { s.personA.name = e.target.value; })} />
          </div>
          <div className="row">
            <label>Current age</label>
            <input type="number" value={personA.currentAge}
              onChange={(e) => patch(s => { s.personA.currentAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Retirement age</label>
            <input type="number" value={personA.retireAge}
              onChange={(e) => patch(s => { s.personA.retireAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Benefit start age (SS/pension)</label>
            <input type="number" value={personA.benefitStartAge}
              onChange={(e) => patch(s => { s.personA.benefitStartAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Annual benefit (today’s $)</label>
            <input type="number" value={personA.annualBenefit}
              onChange={(e) => patch(s => { s.personA.annualBenefit = num(e.target.value); })} />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small" style={{ marginBottom: 6 }}>Retirement age slider</div>
            <input
              type="range"
              min={35}
              max={80}
              value={personA.retireAge}
              onChange={(e) => patch(s => { s.personA.retireAge = num(e.target.value); })}
            />
          </div>
        </>
      )}

      {tab === "Wife" && (
        <>
          <div className="row">
            <label>Name</label>
            <input type="text" value={personB.name}
              onChange={(e) => patch(s => { s.personB.name = e.target.value; })} />
          </div>
          <div className="row">
            <label>Current age</label>
            <input type="number" value={personB.currentAge}
              onChange={(e) => patch(s => { s.personB.currentAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Retirement age</label>
            <input type="number" value={personB.retireAge}
              onChange={(e) => patch(s => { s.personB.retireAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Benefit start age (SS/pension)</label>
            <input type="number" value={personB.benefitStartAge}
              onChange={(e) => patch(s => { s.personB.benefitStartAge = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Annual benefit (today’s $)</label>
            <input type="number" value={personB.annualBenefit}
              onChange={(e) => patch(s => { s.personB.annualBenefit = num(e.target.value); })} />
          </div>

          <div style={{ marginTop: 10 }}>
            <div className="small" style={{ marginBottom: 6 }}>Retirement age slider</div>
            <input
              type="range"
              min={35}
              max={80}
              value={personB.retireAge}
              onChange={(e) => patch(s => { s.personB.retireAge = num(e.target.value); })}
            />
          </div>
        </>
      )}

      {tab === "Assumptions" && (
        <>
          <div className="row">
            <label>Horizon (years)</label>
            <input type="number" value={household.years}
              onChange={(e) => patch(s => { s.household.years = Math.max(1, Math.floor(num(e.target.value))); })} />
          </div>

          <div className="row">
            <label>Runs</label>
            <input type="number" value={household.runs}
              onChange={(e) => patch(s => { s.household.runs = Math.max(100, Math.floor(num(e.target.value))); })} />
          </div>

          <div className="row">
            <label>Seed</label>
            <input type="number" value={household.seed}
              onChange={(e) => patch(s => { s.household.seed = Math.floor(num(e.target.value)); })} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />

          <div className="row">
            <label>Stock real return (mean)</label>
            <input type="number" step="0.001" value={household.stockRealMean}
              onChange={(e) => patch(s => { s.household.stockRealMean = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Stock volatility</label>
            <input type="number" step="0.001" value={household.stockVol}
              onChange={(e) => patch(s => { s.household.stockVol = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Bond real return (mean)</label>
            <input type="number" step="0.001" value={household.bondRealMean}
              onChange={(e) => patch(s => { s.household.bondRealMean = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Bond volatility</label>
            <input type="number" step="0.001" value={household.bondVol}
              onChange={(e) => patch(s => { s.household.bondVol = num(e.target.value); })} />
          </div>
          <div className="row">
            <label>Stock/Bond correlation</label>
            <input type="number" step="0.01" value={household.stockBondCorr}
              onChange={(e) => patch(s => { s.household.stockBondCorr = num(e.target.value); })} />
          </div>

          <div className="small" style={{ marginTop: 8 }}>
            These are <b>real</b> (inflation-adjusted) return assumptions. Spending & benefits are in today’s dollars.
          </div>
        </>
      )}
    </div>
  );
}
