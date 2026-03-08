# SIMMS Project Monitor

> **Last updated:** 2026-03-08 &nbsp;|&nbsp; **Branch:** `claude/install-skills-folder-68Xez` &nbsp;|&nbsp; **Total files:** 1,764

---

## Project Overview

```
SIMMS/
├── skills/          76 folders · 1,764 files · 222 SKILL.md definitions
├── todo-cli/        CLI tool · 6 TypeScript modules
└── tools/           60+ marketing platform integrations
```

---

## Skills Inventory

### Sources (7 repositories installed)

| # | Repository | Items | Status |
|---|-----------|-------|--------|
| 1 | `remotion-dev/skills` | 40+ Remotion rules | Installed |
| 2 | `coreyhaines31/marketingskills` | 31 marketing skills | Installed |
| 3 | `coreyhaines31/Awesome-Black-Friday-Cyber-Monday` | BFCM deals resource | Installed |
| 4 | `alirezarezvani/claude-skills` | 25 engineering + 40 business skills | Installed |
| 5 | `anthropics/skills` | 17 official Anthropic skills | Installed |
| 6 | `miles990/claude-domain-skills` | 1 visual-media skill | Installed |
| 7 | `VoltAgent/awesome-claude-code-subagents` | 131 subagent skills | Installed |

---

### Subagent Skills (131 total)

| Category | Count | Highlights |
|----------|------:|-----------|
| `01-core-development` | 10 | fullstack, frontend, backend, API, mobile, GraphQL |
| `02-language-specialists` | 26 | Python, TS, Rust, Go, Java, C++, React, Next.js, Rails |
| `03-infrastructure` | 16 | DevOps, Docker, K8s, Terraform, SRE, cloud, security |
| `04-quality-security` | 14 | code review, testing, pentesting, chaos engineering |
| `05-data-ai` | 12 | ML, data science, NLP, LLM, MLOps, Postgres |
| `06-developer-experience` | 13 | CLI, refactoring, docs, Git, MCP, legacy modernization |
| `07-specialized-domains` | 12 | blockchain, IoT, fintech, game dev, payments |
| `08-business-product` | 11 | PM, scrum, UX research, tech writing, sales |
| `09-meta-orchestration` | 10 | multi-agent coordination, workflows, task distribution |
| `10-research-analysis` | 7 | market research, competitive analysis, trends |

---

### Official Anthropic Skills (17)

| Skill | Files | Description |
|-------|------:|-------------|
| `canvas-design` | 83 | Canvas-based design with bundled fonts |
| `docx` | 61 | Word document creation with XML schemas |
| `pptx` | 59 | PowerPoint creation and editing |
| `xlsx` | 54 | Excel spreadsheet operations |
| `claude-api` | 26 | API reference (Python, TS, Go, Java, PHP, Ruby, C#) |
| `skill-creator` | 18 | Build and evaluate new skills |
| `theme-factory` | 13 | Design theme generation (10 themes) |
| `pdf` | 12 | PDF manipulation and form filling |
| `mcp-builder` | 10 | MCP server builder (Python & Node) |
| `slack-gif-creator` | 7 | Animated GIF creation |
| `internal-comms` | 6 | Internal communications templates |
| `webapp-testing` | 6 | Web app testing with Playwright |
| `web-artifacts-builder` | 5 | Web artifact bundling |
| `algorithmic-art` | 4 | Generative art with JS templates |
| `brand-guidelines` | 2 | Brand consistency guidance |
| `frontend-design` | 2 | Frontend design patterns |
| `doc-coauthoring` | 1 | Document co-authoring |

---

### Marketing Skills (31)

```
ab-test-setup        ad-creative          ai-seo
analytics-tracking   churn-prevention     cold-email
competitor-alternatives                   content-strategy
copy-editing         copywriting          email-sequence
form-cro             free-tool-strategy   launch-strategy
marketing-ideas      marketing-psychology onboarding-cro
page-cro             paid-ads             paywall-upgrade-cro
popup-cro            pricing-strategy     product-marketing-context
programmatic-seo     referral-program     revops
sales-enablement     schema-markup        seo-audit
signup-flow-cro      site-architecture    social-content
```

---

### Engineering & Business Skills (65+)

| Collection | Count | Source |
|-----------|------:|--------|
| Engineering skills | 25 | `alirezarezvani/claude-skills` |
| Business growth | 5+ | `alirezarezvani/claude-skills` |
| Product team | 3+ | `alirezarezvani/claude-skills` |
| Finance | 3+ | `alirezarezvani/claude-skills` |
| Documentation | 2+ | `alirezarezvani/claude-skills` |
| Agents | 3 | `alirezarezvani/claude-skills` |
| Remotion video | 40+ | `remotion-dev/skills` |
| Visual media | 1 | `miles990/claude-domain-skills` |

---

## TODO Tracker CLI

```
todo-cli/
├── src/
│   ├── cli.ts          Entry point · 5 commands
│   ├── scanner.ts      File discovery & TODO extraction
│   ├── formatter.ts    Output formatting (pretty/compact/json/count)
│   ├── git.ts          Git blame & diff operations
│   ├── config.ts       Config loading (.todo-tracker.json)
│   ├── types.ts        Core interfaces
│   └── example.ts      Example TODO comments
├── package.json        ESM · chalk · commander · fast-glob · ignore
└── tsconfig.json
```

**Commands:** `list` · `stats` · `check` · `diff` · `init`
**Features:** multi-line TODOs · git blame · expiration dates · CI enforcement · assignees

---

## File Breakdown

| Type | Count |
|------|------:|
| Markdown (`.md`) | 996 |
| Python (`.py`) | 297 |
| XML Schema (`.xsd`) | 117 |
| TypeScript (`.ts`/`.js`) | 8 |
| Fonts, images, binaries | 100+ |
| Other (configs, shell, XML) | 246 |
| **Total** | **1,764** |

---

## Git History (recent)

| Commit | Message |
|--------|---------|
| `08b0fab` | Add awesome-claude-code-subagents collection (131 subagent skills) |
| `a013b32` | Add visual-media skill from miles990/claude-domain-skills |
| `f5c7eae` | Add official Anthropic skills collection (17 skills) |
| `b34a686` | Add claude-skills collection from alirezarezvani/claude-skills |
| `1d8624f` | Add Awesome Black Friday/Cyber Monday deals resource |
| `ed4570e` | Clean up import ordering in scanner.ts |
| `a064973` | Apply full scanner refactor with multi-line continuation support |
| `06fea9b` | Add marketing skills from coreyhaines31/marketingskills |
| `1e0dc12` | Refactor todo-cli modules for quality and performance |
| `50a7b97` | Add TODO tracker CLI tool |

---

## Quick Actions

- **Add a skill:** `npx skillfish add <owner>/<repo> <skill-name>`
- **Scan TODOs:** `cd todo-cli && npx tsx src/cli.ts list`
- **Check policies:** `cd todo-cli && npx tsx src/cli.ts check --max 50`
- **Init config:** `cd todo-cli && npx tsx src/cli.ts init`

---

*Open this file in VS Code and press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) for the preview pane.*
