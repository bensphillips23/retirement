# Early Retirement Monte Carlo (Two-Person)

Static, in-browser Monte Carlo retirement simulator (stocks/bonds correlated returns), multi-scenario, GitHub Pages deploy.

## Quick start
```bash
npm install
npm run dev
```

## Deploy to GitHub Pages
1. Edit `vite.config.ts` and set:
   - `const repoBase = "/YOUR_REPO_NAME/";`
2. Push to GitHub (branch `main`)
3. In GitHub: Settings → Pages → Source: **GitHub Actions**

## Notes
- Assumptions are **real** (inflation-adjusted) returns.
- Spending and benefits are expressed in **today's dollars**.
- Scenarios are saved in your browser via LocalStorage.
