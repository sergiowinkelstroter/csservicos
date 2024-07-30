"use client";
import { ContainerPage } from "@/components/ContainerPage";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "react-query";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";
import { Schedule } from "@/types/Schedule";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScheduleCard } from "./components/ScheduleCard";
import TabList from "./components/TabList";
import ScheduleTabContent from "./components/ScheduleTabContent";
import { useContext } from "react";
import { ScheduleContext } from "@/contexts/Schedules";

export default function Scheduling() {
  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await api.get(`/schedules/list`);
      return response.data;
    },
  });
  const { scheduleStatus, setScheduleStatus } = useContext(ScheduleContext);

  if (schedules === undefined || isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const schedules_A_Confirmar = schedules.filter(
    (schedule) => schedule.status === "A_CONFIRMAR"
  );
  const schedules_agendados = schedules.filter(
    (schedule) => schedule.status === "AGENDADO"
  );
  const schedules_em_andamento = schedules.filter(
    (schedule) =>
      schedule.status === "EM_ANDAMENTO" || schedule.status === "PAUSADO"
  );
  const schedules_cancelados = schedules.filter(
    (schedule) => schedule.status === "CANCELADO"
  );
  const schedules_concluidos = schedules.filter(
    (schedule) => schedule.status === "CONCLUIDO"
  );

  return (
    <ContainerPage>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Agendamentos</h1>
        <Link href="/admin/services">
          <ArrowRightCircle />
        </Link>
      </div>
      <div>
        <Tabs
          defaultValue={"a_confirmar"}
          value={scheduleStatus}
          onValueChange={setScheduleStatus}
        >
          <TabList />
          <TabsContent value="a_confirmar">
            <ScheduleTabContent
              schedules={schedules_A_Confirmar}
              title="A confirmar"
              description="Agendamentos que ainda não foram confirmados"
            />
          </TabsContent>
          <TabsContent value="agendados">
            <ScheduleTabContent
              schedules={schedules_agendados}
              title="Agendados"
              description="Aqui você encontra os agendamentos confirmados"
            />
          </TabsContent>
          <TabsContent value="em_andamento">
            <ScheduleTabContent
              schedules={schedules_em_andamento}
              title="Em andamento"
              description="Aqui você encontra agendamentos em andamento"
            />
          </TabsContent>
          <TabsContent value="concluidos">
            <ScheduleTabContent
              schedules={schedules_concluidos}
              title="Concluidos"
              description="Agendamentos concluidos"
            />
          </TabsContent>
        </Tabs>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Cancelados</CardTitle>
          <CardDescription>
            Aqui você encontra os agendamentos cancelados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedules_cancelados.length === 0 ? (
            <div className="flex justify-center items-center">
              <p className="text-sm text-muted-foreground">
                {" "}
                Nenhum agendamento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules_cancelados.map((appointment) => (
                <ScheduleCard key={appointment.id} schedule={appointment} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ContainerPage>
  );
}
