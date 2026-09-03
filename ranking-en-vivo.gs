/**
 * POLÍMEROS EN JUEGO — ranking en vivo
 * Cátedra de Conocimiento de los Materiales
 *
 * Pegá esto en Extensiones > Apps Script de una planilla vacía,
 * guardá y publicalo como Aplicación web con acceso "Cualquier persona".
 */

const CLAVE = "polimeros2026";   // tiene que ser igual a la de la app
const HOJA  = "resultados";

function hoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let sh = libro.getSheetByName(HOJA);
  if (!sh) {
    sh = libro.insertSheet(HOJA);
    sh.appendRow(["fecha", "nombre", "modo", "aciertos", "total", "puntos", "tiempo_s"]);
  }
  return sh;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.token !== CLAVE) return json({ ok: false, err: "clave incorrecta" });
    const nombre = String(d.nombre || "").trim().slice(0, 40);
    if (!nombre) return json({ ok: false, err: "sin nombre" });
    hoja().appendRow([
      new Date(), nombre, (d.modo === "L" ? "L" : "T"),
      Number(d.aciertos) || 0, Number(d.total) || 0,
      Number(d.puntos) || 0, Number(d.tiempo) || 0
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, err: String(err) });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};

  // Reiniciar la ronda:  ...../exec?accion=reset&token=polimeros2026
  if (p.accion === "reset") {
    if (p.token !== CLAVE) return json({ ok: false, err: "clave incorrecta" });
    const sh = hoja();
    if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
    return json({ ok: true, rows: [] });
  }

  const sh = hoja();
  const vals = sh.getDataRange().getValues();
  vals.shift();
  const rows = vals.map(function (r) {
    return {
      nombre: r[1], modo: r[2], aciertos: r[3],
      total: r[4], puntos: r[5], tiempo: r[6]
    };
  });
  return json({ ok: true, rows: rows });
}
