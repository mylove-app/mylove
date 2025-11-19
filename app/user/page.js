"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SiteTablePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!userId) return;

    axios.get(`/api/site/byUser/${userId}`).then((res) => {
      setSites(res.data);
    });
  }, [userId]);

  const filtered = sites.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Daftar Website Kamu</h1>

      <input
        type="text"
        placeholder="Cari nama website..."
        className="border p-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left font-medium">Nama</th>
              <th className="p-3 text-left font-medium">Template</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}

            {filtered.map((site) => (
              <tr
                key={site.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3 font-medium">{site.name}</td>
                <td className="p-3">{site.templateId}</td>
                <td className="p-3">
                  {site.status ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="p-3 flex items-center gap-3">
                  <a
                    href={`/sites/edit/${site.id}`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </a>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://${site.subdomain}.mylove.my.id`
                      )
                    }
                    className="text-gray-700 hover:text-gray-900"
                    title="Bagikan"
                  >
                    <Share2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
