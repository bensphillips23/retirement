# Easy Retirement Simulator

Single-file (`index.html`) retirement simulator focused on one clear question:

> Given my current savings, annual contributions, retirement spending, pensions, and retirement age, what is the probability I won't run out of money?

## Features
- No framework, no build tools.
- Inputs for:
  - current age / retirement age
  - current portfolio
  - yearly contributions before retirement
  - retirement spending
  - pensions for you and spouse
  - separate Social Security inputs for you and spouse
  - expected return, volatility, inflation
  - number of simulation runs
- Outputs:
  - probability of success
  - median ending balance
  - 10th / 50th / 90th percentile ending balances
  - portfolio path chart (10th/50th/90th)
  - plain-English summary
  - first-retirement-year cash-flow breakdown

## Run locally
```bash
python3 -m http.server 4173
```
Then open `http://127.0.0.1:4173`.
