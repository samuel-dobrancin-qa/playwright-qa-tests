# 🎭 Playwright QA Test Suite

[![Playwright Tests](https://github.com/samuel-dobrancin-qa/playwright-qa-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/samuel-dobrancin-qa/playwright-qa-tests/actions/workflows/playwright.yml) 

Automated end-to-end test suite for [QA Risk Analyzer](https://qa-risk-analyzer.vercel.app/) — an AI-powered tool that generates risk assessments, test cases, and regression checklists from GitHub, GitLab, Jira, Azure DevOps, and Bitbucket changes.

---

## 📁 Test Structure

| File | Tests | What it covers |
|---|---|---|
| `qa-analyzer.spec.js` | 1 | Full end-to-end demo flow including AI analysis |
| `workflow-switching.spec.js` | 6 | UI behaviour, workflow switching, button states |
| `security.spec.js` | 6 | Transparency panel, secret scrubbing, token detection |
| `negative-testing.spec.js` | 10 | Boundary values, injection attacks, edge cases |

**Total: 23 tests × 3 browsers (Chromium, Firefox, WebKit) = 69 runs per CI trigger**

---

## 🧪 What is tested

### End-to-End Flow
- Demo analysis runs successfully from start to finish
- AI returns risk score, test cases, and regression checklist
- All result tabs are navigable after analysis completes

### UI Behaviour
- All 6 workflow buttons render correctly (GitHub, GitLab, Jira, Azure DevOps, Bitbucket, Plain Text)
- Analyze button is disabled when required fields are empty
- Analyze button enables when context is filled
- Switching workflows updates placeholders and labels correctly

### Security & Privacy
- Transparency panel appears before any data is sent to AI
- Users can cancel and prevent data from being sent
- Secret scrubber detects AWS access keys
- Secret scrubber detects GitHub tokens
- Clean input correctly shows no secrets detected
- "Never sent" section is always visible to users

### Negative & Boundary Testing
- Single character input is handled gracefully
- 10,000 word input does not crash the app
- Numbers-only input is accepted
- Chinese and Arabic characters do not break the form
- Emoji-only input is accepted
- XSS script injection is treated as plain text — never executed
- SQL injection is treated as plain text
- Invalid URL format does not crash the app
- Demo button resets form cleanly when clicked mid-typing

---

## 🚀 Running locally

### Prerequisites
- Node.js 18+
- Playwright installed

### Install dependencies
```bash
npm install
npx playwright install
```

### Run all tests
```bash
npx playwright test
```

### Run a specific file
```bash
npx playwright test tests/security.spec.js
```

### Run in headed mode (see the browser)
```bash
npx playwright test --headed
```

### View HTML report
```bash
npx playwright show-report
```

---

## ⚙️ CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions.

The pipeline:
1. Checks out the code
2. Sets up Node.js 18
3. Installs dependencies
4. Installs all Playwright browsers (Chromium, Firefox, WebKit)
5. Runs the full test suite
6. Uploads the HTML report as a downloadable artifact (retained 30 days)

---

## 🔍 Key testing concepts demonstrated

- **Assertions** — `expect().toBeVisible()`, `toBeEnabled()`, `toBeDisabled()`
- **Strict mode handling** — precise locators to avoid ambiguous element matching
- **Timing** — extended timeouts for AI API calls, waiting for dynamic content
- **Security testing** — XSS and SQL injection verification
- **Boundary value analysis** — minimum, maximum, and invalid inputs
- **Cross-browser testing** — all tests run on Chromium, Firefox, and WebKit
- **CI/CD integration** — automated runs with artifact upload on GitHub Actions

---

## 🛠️ Tech stack

- [Playwright](https://playwright.dev/) — test framework
- [GitHub Actions](https://github.com/features/actions) — CI/CD pipeline
- [QA Risk Analyzer](https://qa-risk-analyzer.vercel.app/) — application under test

---

## 👤 Author

**Samuel Dobrančin** — QA Engineer
[GitHub](https://github.com/samuel-dobrancin-qa) · [LinkedIn](https://linkedin.com/in/samuel-dobrancin-8a203a273)
