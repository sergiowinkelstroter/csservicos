"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { NavigationViewer } from "@/components/NavigationViewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "react-query";
import { getUserProfile } from "@/utils/getUserProfile";
import { Loading } from "@/components/Loading";
import { User } from "@/types/User";
import { Perfil } from "./components/Perfil";
import { Notification } from "./components/Notification";
import { Pickaxe } from "lucide-react";

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
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="flex flex-col gap-4">
            <Perfil user={user} />
          </TabsContent>
          <TabsContent value="notifications">
            <Notification user={user} />
          </TabsContent>
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>FAQ</CardTitle>
                {/* <CardDescription>Configurações da sua conta</CardDescription> */}
              </CardHeader>
              <CardContent className="flex flex-col gap-2 items-center justify-center">
                <Pickaxe size={32} />
                <p className="text-center text-sm text-muted-foreground">
                  Em Desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContainerPage>
  );
}
