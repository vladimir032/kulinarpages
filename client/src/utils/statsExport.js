import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export function exportStatsJSON(stats) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
  triggerDownload(dataStr, 'statistics.json');
}

export function exportStatsTXT(stats) {
  let txt = '';
  for (const key in stats) {
    txt += `=== ${key.toUpperCase()} ===\n`;
    txt += Array.isArray(stats[key])
      ? stats[key].map(item => JSON.stringify(item)).join('\n')
      : JSON.stringify(stats[key], null, 2);
    txt += '\n\n';
  }
  const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txt);
  triggerDownload(dataStr, 'statistics.txt');
}

export function exportStatsXLSX(stats) {
  const wb = XLSX.utils.book_new();
  Object.entries(stats).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object') {
      const ws = XLSX.utils.json_to_sheet(arr);
      XLSX.utils.book_append_sheet(wb, ws, key);
    }
  });
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'statistics.xlsx');
}

export async function exportStatsDOCX(stats) {
  const doc = new Document();
  Object.entries(stats).forEach(([key, arr]) => {
    doc.addSection({
      children: [
        new Paragraph({
          children: [new TextRun({ text: key.toUpperCase(), bold: true })],
        }),
        ...(Array.isArray(arr)
          ? arr.map(item => new Paragraph(JSON.stringify(item)))
          : [new Paragraph(JSON.stringify(arr, null, 2))]),
        new Paragraph(''),
      ],
    });
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'statistics.docx');
}

export function exportStatsSQL(stats) {
  let sql = '';
  Object.entries(stats).forEach(([key, arr]) => {
    if (Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object') {
      const fields = Object.keys(arr[0]);
      arr.forEach(obj => {
        const values = fields.map(f => {
          const v = obj[f];
          if (v === null || v === undefined) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
          return v;
        });
        sql += `INSERT INTO ${key} (${fields.join(', ')}) VALUES (${values.join(', ')});\n`;
      });
    }
  });
  const dataStr = "data:application/sql;charset=utf-8," + encodeURIComponent(sql);
  triggerDownload(dataStr, 'statistics.sql');
}

function triggerDownload(dataStr, filename) {
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  dlAnchorElem.setAttribute('download', filename);
  document.body.appendChild(dlAnchorElem);
  dlAnchorElem.click();
  dlAnchorElem.remove();
}
