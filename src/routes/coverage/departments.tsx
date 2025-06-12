import Deparments from "@/features/coverage/departments/pages/deparments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/departments")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Deparments />;
}
