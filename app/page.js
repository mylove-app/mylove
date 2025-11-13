import Home from "@/components/dashboard/home";
import AppShell from "@/components/layout/appShell";
import FeaturedPage from "@/components/dashboard/feature";
import ProcessPage from "@/components/dashboard/procces";
import FAQPage from "@/components/dashboard/faq";

export default function RootPage() {
  return (
    <AppShell>
      <Home />
      <FeaturedPage />
      <ProcessPage />
      <FAQPage />
    </AppShell>
  );
}