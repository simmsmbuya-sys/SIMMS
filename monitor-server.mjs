import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 3456;
const ROOT = '/home/user/SIMMS';

function countFiles(dir, opts = {}) {
  let count = 0;
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) count += countFiles(full, opts);
      else if (!opts.ext || full.endsWith(opts.ext)) count++;
    }
  } catch {}
  return count;
}

function countDirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')).length;
  } catch { return 0; }
}

function git(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', timeout: 5000 }).trim(); } catch { return ''; }
}

function getStats() {
  const skillsDir = join(ROOT, 'skills');
  const totalFiles = countFiles(skillsDir);
  const skillFolders = countDirs(skillsDir);
  const mdFiles = countFiles(skillsDir, { ext: '.md' });
  const pyFiles = countFiles(skillsDir, { ext: '.py' });
  const xsdFiles = countFiles(skillsDir, { ext: '.xsd' });

  // Count SKILL.md files
  let skillMdCount = 0;
  function findSkillMd(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.name === 'SKILL.md') skillMdCount++;
        if (e.isDirectory() && !e.name.startsWith('.')) findSkillMd(join(dir, e.name));
      }
    } catch {}
  }
  findSkillMd(skillsDir);

  // Git info
  const branch = git('git rev-parse --abbrev-ref HEAD');
  const log = git('git log --oneline -15');
  const status = git('git status --short');
  const lastCommit = git('git log -1 --format="%h %s (%ar)"');

  // Subagent counts
  const subagentCats = [];
  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0');
    const dirs = readdirSync(skillsDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && e.name.startsWith(num));
    for (const d of dirs) {
      try {
        const skills = readdirSync(join(skillsDir, d.name))
          .filter(f => f.endsWith('.md') && f !== 'README.md').length;
        subagentCats.push({ name: d.name, count: skills });
      } catch {}
    }
  }

  // Disk usage
  let diskUsage = '';
  try { diskUsage = execSync(`du -sh ${skillsDir}`, { encoding: 'utf-8', timeout: 5000 }).split('\t')[0]; } catch {}

  return {
    totalFiles, skillFolders, mdFiles, pyFiles, xsdFiles, skillMdCount,
    branch, log, status, lastCommit, subagentCats, diskUsage,
    timestamp: new Date().toISOString(),
  };
}

