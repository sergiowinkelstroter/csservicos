import { Schedule } from "@/types/Schedule";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Home,
  List,
  MapPin,
  Pickaxe,
  User,
} from "lucide-react";
import { formatDatePtBr } from "@/utils/formatedDateBr";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScheduleDeletar } from "./ScheduleDelete";
import { useSchedules } from "@/hooks/useSchedules";
import { ScheduleCancel } from "./ScheduleCancel";
import { ScheduleConfirm } from "./ScheduleConfirm";
import { ScheduleStart } from "./ScheduleStart";
import { ScheduleFinish } from "./ScheduleFinish";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModaldAddSchedule } from "@/components/ModaldAddSchedule";
import { Reschedule } from "./Reschedule";
import { useState } from "react";

export const ScheduleCard = ({ schedule }: { schedule: Schedule }) => {
  const {
    isLoading,
    isLoadingDelete,
    isLoadingCancel,
    isLoadingStart,
    isLoadingFinish,
    scheduleDelete,
    scheduleToCancel,
    scheduleToConfirm,
    scheduleToFinish,
    scheduleToStart,
  } = useSchedules();
  const [open, setOpen] = useState(false);

  return (
    <Card key={schedule.id} className="font-medium bg-gray-100">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex-1"> {schedule.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardContent className="flex flex-col gap-2">
          <p className="flex gap-2">
            <User className="inline-block mr-2" /> Agendado por:{" "}
            {schedule.user.name}
          </p>
          <p className="flex gap-2">
            <List className="inline-block mr-2" />
            Tipo de Serviço: {schedule.service.category.name}
          </p>
          <p className="flex gap-2">
            <Pickaxe className="inline-block mr-2" />
            Serviço: {schedule.service.name}
          </p>
          <p className="flex gap-2">
            <Calendar className="inline-block mr-2" />
            Data: {formatDatePtBr(String(schedule.date))}
          </p>
          <p className="flex gap-2">
            <Clock className="inline-block mr-2" />
            Horário: {schedule.time}
          </p>

          <p className="flex gap-2">
            <Home className="inline-block mr-2" />
            Endereço: {schedule.address.street},N°{schedule.address.number},
            {schedule.address.city},{schedule.address.zipCode},
            {schedule.address.state}
          </p>
          <p className="flex gap-2">
            <MapPin className="inline-block mr-2" />
            Status: {schedule.status}
          </p>
          {schedule.status !== "A_CONFIRMAR" && (
            <p className="flex gap-2">
              <User className="inline-block mr-2" />
              Prestador: {schedule?.provider?.name}
            </p>
          )}
          <p>Descrição: {schedule.description}</p>
        </CardContent>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Excluir</Button>
          </AlertDialogTrigger>
          <ScheduleDeletar
            appointment={schedule}
            isLoadingDeletar={isLoadingDelete}
            handleDeletarSchedule={scheduleDelete}
          />
        </AlertDialog>
        {schedule.status !== "CANCELADO" && schedule.status !== "CONCLUIDO" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Cancelar</Button>
            </AlertDialogTrigger>
            <ScheduleCancel
              appointment={schedule}
              isLoadingCancel={isLoadingCancel}
              handleCancelSchedule={scheduleToCancel}
            />
          </AlertDialog>
        )}
        {schedule.status === "A_CONFIRMAR" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Confirmar</Button>
            </AlertDialogTrigger>
            <ScheduleConfirm
              appointment={schedule}
              handleConfirmSchedule={scheduleToConfirm}
              isLoadingConfirm={isLoading}
            />
          </AlertDialog>
        )}
        {schedule.status === "AGENDADO" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Começar</Button>
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
              <Button>Concluido</Button>
            </AlertDialogTrigger>
            <ScheduleFinish
              appointment={schedule}
              handleFinishSchedule={scheduleToFinish}
              isLoadingFinish={isLoadingFinish}
            />
          </AlertDialog>
        )}
        {schedule.status === "CANCELADO" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Reagendar</Button>
            </DialogTrigger>
            <Reschedule schedule={schedule} setOpen={setOpen} />
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};
