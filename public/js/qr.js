import QRCode from "https://cdn.jsdelivr.net/npm/qrcode/+esm";

export async function generarQR(url) {
  try {
    return await QRCode.toDataURL(url, { width: 300, margin: 2 });
  } catch (err) {
    console.error("Error generando QR:", err);
    return null;
  }
}

export async function descargarQR(id, url) {
  const base64 = await generarQR(url);
  if (!base64) return;
  const a = document.createElement("a");
  a.href = base64;
  a.download = `QR-${id}.png`;
  a.click();
}

export async function generarFolletoPDF(id, link) {
  const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf/+esm");

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [216, 140] });

  // Lado izquierdo — fondo oscuro
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, 0, 72, 140, "F");

  // Nombre de marca
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("MyPetScan", 36, 55, { align: "center" });

  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(159, 225, 203);
  pdf.text("TU MASCOTA SEGURA", 36, 63, { align: "center" });

  // Redes sociales
  pdf.setTextColor(180, 180, 200);
  pdf.setFontSize(7);
  pdf.text("@pettag.mx", 36, 90, { align: "center" });
  pdf.text("pettag.mx", 36, 97, { align: "center" });
  pdf.text("hola@pettag.mx", 36, 104, { align: "center" });

  // Lado derecho — contenido
  pdf.setTextColor(26, 26, 46);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Registra tu tag NFC", 82, 22);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Escanea el QR o acerca tu teléfono al tag para", 82, 30);
  pdf.text("registrar los datos de tu mascota.", 82, 36);

  // QR real
  const qrBase64 = await generarQR(link);
  if (qrBase64) {
    pdf.addImage(qrBase64, "PNG", 168, 12, 36, 36);
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text("ESCANEAR", 186, 51, { align: "center" });
  }

  // Línea divisora
  pdf.setDrawColor(230, 230, 230);
  pdf.line(82, 58, 208, 58);

  // Instrucciones
  pdf.setTextColor(26, 26, 46);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "bold");
  pdf.text("CÓMO REGISTRARTE", 82, 66);

  const pasos = [
    ["1", "Escanea el QR o acerca tu celular al tag NFC"],
    ["2", "Llena los datos de tu mascota en el formulario"],
    ["3", "¡Listo! Tu mascota ya tiene su perfil activo"],
  ];

  pasos.forEach(([num, texto], i) => {
    const y = 80 + i * 14;
    pdf.setFillColor(26, 26, 46);
    pdf.circle(86, y - 2, 3.5, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "bold");
    pdf.text(num, 86, y - 0.5, { align: "center" });
    pdf.setTextColor(80, 80, 80);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(texto, 92, y - 0.5);
  });

  // Footer
  pdf.setDrawColor(230, 230, 230);
  pdf.line(82, 125, 208, 125);
  pdf.setFontSize(7);
  pdf.setTextColor(180, 180, 180);
  pdf.text(`ID: ${id}`, 82, 132);
  pdf.setTextColor(159, 225, 203);
  pdf.text("nfc-info.web.app", 208, 132, { align: "right" });

  pdf.save(`folleto-${id}.pdf`);
}