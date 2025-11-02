"use client";

import { UploadButton } from "@uploadthing/react";
import { ImagePlus } from "lucide-react";

export default function ImageUploadButton({ endpoint, onUploadComplete }) {
  return (
    <div className="w-full">
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const urls = res.map((f) => f.url);
            onUploadComplete(urls);
          }
        }}
        onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
        appearance={{
          container: "w-full",
          button:
            "w-full min-h-40 border-2 border-dashed border-gray-400 hover:border-primary/70 transition rounded-lg p-6 flex flex-col items-center justify-center text-gray-600  cursor-pointer",
          input: "hidden file:hidden",
        }}
        content={{
          button({ ready }) {
            return (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="bg-gray-100 p-3 rounded-full">
                  <ImagePlus className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-sm font-medium">
                  {ready ? "Import Image" : "Menyiapkan..."}
                </p>
                <p className="text-xs text-gray-400">
                  Klik atau seret gambar ke sini
                </p>
              </div>
            );
          },
        }}
      />
    </div>
  );
}
