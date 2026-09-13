import { AppNavCard, AppPage } from "@/components/app/AppChrome";

export default function AdminHome() {
  return (
    <AppPage kicker="Admin" title="Admin">
      <div className="grid gap-4 md:grid-cols-2">
        <AppNavCard href="/admin/treasury" kicker="01" label="Treasury" />
        <AppNavCard href="/funders" kicker="02" label="Funders" />
      </div>
    </AppPage>
  );
}
