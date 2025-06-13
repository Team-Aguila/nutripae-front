import { createFileRoute } from "@tanstack/react-router";
import TownsPage from "@/features/coverage/towns/pages/towns";

export const Route = createFileRoute("/coverage/towns/")({
  component: TownsPage,
});
