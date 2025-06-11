// src/components/ImageEditor.tsx
import { createSignal, onCleanup, onMount } from "solid-js";
import Cropper from "cropperjs";
import axios from "axios";
import "cropperjs/dist/cropper.css";

export default function ImageEditor() {
  const [imageFile, setImageFile] = createSignal<File | null>(null);
  const [cropper, setCropper] = createSignal<Cropper | null>(null);
  let imageRef: HTMLImageElement;

  const [processedImageUrl, setProcessedImageUrl] = createSignal<string | null>(null);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      imageRef.src = url;

      // Initialize cropper after image loads
      imageRef.onload = () => {
        cropper()?.destroy();
        const newCropper = new Cropper(imageRef, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
        });
        setCropper(newCropper);
      };
    }
  };

  const handleCropUpload = async () => {
    const c = cropper();
    if (!c) return;

    const canvas = c.getCroppedCanvas({ width: 300, height: 300 });
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "cropped.jpg");

    try {
      const res = await axios.post("http://localhost:5000/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { output } = res.data;
      setProcessedImageUrl(`http://localhost:5000/${output}`);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  onCleanup(() => {
    cropper()?.destroy();
  });

  return (
    <div class="p-4 space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div class="w-72 h-72 overflow-hidden">
        <img ref={el => (imageRef = el)} class="max-w-full" />
      </div>
      <button
        onClick={handleCropUpload}
        class="bg-green-600 text-white px-4 py-2 rounded"
      >
        Crop & Upload
      </button>
      {processedImageUrl() && (
        <div>
          <h3>Processed Image:</h3>
          <img src={processedImageUrl()!} class="w-48 h-auto" />
        </div>
      )}
    </div>
  );
}
