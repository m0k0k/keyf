import { DocumentIdProvider } from "@/providers/document-id-provider";
export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocumentIdProvider>{children}</DocumentIdProvider>;
}
