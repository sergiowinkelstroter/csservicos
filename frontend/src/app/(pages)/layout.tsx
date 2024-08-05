"use client";
import { Toaster } from "@/components/ui/toaster";
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
        <body className="">
          {children}
          <Toaster />
        </body>
      </QueryClientProvider>
    </html>
  );
}
