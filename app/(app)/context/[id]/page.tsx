import { ContextPage } from "./context-page";
export default async function ContextPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ContextPage id={id} />;
}
