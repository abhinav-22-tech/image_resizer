const resizedImage = (file, width, height, quality, format = "image/jpeg") => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    quality = quality / 100;

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Adjust quality and format
        canvas.toBlob(
          (blob) => {
            const blobUrl = URL.createObjectURL(blob); // Create URL for Blob
            resolve({ blob, blobUrl }); // Resolve with both blob and blobUrl
          },
          format,
          quality
        );
      };

      img.onerror = reject;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default resizedImage;
