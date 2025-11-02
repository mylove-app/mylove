import Hero from "@/components/dashboard/hero";
import AppShell from "@/components/layout/appShell";
import Template from "@/components/dashboard/template/index";
export default function RootPage() {
  return (
    <AppShell>
      <Hero />
      <Template />
    </AppShell>
  );
}