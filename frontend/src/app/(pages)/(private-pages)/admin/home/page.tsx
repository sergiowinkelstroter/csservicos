"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/axios";
import { User } from "@/types/User";
import { useQuery } from "react-query";
import { TableUsers } from "./components/TableUsers";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";

export default function Users() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await api.get("/users/list");
      return users.data;
    },
  });

  if (isLoading || !users) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <ContainerPage>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Home</h1>
        <Link href="/admin/scheduling">
          <ArrowRightCircle />
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <TableUsers data={users} />
        </CardContent>
      </Card>
    </ContainerPage>
  );
}
