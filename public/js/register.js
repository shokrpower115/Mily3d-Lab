import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHd-Sy6sBD9sdRjqTE_EaE0SfG3cmX8Kw",
  authDomain: "nfc-info.firebaseapp.com",
  projectId: "nfc-info",
  storageBucket: "nfc-info.firebasestorage.app",
  messagingSenderId: "594217896934",
  appId: "1:594217896934:web:2ed80b2ad7b01010842427",
  measurementId: "G-W06B6KQZRF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 Obtener ID
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

document.getElementById("saveBtn").onclick = async () => {

  const file = document.getElementById("petImage").files[0];

  let photoURL = "";

  if (file) {
    photoURL = await subirImagen(file);
  }
  const petName = document.getElementById("petName").value;
  const ownerName = document.getElementById("ownerName").value;
  const phone = document.getElementById("phone").value;
  const extra = document.getElementById("extra").value;

 console.log(id, petName, ownerName, phone, extra);



  if (!petName || !ownerName || !phone) {
    Swal.fire("Error", "Completa los campos obligatorios", "error");
    return;
  }

  try {
    // 🐶 Guardar mascota
    await setDoc(doc(db, "pets", id), {
      petName,
      ownerName,
      phone,
      extra,
      photoURL: photoURL,
      createdAt: new Date()
    });

    // 🔄 Actualizar tag
    await updateDoc(doc(db, "pets", id), {
      status: "registered"
    });

    Swal.fire("Éxito", "Mascota registrada correctamente", "success");

    // 🚀 Redirigir
    setTimeout(() => {
      window.location.href = `/pet.html?id=${id}`;
    }, 1500);

  } catch (error) {
    console.error(error);
    Swal.fire("Error", "No se pudo guardar", "error");
  }
};

async function subirImagen(file) {
  const url = "https://api.cloudinary.com/v1_1/dzerhnxeg/image/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "pets_upload");

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  return data.secure_url;
}