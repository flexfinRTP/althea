import { AppLoader } from "@/components/ui/AppLoader";
import { LOADER_STATUS } from "@/lib/ui/loader";

export default function Loading() {
  return <AppLoader status={LOADER_STATUS.proof} />;
}
