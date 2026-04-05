import { getFirestore, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../js/firebase-config.js";


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