import prisma from "@/lib/prisma";

export default async function SitePage({ params }) {
  const { subdomain } =await params;

  const site = await prisma.site.findUnique({
    where: { subdomain },
    include: { template: true }
  });

  if (!site) return <div>Website tidak ditemukan</div>;

  // ambil template parts
  let html = site.template.html || "";
  const css = site.template.css || "";
  const js = site.template.js || "";

  // replace {{variable}} di dalam HTML
  Object.entries(site.content).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return (
    <>
      <style>{css}</style>

      <div dangerouslySetInnerHTML={{ __html: html }} />

      <script dangerouslySetInnerHTML={{ __html: js }} />
    </>
  );
}
