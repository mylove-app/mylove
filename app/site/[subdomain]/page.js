import { templates } from "@/components/template";

export default async function SitePage({ params }) {
  const { subdomain } = await params;

  // gunakan absolute URL agar aman di server
  const res = await fetch(`http://localhost:3000/api/sites/${subdomain}`, {
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
