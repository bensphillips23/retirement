import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import { SimResults } from "../engine/simulate";

function fmtMoney(x: number) {
  if (!Number.isFinite(x)) return "";
  return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmtPct(x: number) {
  return `${(x * 100).toFixed(1)}%`;
}

export default function ResultsCharts({ results }: { results: SimResults | null }) {
  if (!results) {
    return (
      <div className="card">
        <div style={{ fontSize: 14, color: "#444" }}>
          Run a simulation to see results.
        </div>
      </div>
    );
  }

  const endingSorted = results.endingBalances.slice().sort((a, b) => a - b);
  const p10 = endingSorted[Math.floor(0.10 * (endingSorted.length - 1))] ?? 0;
  const p50 = endingSorted[Math.floor(0.50 * (endingSorted.length - 1))] ?? 0;
  const p90 = endingSorted[Math.floor(0.90 * (endingSorted.length - 1))] ?? 0;

  const bins = 18;
  const maxVal = endingSorted[endingSorted.length - 1] ?? 0;
  const binSize = maxVal <= 0 ? 1 : maxVal / bins;

  const hist = Array.from({ length: bins }, (_, i) => ({
    bin: i,
    label: `$${fmtMoney(i * binSize)}–$${fmtMoney((i + 1) * binSize)}`,
    count: 0
  }));

  for (const v of results.endingBalances) {
    const idx = binSize <= 0 ? 0 : Math.min(bins - 1, Math.floor(v / binSize));
    hist[idx].count += 1;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div>
            <div className="small">Success rate</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{fmtPct(results.successRate)}</div>
          </div>
          <div>
            <div className="small">Ending balance p10 / p50 / p90</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              ${fmtMoney(p10)} / ${fmtMoney(p50)} / ${fmtMoney(p90)}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Portfolio paths (p10 / p50 / p90)</div>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={results.pathPercentiles}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `$${fmtMoney(v)}`} width={90} />
              <Tooltip formatter={(v: any) => `$${fmtMoney(Number(v))}`} />
              <Line type="monotone" dataKey="p10" dot={false} />
              <Line type="monotone" dataKey="p50" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="p90" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Ending balance distribution</div>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={hist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" tickFormatter={(v) => String(Number(v) + 1)} />
              <YAxis />
              <Tooltip
                labelFormatter={(idx) => hist[Number(idx)]?.label ?? ""}
                formatter={(v: any) => [v, "Runs"]}
              />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="small">Bins are evenly spaced from $0 to max ending balance.</div>
      </div>
    </div>
  );
}
