"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { NavigationViewer } from "@/components/NavigationViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightCircle, Calendar, Pickaxe, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";
import { Schedule } from "@/types/Schedule";
import { Service } from "@/types/Service";
import { ScheduleSummaryCard } from "@/components/ScheduleSummaryCard";
import { getUserProfile } from "@/utils/getUserProfile";
import { User } from "@/types/User";
import { useRouter } from "next/navigation";

interface HomeData {
  latestSchedule: Schedule[];
  nextSchedule: Schedule[];
  waitingToConfirm: Schedule[];
  ongoingSchedule: Schedule[];
  popularServices: Service[];
  scheduleLength: number;
}

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const navigate = useRouter();

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

  const { data, isLoading } = useQuery<HomeData>("homeData", async () => {
    const response = await api.get("/home");
    return response.data;
  });

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["users"],
    queryFn: async () => {
      const user = await getUserProfile();
      return user;
    },
  });

  if (isLoading || !data || isLoadingUser) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const {
    latestSchedule,
    waitingToConfirm,
    nextSchedule,
    ongoingSchedule,
    popularServices,
    scheduleLength,
  } = data;

  return (
    <ContainerPage>
      <div className="flex items-center justify-between">
        <NavigationViewer data={[]} />
        <Link href="/services">
          <ArrowRightCircle />
        </Link>
      </div>
      <h2 className="text-3xl font-semibold">
        {greeting} {user?.name}!
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="">
          <CardHeader>
            <CardTitle>Nossos serviços mais pedidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map((service) => (
              <div
                className="bg-orage px-4 py-16 text-white rounded-md flex flex-col gap-2 items-center justify-center text-center"
                key={service.id}
              >
                <Settings />
                <span>{service.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 mx-auto mb-4 bg-orage text-white rounded-md">
                <Calendar className="h-10 w-10" />
              </div>
              <span className="text-sm">
                Agende um novo serviço de forma rápida e fácil.
              </span>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="default" className="bg-orage" asChild>
                <Link href="/scheduling">Agendar</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="relative">
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8 mx-auto mb-4 bg-orage text-white rounded-md">
                <Pickaxe className="h-10 w-10" />
              </div>
              <span className="text-sm">
                Conheça todos os serviços que oferecemos para você.
              </span>
            </CardContent>
            <CardFooter className="absolute right-0 bottom-0">
              <Button variant="default" className="bg-orage" asChild>
                <Link href="/services">Saiba mais</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus agendamentos</CardTitle>
          <CardDescription>
            Veja os serviços concluídos, em andamento e futuros.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-lg font-medium">
              Serviços esperando confirmação
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Veja os serviços que estão em espera.
            </p>
            {waitingToConfirm.length > 0 ? (
              waitingToConfirm.map((appointment) => (
                <ScheduleSummaryCard key={appointment.id} data={appointment} />
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum serviço em espera
              </p>
            )}
          </div>

          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-lg font-medium">Serviços em andamento</h3>
            <p className="text-sm text-gray-500 mb-4">
              Veja os serviços que estão em andamento.
            </p>
            {ongoingSchedule.length > 0 ? (
              ongoingSchedule.map((appointment) => (
                <ScheduleSummaryCard key={appointment.id} data={appointment} />
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum serviço em andamento
              </p>
            )}
          </div>

          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-lg font-medium">Serviços concluídos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Veja os serviços que foram concluídos ou cancelados.
            </p>
            {latestSchedule.length > 0 ? (
              latestSchedule.map((appointment) => (
                <ScheduleSummaryCard key={appointment.id} data={appointment} />
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum serviço concluído ou cancelado recentemente
              </p>
            )}
          </div>
          <div className="border-r border-gray-200 pr-4">
            <h3 className="text-lg font-medium ">Próximos serviços</h3>
            <p className="text-sm text-gray-500 mb-4">
              Veja os serviços agendados para o futuro.
            </p>
            {nextSchedule.length > 0 ? (
              nextSchedule.map((appointment) => (
                <ScheduleSummaryCard key={appointment.id} data={appointment} />
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhum próximo serviço agendado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-lg font-medium">Total de Serviços</h4>
              <p className="text-2xl">{scheduleLength}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium">Serviços em Andamento</h4>
              <p className="text-2xl">{ongoingSchedule.length}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium">Serviços Concluídos</h4>
              <p className="text-2xl">{latestSchedule.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContainerPage>
  );
}
