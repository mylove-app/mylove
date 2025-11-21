import prisma from "@/lib/prisma";
import NotFound from "@/app/not-found";

export default async function SitePage({ params }) {
  const { subdomain } = await params;

  const site = await prisma.site.findUnique({
    where: { subdomain },
    include: { template: true },
  });

  if (!site ||site.status === false || !site.expiredAt || site.expiredAt < new Date()) {
    return (
      <div>
        {" "}
        <NotFound
          title="Tampilan Tidak Ditemukan!"
          code="404"
          message="Oops! Perpanjang atau buat website baru."
          buttonLabel="Kembali"
          buttonHref="/"
        />
      </div>
    );
  }

  let html = site.template.html || "";
  let css = site.template.css || "";
  let js = site.template.js || "";

  Object.entries(site.content).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    css = css.replace(new RegExp(`{{${key}}}`, "g"), value);
    js = js.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return (
    <>
      <style>{css}</style>

      <div dangerouslySetInnerHTML={{ __html: html }} />

      <script dangerouslySetInnerHTML={{ __html: js }} />
    </>
  );
}
