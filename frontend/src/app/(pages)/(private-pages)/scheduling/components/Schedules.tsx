"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { NavigationViewer } from "@/components/NavigationViewer";
import {
  ArrowRightCircle,
  Ban,
  Blocks,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  List,
  MapPin,
  Pickaxe,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { ModaldAddSchedule } from "@/components/ModaldAddSchedule";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { api } from "@/lib/axios";
import { Loading } from "@/components/Loading";
import { Schedule } from "@/types/Schedule";
import { formatDatePtBr } from "@/utils/formatedDateBr";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleDetails } from "@/app/(pages)/(private-pages)/scheduling/components/ScheduleDetails";
import { useContext, useState } from "react";
import { ScheduleCancel } from "./ScheduleCancel";
import { ScheduleContext } from "@/contexts/Schedules";
import { User } from "@/types/User";

interface SchedulesProps {
  user: User;
}

export default function Schedules({ user }: SchedulesProps) {
  const { openSchedulesDetails, setOpenSchedulesDetails } =
    useContext(ScheduleContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutateAsync: cancelSchedule, isLoading: isLoadingCancel } =
    useMutation({
      mutationFn: async (id: number) => {
        const response = await api.put(`/schedules/edit/${id}`, {
          status: "CANCELADO",
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function handleCancelSchedule(id: number) {
    try {
      const res = await cancelSchedule(id);
      setOpenSchedulesDetails(false);
      toast({
        title: "Sucesso!",
        description: "Agendamento cancelado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao excluir o agendamento",
      });
    }
  }

  const { mutateAsync: deleteSchedule, isLoading: isLoadingDelete } =
    useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/schedules/delete/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function handleDeleteSchedule(id: number) {
    try {
      const res = await deleteSchedule(id);
      setOpenSchedulesDetails(false);
      toast({
        title: "Sucesso!",
        description: "Agendamento excluído com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao excluir o agendamento",
      });
    }
  }

  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await api.get(`/schedules/list/${user.id}`);
      return response.data;
    },
  });

  if (schedules === undefined || isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <ContainerPage>
      <div className="flex items-center justify-between">
        <NavigationViewer
          data={[{ href: "/scheduling", prefix: "Agendamentos" }]}
        />
        <Link href="/settings">
          <ArrowRightCircle />
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Agendamentos</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orage uppercase font-bold">Agendar</Button>
          </DialogTrigger>
          <ModaldAddSchedule setOpen={setOpen} />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((appointment) => (
          <Card key={appointment.id} className="">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex-1"> {appointment.title}</CardTitle>
              <div className="flex items-center space-x-2">
                {appointment.status === "CONCLUIDO" && (
                  <CheckCircle color="green" />
                )}
                {appointment.status === "EM_ANDAMENTO" && (
                  <Pickaxe color="orange" />
                )}
                {appointment.status === "CANCELADO" && <Ban color="red" />}
                {appointment.status === "AGENDADO" && (
                  <Calendar color="green" />
                )}
                {appointment.status === "A_CONFIRMAR" && (
                  <Clock color="orange" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardContent className="flex flex-col gap-2">
                <p className="flex gap-2">
                  <List className="inline-block mr-2" />
                  Tipo de Serviço: {appointment.service.category.name}
                </p>
                <p className="flex gap-2">
                  <Calendar className="inline-block mr-2" />
                  Data: {formatDatePtBr(String(appointment.date))}
                </p>
                <p className="flex gap-2">
                  <Clock className="inline-block mr-2" />
                  Horário: {appointment.time}
                </p>
                <p className="flex gap-2">
                  <Home className="inline-block mr-2" />
                  Endereço: {appointment.address.street},
                  {appointment.address.number},{appointment.address.city},
                  {appointment.address.zipCode},{appointment.address.state}
                </p>
                <p className="flex gap-2">
                  <MapPin className="inline-block mr-2" />
                  Status: {appointment.status}
                </p>
                <p>Descrição: {appointment.description}</p>
              </CardContent>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <AlertDialog>
                {appointment.status !== "CONCLUIDO" &&
                  appointment.status !== "CANCELADO" && (
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="default"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                  )}
                <ScheduleCancel
                  appointment={appointment}
                  isLoadingCancel={isLoadingCancel}
                  handleCancelSchedule={handleCancelSchedule}
                />
              </AlertDialog>
              <Drawer
                open={openSchedulesDetails}
                onOpenChange={setOpenSchedulesDetails}
              >
                <DrawerTrigger asChild>
                  <Button variant="default" className="bg-orage">
                    Ver Detalhes
                  </Button>
                </DrawerTrigger>
                <ScheduleDetails
                  data={appointment}
                  cancelSchedule={handleCancelSchedule}
                  deleteSchedule={handleDeleteSchedule}
                  isLoadingCancel={isLoadingCancel}
                  isLoadingDelete={isLoadingDelete}
                  setOpen={setOpenSchedulesDetails}
                />
              </Drawer>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ContainerPage>
  );
}
