import { AppLink, AppPage } from "@/components/app/AppChrome";

export default function NotFoundPage() {
  return (
    <AppPage kicker="Not found" title="Page not found." lead="That route is not part of the Althea patient journey.">
      <AppLink href="/">Home</AppLink>
    </AppPage>
  );
}
