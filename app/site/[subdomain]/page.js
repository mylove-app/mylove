import { templates } from "@/components/template";

export default async function SitePage({ params }) {
  const { subdomain } = await params;
  const API_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:3000";

  // gunakan absolute URL agar aman di server
  const res = await fetch(`${API_URL}/api/site/${subdomain}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <h1 className="text-center mt-10">Website tidak ditemukan</h1>;
  }

  const site = await res.json();
  const TemplateComponent = templates[site.template];

  if (!TemplateComponent)
    return <h1 className="text-center mt-10">Template tidak ditemukan</h1>;

  return <TemplateComponent content={site.content} />;
}
