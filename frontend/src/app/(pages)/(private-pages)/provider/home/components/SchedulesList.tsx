import { formatDatePtBr } from "@/utils/formatedDateBr";
import {
  Calendar,
  Clock,
  HomeIcon,
  List,
  MapPin,
  Pickaxe,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "react-query";
import { Schedule } from "@/types/Schedule";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSchedules } from "@/hooks/useSchedules";
import { ScheduleStart } from "./ScheduleStart";
import { ScheduleFinish } from "./ScheduleFinish";
import { SchedulePause } from "./SchedulePause";
import { ScheduleRestart } from "./ScheduleRestart";

export function SchedulesList({ userId }: { userId: number }) {
  const {
    scheduleToStart,
    isLoadingStart,
    isLoadingPause,
    isLoadingFinish,
    scheduleToFinish,
    scheduleToPause,
    scheduleToRestart,
    isLoadingRestart,
  } = useSchedules();

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery<
    Schedule[]
  >({
    queryFn: async () => {
      const response = await api.get(`/schedules/provider/list/${userId}`);
      return response.data;
    },
    queryKey: ["schedules"],
  });

  if (isLoadingSchedules || schedules === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
      {schedules.map((schedule) => (
        <Card
          key={schedule.id}
          className={`${
            schedule.status === "CONCLUIDO" ? "bg-green-600 text-white" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>{schedule.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 font-medium">
            <p className="flex gap-2">
              <User className="inline-block " />
              Agendado por: {schedule.user.name}
            </p>
            <p className="flex gap-2">
              <List className="inline-block " />
              Tipo de Serviço: {schedule.service.category.name}
            </p>
            <p className="flex gap-2">
              <Pickaxe className="inline-block " />
              Serviço: {schedule.service.name}
            </p>
            <div className="flex gap-6">
              <p className="flex gap-2">
                <Calendar className="inline-block " />
                Data: {formatDatePtBr(String(schedule.date))}
              </p>
              <p className="flex gap-2">
                <Clock className="inline-block " />
                Horário: {schedule.time}
              </p>
            </div>

            <p className="flex gap-2">
              <MapPin className="inline-block " />
              Status: {schedule.status}
            </p>
            <p className="flex gap-2">
              <HomeIcon className="inline-block " />
              Endereço: {schedule.address.street},N°{schedule.address.number},
              {schedule.address.city},{schedule.address.zipCode},
              {schedule.address.state}
            </p>

            <p>Descrição: {schedule.description}</p>
          </CardContent>
          <CardFooter className="w-full flex gap-2">
            {schedule.status === "AGENDADO" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">Iniciar</Button>
                </AlertDialogTrigger>
                <ScheduleStart
                  appointment={schedule}
                  handleStartSchedule={scheduleToStart}
                  isLoadingStart={isLoadingStart}
                />
              </AlertDialog>
            )}
            {schedule.status === "EM_ANDAMENTO" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full" variant="destructive">
                    Pausar
                  </Button>
                </AlertDialogTrigger>
                <SchedulePause
                  appointment={schedule}
                  isLoadingPause={isLoadingPause}
                  handlePauseSchedule={scheduleToPause}
                />
              </AlertDialog>
            )}
            {schedule.status === "PAUSADO" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">Continuar</Button>
                </AlertDialogTrigger>
                <ScheduleRestart
                  appointment={schedule}
                  handleRestartSchedule={scheduleToRestart}
                  isLoadingRestart={isLoadingRestart}
                />
              </AlertDialog>
            )}
            {schedule.status === "EM_ANDAMENTO" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full">Finalizar</Button>
                </AlertDialogTrigger>
                <ScheduleFinish
                  appointment={schedule}
                  handleFinishSchedule={scheduleToFinish}
                  isLoadingFinish={isLoadingFinish}
                />
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  );
}
