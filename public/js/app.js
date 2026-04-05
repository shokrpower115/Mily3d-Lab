// 🔥 IMPORTACIONES FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔑 CONFIG FIREBASE (REEMPLAZA CON LA TUYA)
const firebaseConfig = {
  apiKey: "AIzaSyAHd-Sy6sBD9sdRjqTE_EaE0SfG3cmX8Kw",
  authDomain: "nfc-info.firebaseapp.com",
  projectId: "nfc-info",
  storageBucket: "nfc-info.firebasestorage.app",
  messagingSenderId: "594217896934",
  appId: "1:594217896934:web:2ed80b2ad7b01010842427",
  measurementId: "G-W06B6KQZRF"
};

// 🚀 INICIALIZAR
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

// 📌 OBTENER ID DE LA URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 🚨 VALIDAR ID
if (!id) {
  mostrarError("ID inválido");
}

console.log("ID:", id);

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

  console.log("petSnap:", petSnap.exists());
  console.log("Entró a cargarMascota con ID:", id);

  if (!petSnap.exists()) {
    mostrarError("Mascota no encontrada");
    return;
  }

  const pet = petSnap.data();

  document.getElementById("extra").innerText = pet.extra || "Sin información";
  document.getElementById("petName").innerText = pet.petName;
  document.getElementById("ownerName").innerText = "Dueño: " + pet.ownerName;
  document.getElementById("phone").innerText = "Tel: " + pet.phone;

  const photo = document.getElementById("petPhoto");
  const icon = document.getElementById("petIcon");

  if (pet.photoURL && pet.photoURL !== "") {
    photo.src = pet.photoURL;
    photo.style.display = "block";
    icon.style.display = "none";
  }

  //   document.getElementById("whatsappBtn").onclick = () => {
  //   const mensaje = encodeURIComponent("Hola, encontré tu mascota 🐶");
  //   window.open(`https://wa.me/52${pet.phone}?text=${mensaje}`, "_blank");
  // };

  const callBtn = document.getElementById("callBtn");
  callBtn.onclick = () => {
    window.location.href = `tel:${pet.phone}`;
  };

  
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