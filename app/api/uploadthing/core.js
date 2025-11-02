import { createUploadthing, UploadThingError } from "uploadthing/next";

// buat uploader
const f = createUploadthing();

// middleware autentikasi (ubah sesuai sistemmu)
const auth = async (req) => {
  return { userId: "some-user-id" }; // bisa ambil dari cookie / JWT
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload selesai untuk userId:", metadata.userId);
      console.log("URL file:", file.url);
      // Simpan ke DB jika perlu
      return { uploadedBy: metadata.userId, url: file.url };
    }),
};
