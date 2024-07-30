"use client";

import { ContainerPage } from "@/components/ContainerPage";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserProfile } from "@/utils/getUserProfile";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { User as UserType } from "@/types/User";
import { SchedulesList } from "./components/SchedulesList";
import { Loading } from "@/components/Loading";

export default function Home() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Bom dia";
      } else if (currentHour < 18) {
        return "Boa tarde";
      } else {
        return "Boa noite";
      }
    };

    setGreeting(getCurrentGreeting());
  }, []);

  const { data: user, isLoading: isLoadingUser } = useQuery<UserType>({
    queryKey: ["users"],
    queryFn: async () => {
      const user = await getUserProfile();
      return user;
    },
  });

  if (isLoadingUser || user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <ContainerPage>
      <h2 className="text-xl md:text-3xl font-semibold">
        {greeting} {user?.name}!
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>
            Veja a baixo os seus agendamentos da semana
          </CardDescription>
          <SchedulesList userId={user.id} />
        </CardHeader>
      </Card>
    </ContainerPage>
  );
}
