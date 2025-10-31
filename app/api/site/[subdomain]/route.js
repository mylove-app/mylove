export async function GET(req, { params }) {
    const { subdomain } = await params;

  const dummySites = [
    {
      subdomain: "syarif",
      template: "template1",
      content: {
        title: "Toko Mawar",
        description: "Menjual bunga segar setiap hari 🌹",
        images: [
          "https://picsum.photos/400/300?1",
          "https://picsum.photos/400/300?2",
        ],
      },
    },
    {
      subdomain: "testing",
      template: "template2",
      content: {
        title: "Kopi Kenangan",
        description: "Tempat terbaik untuk ngopi bareng teman ☕",
        images: [
          "https://picsum.photos/400/300?3",
          "https://picsum.photos/400/300?4",
          "https://picsum.photos/400/300?5",
        ],
      },
    },
  ];

  // 🔍 Cari site berdasarkan subdomain
  const site = dummySites.find((s) => s.subdomain === subdomain);

  if (!site) {
    return Response.json({ error: "Website tidak ditemukan" }, { status: 404 });
  }

  return Response.json(site);
}
