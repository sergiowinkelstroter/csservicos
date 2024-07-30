"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { NavigationViewer } from "@/components/NavigationViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import { Loading } from "@/components/Loading";
import { User } from "@/types/User";
import { Perfil } from "./components/Perfil";
import { Backups } from "./components/Backups";
import { Notification } from "./components/Notification";

export default function Settings() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["users"],
    queryFn: async () => {
      const user = await getUserProfile();
      return user;
    },
  });

  if (user === undefined || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <ContainerPage>
      <NavigationViewer
        data={[{ href: "/settings", prefix: "Configurações" }]}
      />
      <h2 className="text-3xl font-semibold">Configurações</h2>
      <div className="">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex flex-col gap-4">
            <Perfil user={user} />
          </TabsContent>
          <TabsContent value="backups">
            <Backups />
          </TabsContent>
          <TabsContent value="notifications">
            <Notification user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </ContainerPage>
  );
}
