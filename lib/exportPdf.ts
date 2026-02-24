export function printPdf(rows: any[]) {
  const w = window.open('', '_blank')
  if (!w) return
  const html = `
    <html><head><title>Records</title><style>body{font-family: Arial; background:#0b0f1a; color:#fff; padding:20px} .row{margin-bottom:10px; padding:10px; border-bottom:1px solid #222}</style></head>
    <body>
      <h1>Records</h1>
      ${rows.map(r => `<div class="row"><div>Date: ${new Date(r.createdAt).toLocaleString()}</div><div>Total: ${r.totalKg ?? r.totalEmissionsKg} kg CO2e</div></div>`).join('')}
    </body></html>`
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => { w.print() }, 500)
}
