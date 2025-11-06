export default function Template4({ content }) {
  const { texts = [], images = [] } = content || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-10 text-center">
      <h2 className="text-4xl font-semibold mb-4">{texts[0] || "Judul Template 4"}</h2>
      <p className="text-gray-700 mb-6">{texts[1] || "Teks tambahan di sini."}</p>

      <div className="flex flex-wrap justify-center gap-6">
        {images.map((img, i) => (
          <img
            key={i}
            src={img || "https://via.placeholder.com/200x200"}
            alt={`Gambar ${i + 1}`}
            className="rounded-xl shadow-lg w-52 h-52 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
