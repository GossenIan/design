(function () {
  const UPLOAD_ENDPOINT = '/api/upload-image';
  const MAX_IMAGE_SIZE_BYTES = 6 * 1024 * 1024;

  function validarImagen(file) {
    if (!file) {
      throw new Error('Selecciona una imagen.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Selecciona un archivo de imagen valido.');
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error('La imagen supera los 6 MB. Usa una imagen mas liviana.');
    }
  }

  function leerComoDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        resolve({
          url: String(reader.result || ''),
          fileName: file.name,
          fallback: true
        });
      });
      reader.addEventListener('error', () => reject(new Error('No se pudo leer la imagen.')));
      reader.readAsDataURL(file);
    });
  }

  async function subirAlServidor(file) {
    validarImagen(file);

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('No se pudo guardar la imagen en la carpeta img.');
    }

    const data = await response.json();

    if (!data?.ok || !data.url) {
      throw new Error('El servidor no devolvio una imagen valida.');
    }

    return {
      url: data.url,
      fileName: data.fileName || file.name,
      fallback: false
    };
  }

  async function resolverImagen(file) {
    validarImagen(file);

    try {
      return await subirAlServidor(file);
    } catch (error) {
      console.warn(error);
      return leerComoDataUrl(file);
    }
  }

  window.SquatGymImageUpload = {
    resolve: resolverImagen,
    upload: subirAlServidor,
    readAsDataUrl: leerComoDataUrl
  };
}());
