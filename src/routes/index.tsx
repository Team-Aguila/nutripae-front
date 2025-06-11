import { createFileRoute } from "@tanstack/react-router";
import Page from "@/Pages/Page1";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Page />;
}
