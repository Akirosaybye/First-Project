// --- LÓGICA DE EXTRACCIÓN DE TEXTO (OCR) Y PDF ---

const imageInput = document.getElementById('imageInput');
const ocrBtn = document.getElementById('ocrBtn');
const ocrOutput = document.getElementById('ocrOutput');

if (ocrBtn) {
  ocrBtn.addEventListener('click', async () => {
    const file = imageInput ? imageInput.files[0] : null;

    if (!file) {
      alert('Por favor, selecciona una imagen o documento primero.');
      return;
    }

    ocrOutput.value = 'Procesando archivo e identificando texto... Por favor espera.';
    ocrBtn.disabled = true;

    try {
      // Creamos el motor de Tesseract configurado en idioma español ('spa')
      const worker = await Tesseract.createWorker('spa');
      const ret = await worker.recognize(file);
      
      ocrOutput.value = ret.data.text || 'No se pudo detectar texto legible en el archivo.';
      await worker.terminate();
    } catch (err) {
      ocrOutput.value = 'Error al procesar el archivo. Asegúrate de que sea un formato válido de imagen o PDF escaneado.';
      console.error(err);
    } finally {
      ocrBtn.disabled = false;
    }
  });
}
