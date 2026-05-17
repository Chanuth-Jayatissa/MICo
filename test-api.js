const fs = require('fs');

async function run() {
  const file = fs.readFileSync('Resume Alex 2026.pdf');
  const base64 = file.toString('base64');
  const dataUrl = `data:application/pdf;base64,${base64}`;

  const res = await fetch('http://localhost:3000/api/agents/parse-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText: dataUrl, fileName: 'Resume Alex 2026.pdf' })
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
run();
