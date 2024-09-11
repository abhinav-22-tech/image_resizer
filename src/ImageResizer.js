import "./ImageResizer.css";
import React, { useState, useEffect } from "react";
// import Resizer from "react-image-file-resizer";
import { useForm, Controller } from "react-hook-form";
import resizedImage from "./ResizeImage";

export default function ImageResizer() {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizerImage, setResizerImage] = useState(null);
  const [imageInfo, setImageInfo] = useState({
    width: null,
    height: null,
    fileType: null,
    fileSize: null,
  });
  const [resizedImgInfoState, setResizedImgInfoState] = useState({
    width: null,
    height: null,
    fileType: null,
    fileSize: null,
  });

  const { control, watch, setValue } = useForm({
    defaultValues: {
      width: 300,
      height: 300,
      fileType: "jpeg",
      quality: 100,
    },
  });

  // Change image size, quality and format
  const width = watch("width");
  const height = watch("height");
  const quality = watch("quality");
  const fileType = watch("fileType");

  const extractImageInfo = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      // Extract the original file extension
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
          fileType: fileExtension,
          fileSize: (file.size / 1024).toFixed(2),
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOriginalImage(file);
      extractImageInfo(file);
    }
  };

  const resizedImageInfo = (
    blob,
    newWidth,
    newHeight,
    newQuality,
    fileType
  ) => {
    if (blob) {
      const fileSizeKB = (blob.size / 1024).toFixed(2); // Convert bytes to KB

      setResizedImgInfoState({
        width: newWidth,
        height: newHeight,
        fileType: fileType.split("/").pop(),
        fileSize: fileSizeKB,
      });
    } else {
      console.error("Invalid blob or missing blob data");
    }
  };

  useEffect(() => {
    if (originalImage) {
      if (width > 0 && height > 0 && quality > 0) {
        resizedImage(originalImage, width, height, quality, fileType)
          .then(({ blob, blobUrl }) => {
            setResizerImage(blobUrl);
            resizedImageInfo(blob, width, height, quality, fileType);
          })
          .catch((error) => {
            console.error("Image resizing error:", error, fileType);
          });
      }
    }
  }, [originalImage, width, height, quality, fileType]);

  const downloadImage = () => {
    const link = document.createElement("a");
    const fileName = originalImage.name.split(".")[0];
    const extension = resizedImgInfoState.fileType.split("/").pop();
    link.href = resizerImage;
    link.download = `${fileName}_resized.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen grid-background bg-teal-50 flex flex-col md:flex-row items-center justify-center p-4 gap-4">
      {/* Image Previe in the middle  */}
      <div className="w-full md:w-1/2 1 flex justify-center mb-6 md:mb-0">
        <div className="bg-white shadow-xl rounded-lg w-full max-w-lg flex items-center justify-center">
          {resizerImage ? (
            <>
              <img
                src={resizerImage}
                alt="Resized Image"
                className="transition-all duration-500 ease-in-out max-w-full h-auto rounded-lg shadow-lg"
                // style={{ width: `${width}px`, height: `${height}px` }}
              />
            </>
          ) : (
            // Upload Box
            <div
              className="bg-teal-600 w-full rounded-lg 
            max-w-lg border-dashed border-4 border-white"
            >
              <div
                className="bg-gradient-to-r from-teal-600 to-indigo-500 via-sky-500 via-60% w-full rounded-lg   
            max-w-lg flex items-center justify-center
            border-soild border-2 border-white p-4"
              >
                {/* File Upload */}
                <div class="flex items-center justify-center w-full">
                  <label
                    for="dropzone-file"
                    class="flex flex-col items-center justify-center w-full h-64 border-4 border-white border-dashed rounded-lg cursor-pointer bg-gray-100  hover:bg-gray-200
                    hover:border-white"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        class="w-8 h-8 mb-4 text-white-500 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-white">
                        <span class="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-white">
                        PNG, JPG{" "}
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      class="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-1/3 bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-600">
          {" "}
          Image Resizer
        </h1>

        {/* <input
          className="block w-full text-sm text-teal-700 file:rounded-full file:border file:border-teal-300 file:text-sm file:bg-white file:text-teal-700 hover:file:bg-teal-100 bg-white rounded-md cursor-pointer focus:outline-none mb-4"
          type="file"
          onChange={handleImageUpload}
        /> */}

        <form className="mb-4">
          {/* Width and Height */}
          <div className="flex flex-row gap-2">
            {/* Width */}
            <Controller
              name="width"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block text-teal-700 text-sm font-bold mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    {...field}
                    placeholder="width"
                    min="1"
                    className="shadow-md appearance-none border-teal-300 rounded w-full py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
            />
            {/* Height */}
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block text-teal-700 text-sm font-bold mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    {...field}
                    placeholder="height"
                    min="1"
                    className="shadow-md appearance-none border-teal-300 rounded w-full py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              )}
            />
          </div>
          {/* Quality */}
          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <div className="mb-4 flex-1">
                <label className="block text-teal-700 text-sm font-bold mb-2">
                  Quality ({field.value}%)
                </label>
                <input
                  type="range"
                  {...field}
                  min="1"
                  max="100"
                  step="1"
                  className="w-full cursor-pointer"
                  disabled={resizedImgInfoState.fileType === "png"}
                />
              </div>
            )}
          />

          <div className="flex flex-row gap-4">
            {/* File Type */}
            <Controller
              name="fileType"
              control={control}
              render={({ field }) => (
                <div className="mb-4 flex flex-row items-center gap-2">
                  <label className="text-teal-700 text-sm font-bold">
                    File Type
                  </label>
                  <select
                    {...field}
                    className="shadow-md appearance-none border-teal-300 rounded w-half py-2 px-3 text-gray-700 
                    leading-tight focus:outline-none focus:shadow-outline"
                    name="fileType"
                    id="fileType"
                  >
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </div>
              )}
            />
            {/* Lock Aspect Ratio */}
            <Controller
              name="aspect_ratio"
              control={control}
              render={({ field }) => (
                <div className="mb-4 flex flex-row items-center gap-2">
                  <label className="text-teal-700 text-sm font-bold">
                    Aspect Ratio
                  </label>
                  <input
                    type="checkbox"
                    {...field}
                    className="border-teal-300 rounded text-gray-700 
                    leading-tight focus:shadow-outline cursor-pointer"
                  />
                </div>
              )}
            />
          </div>
        </form>

        {/* Specifications */}
        {resizerImage && (
          <div className="text-center">
            {/* Original Image Info */}
            <div className="justify-center items-center bg-white shadow-md rounded-lg p-4 mb-4">
              <div className="flex flex-row gap-1">
                <h3 className="text-sm font-semibold text-teal-600">
                  Current Image:
                </h3>
                <p className="text-gray-700 text-sm">
                  <span className="font-bold">
                    {imageInfo.width} x {imageInfo.height}
                  </span>{" "}
                  pixels
                  <span className="ml-2 text-gray-500">
                    {imageInfo.fileSize} KB{" "}
                    <span className="font-medium">{imageInfo.fileType}</span>
                  </span>
                </p>
              </div>
              {/* Resized Image Info */}
              <div className="flex flex-row gap-1">
                <h3 className="text-sm font-semibold text-teal-600">
                  New Image:
                </h3>
                <p className="text-gray-700 text-sm">
                  <span className="font-bold">
                    {resizedImgInfoState.width} x {resizedImgInfoState.height}
                  </span>{" "}
                  pixels
                  <span className="ml-2 text-gray-500">
                    {resizedImgInfoState.fileSize} KB{" "}
                    <span className="font-medium">
                      {resizedImgInfoState.fileType}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={downloadImage}
              className="bg-teal-500 hover:bg-teal-700 text-bold text-white 
                py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Quality x
// File Type
// Lock Aspect Ratio
// Batch Processing
