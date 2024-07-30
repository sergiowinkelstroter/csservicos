"use client";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function SectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <QueryClientProvider client={queryClient}>
        <body className="">{children}</body>
      </QueryClientProvider>
    </html>
  );
}
