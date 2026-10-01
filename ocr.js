// --- LÓGICA DE EXTRACCIÓN DE TEXTO (OCR) Y PDF ---

const imageInput = document.getElementById('imageInput');
const ocrBtn = document.getElementById('ocrBtn');
const ocrOutput = document.getElementById('ocrOutput');

if (ocrBtn) {
  ocrBtn.addEventListener('click', async () => {
    const file = imageInput ? imageInput.files[0] : null;

    if (!file) {
      alert('Por favor, selecciona una imagen primero.');
      return;
    }

    // Validación de tipo de archivo
    const isImage = file.type.startsWith('image/');

    if (!isImage) {
      ocrOutput.value = 'Por el momento, para evitar errores de renderizado, sube el documento en formato de imagen (PNG, JPG, JPEG, WEBP) o hazle una captura de pantalla al PDF.';
      return;
    }

    ocrOutput.value = 'Procesando imagen e identificando texto... Por favor espera.';
    ocrBtn.disabled = true;

    try {
      // Creamos el motor de Tesseract en español
      const worker = await Tesseract.createWorker('spa');
      const ret = await worker.recognize(file);
      
      ocrOutput.value = ret.data.text || 'No se pudo detectar texto legible en la imagen.';
      await worker.terminate();
    } catch (err) {
      ocrOutput.value = 'Error al procesar la imagen. Asegúrate de que el archivo no esté dañado.';
      console.error(err);
    } finally {
      ocrBtn.disabled = false;
    }
  });
}
