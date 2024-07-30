import { Header } from "@/components/Header";
import "./app.css";
import { ScheduleProvider } from "@/contexts/Schedules";
import { getUserProfile } from "@/utils/getUserProfile";
import { AdminProvider } from "@/contexts/Admin";

export default async function SectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserProfile();

  return (
    <html lang="pt-BR">
      <ScheduleProvider>
        <AdminProvider>
          <body className="">
            <Header user={user} />
            {children}
          </body>
        </AdminProvider>
      </ScheduleProvider>
    </html>
  );
}