function renderHTML(stats) {
  const logRows = stats.log.split('\n').filter(Boolean).map(line => {
    const [hash, ...rest] = line.split(' ');
    return `<tr><td class="hash">${hash}</td><td>${rest.join(' ')}</td></tr>`;
  }).join('');

  const statusLines = stats.status
    ? stats.status.split('\n').map(l => `<div class="status-line">${l}</div>`).join('')
    : '<div class="status-ok">Working tree clean</div>';

  const subagentRows = stats.subagentCats.map(c =>
    `<tr><td>${c.name}</td><td><div class="mini-bar"><div class="mini-fill" style="width:${Math.round(c.count/26*100)}%"></div></div></td><td>${c.count}</td></tr>`
  ).join('');

  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<meta http-equiv="refresh" content="5">
<title>SIMMS Live Monitor</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0d1117;color:#c9d1d9;font-family:'SF Mono','Cascadia Code','Fira Code',monospace;font-size:13px}
.wrap{max-width:1600px;margin:0 auto;padding:12px}
header{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #21262d;margin-bottom:12px}
header h1{font-size:16px;color:#58a6ff}
.live{color:#3fb950;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.meta{font-size:11px;color:#8b949e}

.top-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:12px}
.stat{background:#161b22;border:1px solid #21262d;border-radius:6px;padding:12px;text-align:center}
.stat .num{font-size:28px;font-weight:700;color:#58a6ff}
.stat .lbl{font-size:10px;color:#8b949e;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

.panels{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
.panel{background:#161b22;border:1px solid #21262d;border-radius:6px;padding:12px;max-height:400px;overflow-y:auto}
.panel h2{font-size:11px;color:#8b949e;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;position:sticky;top:0;background:#161b22;padding:2px 0}
table{width:100%;border-collapse:collapse}
td,th{padding:4px 6px;text-align:left;border-bottom:1px solid #21262d;font-size:12px}
th{color:#8b949e;font-size:10px;text-transform:uppercase}
.hash{color:#58a6ff;font-family:monospace}

.status-line{padding:2px 0;font-size:12px;color:#f0883e}
.status-ok{color:#3fb950;font-size:12px}

.mini-bar{height:6px;background:#21262d;border-radius:3px;flex:1;overflow:hidden;width:100%}
.mini-fill{height:100%;background:#58a6ff;border-radius:3px}

.bottom-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.source{background:#161b22;border:1px solid #21262d;border-radius:6px;padding:8px;font-size:11px}
.source .name{color:#c9d1d9;font-weight:600;font-size:11px}
.source .repo{color:#8b949e;font-size:9px;word-break:break-all}
.source .cnt{color:#58a6ff;font-weight:700;font-size:16px;margin:4px 0}

.tag{display:inline-block;padding:1px 6px;border-radius:3px;font-size:10px;margin:1px}
.t-blue{background:#0d419d;color:#79c0ff}
.t-green{background:#0f5323;color:#56d364}
.t-purple{background:#3b1f6e;color:#bc8cff}
.t-orange{background:#5a2d0c;color:#f0883e}

.file-bars{margin-top:4px}
.file-bar{display:flex;align-items:center;gap:6px;padding:2px 0}
.file-bar .type{width:50px;text-align:right;color:#8b949e;font-size:11px}
.file-bar .bar{flex:1;height:10px;background:#21262d;border-radius:3px;overflow:hidden}
.file-bar .fill{height:100%;border-radius:3px}
.file-bar .val{width:40px;font-size:11px;color:#8b949e}
</style>
</head><body>
<div class="wrap">
<header>
  <h1>SIMMS LIVE MONITOR <span class="live">●</span></h1>
  <div class="meta">
    branch: <strong>${stats.branch}</strong> &nbsp;|&nbsp;
    disk: ${stats.diskUsage} &nbsp;|&nbsp;
    auto-refresh: 5s &nbsp;|&nbsp;
    ${stats.timestamp.slice(0,19).replace('T',' ')}
  </div>
</header>

<div class="top-grid">
  <div class="stat"><div class="num">${stats.totalFiles.toLocaleString()}</div><div class="lbl">Total Files</div></div>
  <div class="stat"><div class="num">${stats.skillMdCount}</div><div class="lbl">Skills Defined</div></div>
  <div class="stat"><div class="num">${stats.skillFolders}</div><div class="lbl">Skill Folders</div></div>
  <div class="stat"><div class="num">7</div><div class="lbl">Repos Installed</div></div>
  <div class="stat"><div class="num">${stats.mdFiles}</div><div class="lbl">Markdown Files</div></div>
  <div class="stat"><div class="num">${stats.pyFiles + stats.xsdFiles}</div><div class="lbl">Code/Schema</div></div>
</div>

<div class="panels">
  <div class="panel">
    <h2>Git Log (live)</h2>
    <table>${logRows}</table>
  </div>
  <div class="panel">
    <h2>Working Tree Status</h2>
    ${statusLines}
    <h2 style="margin-top:12px">Last Commit</h2>
    <div style="color:#c9d1d9;font-size:12px;padding:4px 0">${stats.lastCommit}</div>
    <h2 style="margin-top:12px">File Types</h2>
    <div class="file-bars">
      <div class="file-bar"><span class="type">.md</span><div class="bar"><div class="fill" style="width:${Math.round(stats.mdFiles/stats.totalFiles*100)}%;background:#58a6ff"></div></div><span class="val">${stats.mdFiles}</span></div>
      <div class="file-bar"><span class="type">.py</span><div class="bar"><div class="fill" style="width:${Math.round(stats.pyFiles/stats.totalFiles*100)}%;background:#3572A5"></div></div><span class="val">${stats.pyFiles}</span></div>
      <div class="file-bar"><span class="type">.xsd</span><div class="bar"><div class="fill" style="width:${Math.round(stats.xsdFiles/stats.totalFiles*100)}%;background:#f0883e"></div></div><span class="val">${stats.xsdFiles}</span></div>
    </div>
  </div>
  <div class="panel">
    <h2>Subagent Categories</h2>
    <table>
      <tr><th>Category</th><th>Distribution</th><th>#</th></tr>
      ${subagentRows}
    </table>
  </div>
</div>

<div class="bottom-grid">
  <div class="source"><div class="name">Remotion</div><div class="repo">remotion-dev/skills</div><div class="cnt">40+</div><span class="tag t-purple">video</span></div>
  <div class="source"><div class="name">Marketing</div><div class="repo">coreyhaines31/marketingskills</div><div class="cnt">31</div><span class="tag t-orange">marketing</span></div>
  <div class="source"><div class="name">BFCM</div><div class="repo">coreyhaines31/BFCM</div><div class="cnt">1</div><span class="tag t-green">deals</span></div>
  <div class="source"><div class="name">Claude Skills</div><div class="repo">alirezarezvani/claude-skills</div><div class="cnt">65+</div><span class="tag t-green">engineering</span></div>
  <div class="source"><div class="name">Anthropic</div><div class="repo">anthropics/skills</div><div class="cnt">17</div><span class="tag t-blue">official</span></div>
  <div class="source"><div class="name">Visual Media</div><div class="repo">miles990/claude-domain-skills</div><div class="cnt">1</div><span class="tag t-purple">media</span></div>
  <div class="source"><div class="name">Subagents</div><div class="repo">VoltAgent/subagents</div><div class="cnt">131</div><span class="tag t-blue">agents</span></div>
</div>
</div>
</body></html>`;
}

const server = createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    const stats = getStats();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderHTML(stats));
  } else if (req.url === '/api/stats') {
    const stats = getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  SIMMS Live Monitor running at:`);
  console.log(`  → http://localhost:${PORT}`);
  console.log(`  → Auto-refreshes every 5 seconds`);
  console.log(`  → API: http://localhost:${PORT}/api/stats\n`);
});
