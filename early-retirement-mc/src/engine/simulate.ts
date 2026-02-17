import { Scenario } from "../models/scenario";
import { mulberry32, randn } from "./random";

export type SimPoint = { year: number; p10: number; p50: number; p90: number };

export type SimResults = {
  successRate: number;
  endingBalances: number[];
  failureYearCounts: number[];
  pathPercentiles: SimPoint[];
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function quantile(sortedAsc: number[], q: number): number {
  if (sortedAsc.length === 0) return 0;
  const pos = (sortedAsc.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sortedAsc[Math.min(base + 1, sortedAsc.length - 1)];
  return sortedAsc[base] + rest * (next - sortedAsc[base]);
}

function corrNormals(z1: number, z2: number, corr: number) {
  const c = clamp01((corr + 1) / 2) * 2 - 1;
  const s = Math.sqrt(Math.max(0, 1 - c * c));
  return c * z1 + s * z2;
}

export function runSimulation(scenario: Scenario): SimResults {
  const { household, personA, personB } = scenario;

  const years = Math.max(1, Math.floor(household.years));
  const runs = Math.max(100, Math.floor(household.runs));
  const seed = Math.floor(household.seed);

  const rng = mulberry32(seed);

  const stockW = clamp01(household.stockWeight);
  const bondW = 1 - stockW;

  const pathsByYear: number[][] = Array.from({ length: years + 1 }, () => []);
  const endingBalances: number[] = [];
  const failureYearCounts: number[] = Array.from({ length: years }, () => 0);

  let successCount = 0;

  for (let i = 0; i < runs; i++) {
    let P = household.portfolio;
    let failed = false;

    pathsByYear[0].push(P);

    for (let y = 1; y <= years; y++) {
      const ageA = personA.currentAge + (y - 1);
      const ageB = personB.currentAge + (y - 1);

      const workingA = ageA < personA.retireAge;
      const workingB = ageB < personB.retireAge;
      const anyoneWorking = workingA || workingB;

      const benefitA = ageA >= personA.benefitStartAge ? personA.annualBenefit : 0;
      const benefitB = ageB >= personB.benefitStartAge ? personB.annualBenefit : 0;
      const income = benefitA + benefitB;

      const contrib = anyoneWorking ? household.annualContribution : 0;

      P = P + contrib - household.annualSpending + income;

      if (P <= 0) {
        failed = true;
        failureYearCounts[y - 1] += 1;
        P = 0;
        pathsByYear[y].push(P);
        for (let yy = y + 1; yy <= years; yy++) pathsByYear[yy].push(0);
        break;
      }

      const z1 = randn(rng);
      const z2 = randn(rng);
      const zb = corrNormals(z1, z2, household.stockBondCorr);

      const rStock = household.stockRealMean + household.stockVol * z1;
      const rBond = household.bondRealMean + household.bondVol * zb;

      const r = stockW * rStock + bondW * rBond;

      P = P * (1 + r);

      if (P <= 0) {
        failed = true;
        failureYearCounts[y - 1] += 1;
        P = 0;
        pathsByYear[y].push(P);
        for (let yy = y + 1; yy <= years; yy++) pathsByYear[yy].push(0);
        break;
      }

      pathsByYear[y].push(P);
    }

    endingBalances.push(P);
    if (!failed) successCount += 1;
  }

  const pathPercentiles: SimPoint[] = [];
  for (let y = 0; y <= years; y++) {
    const arr = pathsByYear[y].slice().sort((a, b) => a - b);
    pathPercentiles.push({
      year: y,
      p10: quantile(arr, 0.10),
      p50: quantile(arr, 0.50),
      p90: quantile(arr, 0.90)
    });
  }

  return {
    successRate: successCount / runs,
    endingBalances,
    failureYearCounts,
    pathPercentiles
  };
}
