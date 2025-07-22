import { SiteHeader } from "@/components/site-header";
import { Dashboard } from "@/features/dashboard/pages";

export default function Page1() {
  return (
    <>
      <SiteHeader items={[{ label: "Inicio", href: "/", isCurrentPage: true }]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h2 className="text-2xl font-bold">Panel de Control</h2>
        <Dashboard />
      </div>
    </>
  );
}
