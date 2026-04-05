import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../js/firebase-config.js";

// 📌 OBTENER ID DE LA URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 🚨 VALIDAR ID
if (!id) {
  mostrarError("ID inválido");
}

console.log("ID:", id);
console.log(db);

// 🔍 FUNCIÓN PRINCIPAL
async function iniciar() {
  try {
    const tagRef = doc(db, "pets", id);
    const tagSnap = await getDoc(tagRef);

    // ❌ TAG NO EXISTE
    if (!tagSnap.exists()) {
    window.location.href = `/register.html?id=${id}`;
    return;
    }

    const tagData = tagSnap.data();

    // ⚠️ NO REGISTRADO
    if (tagData.status === "unregistered") {
      window.location.href = `/register.html?id=${id}`;
      return;
    }

    // ✅ REGISTRADO → MOSTRAR DATOS
    cargarMascota(id);

  } catch (error) {
    console.error(error);
    mostrarError("Error al cargar información");
  }
}

// 🐶 CARGAR DATOS DE MASCOTA
async function cargarMascota(id) {
  const petRef = doc(db, "pets", id);
  const petSnap = await getDoc(petRef);

  if (!petSnap.exists()) {
    mostrarError("Mascota no encontrada");
    return;
  }

  const pet = petSnap.data();

  // Llenar datos
  document.getElementById("petName").innerText = pet.petName;
  document.getElementById("ownerName").innerText = pet.ownerName;
  document.getElementById("phone").innerText = pet.phone;
  document.getElementById("extra").innerText = pet.extra || "Sin información adicional";

  if (pet.photoURL) {
    document.getElementById("petPhoto").src = pet.photoURL;
    document.getElementById("petPhoto").style.display = "block";
    document.getElementById("petIcon").style.display = "none";
  }

  document.getElementById("callBtn").onclick = () => {
    window.location.href = `tel:${pet.phone}`;
  };

  document.getElementById("whatsappBtn").onclick = () => {
    const mensaje = encodeURIComponent("Hola, encontré a tu mascota 🐾");
    window.open(`https://wa.me/52${pet.phone}?text=${mensaje}`, "_blank");
  };

  // ✅ Ocultar skeleton y mostrar card con animación
  document.getElementById("skeleton").style.display = "none";
  const card = document.getElementById("petCard");
  card.style.display = "block";
  requestAnimationFrame(() => card.classList.add("visible"));
}

// ❌ MOSTRAR ERROR BONITO
function mostrarError(mensaje) {
  Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
  });

  document.body.innerHTML = `<h2 class="text-center mt-5">${mensaje}</h2>`;
}


// 🚀 INICIAR APP
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM listo");
  iniciar();
});