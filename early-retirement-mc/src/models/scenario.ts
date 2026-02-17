export type PersonInputs = {
  name: string;
  currentAge: number;
  retireAge: number;

  // Social Security / pension (in today's dollars)
  benefitStartAge: number;
  annualBenefit: number;
};

export type HouseholdInputs = {
  scenarioName: string;

  // Portfolio in today's dollars
  portfolio: number;

  // Annual household spending in today's dollars (real spending)
  annualSpending: number;

  // Annual contribution while working (real)
  annualContribution: number;

  // Market assumptions (REAL returns; inflation handled by using real dollars)
  stockRealMean: number; // e.g. 0.055
  stockVol: number;      // e.g. 0.17
  bondRealMean: number;  // e.g. 0.02
  bondVol: number;       // e.g. 0.06
  stockBondCorr: number; // e.g. 0.15

  stockWeight: number;   // 0..1 (bond weight = 1 - stockWeight)

  // Simulation
  years: number;         // horizon length
  runs: number;          // number of Monte Carlo trials
  seed: number;          // deterministic runs (nice for comparing scenarios)
};

export type Scenario = {
  id: string;
  createdAtISO: string;
  updatedAtISO: string;
  household: HouseholdInputs;
  personA: PersonInputs;
  personB: PersonInputs;
};

export const defaultScenario = (): Scenario => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAtISO: now,
    updatedAtISO: now,
    household: {
      scenarioName: "Base case",
      portfolio: 800000,
      annualSpending: 65000,
      annualContribution: 24000,

      stockRealMean: 0.055,
      stockVol: 0.17,
      bondRealMean: 0.02,
      bondVol: 0.06,
      stockBondCorr: 0.15,

      stockWeight: 0.70,

      years: 45,
      runs: 5000,
      seed: 42
    },
    personA: {
      name: "You",
      currentAge: 40,
      retireAge: 55,
      benefitStartAge: 67,
      annualBenefit: 28000
    },
    personB: {
      name: "Wife",
      currentAge: 38,
      retireAge: 55,
      benefitStartAge: 67,
      annualBenefit: 22000
    }
  };
};
