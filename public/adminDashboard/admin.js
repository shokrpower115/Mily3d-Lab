import { db } from "../js/firebase-config.js";
import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { generarFolletoPDF } from "/js/qr.js";

let idActual = null;

// ── Generar ID ──
function generarId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let resultado = "";
  for (let i = 0; i < 6; i++) {
    resultado += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PET-${resultado}`;
}

document.getElementById("generarBtn").addEventListener("click", () => {
  idActual = generarId();
  document.getElementById("idGenerado").textContent = idActual;
  document.getElementById("guardarBtn").disabled = false;
});

// ── Guardar tag ──
document.getElementById("guardarBtn").addEventListener("click", async () => {
  if (!idActual) return;

  const btn = document.getElementById("guardarBtn");
  btn.disabled = true;
  btn.textContent = "Guardando...";

  const link = `https://nfc-info.web.app/pet.html?id=${idActual}`;

  try {
    await setDoc(doc(db, "pets", idActual), {
      petName: "",
      ownerName: "",
      phone: "",
      status: "unregistered",
      createdAt: new Date(),
      link
    });

    await generarFolletoPDF(idActual, link);

    Swal.fire({
      title: "Tag creado",
      text: `${idActual} guardado y folleto descargado.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });

    // Resetear
    idActual = null;
    document.getElementById("idGenerado").textContent = "—";
    btn.textContent = "Guardar";

    cargarTags();

  } catch (error) {
    console.error(error);
    btn.disabled = false;
    btn.textContent = "Guardar";
    Swal.fire({ title: "Error", text: "No se pudo guardar el tag.", icon: "error" });
  }
});

// ── Cargar tabla ──
async function cargarTags() {
  const wrap = document.getElementById("tabla-wrap");
  wrap.innerHTML = `<div class="loading-row">Cargando tags...</div>`;

  const snapshot = await getDocs(collection(db, "pets"));

  if (snapshot.empty) {
    wrap.innerHTML = `<div class="loading-row">No hay tags registrados aún.</div>`;
    return;
  }

  const registrados = [];
  const sinRegistrar = [];

  snapshot.forEach(docSnap => {
    const d = { id: docSnap.id, ...docSnap.data() };
    if (d.status === "registered") registrados.push(d);
    else sinRegistrar.push(d);
  });

  // Registrados primero
  const todos = [...sinRegistrar,...registrados];

  wrap.innerHTML = `
    <div class="tabla-header">
      <span>ID</span>
      <span>Mascota</span>
      <span>Dueño</span>
      <span>Estado</span>
      <span></span>
    </div>
  `;

  todos.forEach(pet => {
    const esRegistrado = pet.status === "registered";
    const claseRow = esRegistrado ? "registrado" : "sin-registrar";
    const claseBadge = esRegistrado ? "badge-registrado" : "badge-sin-registrar";
    const textoEstado = esRegistrado ? "Registrado" : "Sin registrar";
    const fecha = pet.createdAt?.toDate
      ? pet.createdAt.toDate().toLocaleDateString("es-MX")
      : "—";

    const row = document.createElement("div");
    row.className = `tag-row ${claseRow}`;
    row.innerHTML = `
      <div class="tag-fila" data-id="${pet.id}">
        <span class="tag-id">${pet.id}</span>
        <span class="tag-cell nombre">${pet.petName || "Sin registrar"}</span>
        <span class="tag-cell dueno">${pet.ownerName || "—"}</span>
        <span class="tag-badge-wrap"><span class="tag-badge ${claseBadge}">${textoEstado}</span></span>
        <div style="display:flex; gap:6px;">
          <button class="btn-pdf" title="Descargar folleto PDF">⬇</button>
          <button class="btn-copiar" title="Copiar link NFC">🔗</button>
        </div>
      </div>
      <div class="tag-detalle">
        <div class="detalle-row"><span class="detalle-label">Link</span><span>${pet.link || "—"}</span></div>
        <div class="detalle-row"><span class="detalle-label">Teléfono</span><span>${pet.phone || "—"}</span></div>
        <div class="detalle-row"><span class="detalle-label">Creado</span><span>${fecha}</span></div>
      </div>
    `;

    // Acordeón
    row.querySelector(".tag-fila").addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-pdf")) return;
      row.querySelector(".tag-detalle").classList.toggle("abierto");
    });

    // Descargar PDF
    row.querySelector(".btn-pdf").addEventListener("click", async () => {
      const link = pet.link || `https://nfc-info.web.app/pet.html?id=${pet.id}`;
      await generarFolletoPDF(pet.id, link);
    });

    row.querySelector(".btn-copiar").addEventListener("click", async () => {
      const url = pet.link || `https://nfc-info.web.app/pet.html?id=${pet.id}`;
      try {
        await navigator.clipboard.writeText(url);
        Swal.fire({ title: "Copiado", text: url, icon: "success", timer: 1500, showConfirmButton: false });
      } catch {
        Swal.fire({ title: "Error", text: "No se pudo copiar el link.", icon: "error" });
      }
    });

    wrap.appendChild(row);
  });
}

// ── Init ──
cargarTags();