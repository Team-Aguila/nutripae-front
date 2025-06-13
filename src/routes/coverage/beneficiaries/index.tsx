import { createFileRoute } from "@tanstack/react-router";
import BeneficiariesPage from "@/features/coverage/beneficiaries/pages/BeneficiariesPage";

export const Route = createFileRoute("/coverage/beneficiaries/")({
  component: BeneficiariesPage,
});
