import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coverage/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coverage/"!</div>;
}
