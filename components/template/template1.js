export default function Template1({ content }) {
  const { texts = [], images = [] } = content || {};

  return (
    <div className="min-h-screen bg-white p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">{texts[0] || "Judul Template 1"}</h1>
      <p className="text-gray-700 mb-2">{texts[1] || "Deskripsi utama di sini."}</p>
      <p className="text-gray-500 mb-6">{texts[2] || "Tambahan informasi."}</p>

      <div className="flex justify-center gap-4">
        {images.map((img, i) => (
          <img
            key={i}
            src={img || "https://via.placeholder.com/300x200"}
            alt={`Gambar ${i + 1}`}
            className="rounded-lg shadow-md w-64 h-40 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
