"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

export default function ImageUploadButton({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelect && onFileSelect(file); // kirim File ke parent
  };

  return (
    <div className="w-full">
      <label className="w-full cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-full min-h-40 border-2 border-dashed border-gray-400 hover:border-blue-500 transition rounded-lg p-6 flex flex-col items-center justify-center text-gray-600">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-gray-100 p-3 rounded-full">
                <ImagePlus className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium">Import Image</p>
              <p className="text-xs text-gray-400">
                Klik atau seret gambar ke sini
              </p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
}
