import { DocumentIdProvider } from "@/providers/document-id-provider";
export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocumentIdProvider>{children}</DocumentIdProvider>;
}
