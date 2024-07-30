import { Schedule } from "@/types/Schedule";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../../../../../components/ui/button";
import Image from "next/image";
import { Calendar, Clock, Home, List, MapPin, X } from "lucide-react";
import { formatDatePtBr } from "@/utils/formatedDateBr";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScheduleDeletar } from "./ScheduleDelete";
import { Dispatch, SetStateAction, useState } from "react";
import { ScheduleCancel } from "./ScheduleCancel";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModaldAddSchedule } from "@/components/ModaldAddSchedule";

interface ScheduleDetailsProps {
  data: Schedule;
  cancelSchedule: (id: number) => void;
  deleteSchedule: (id: number) => void;
  isLoadingCancel: boolean;
  isLoadingDelete: boolean;
  setOpen: (open: boolean) => void;
}

export const ScheduleDetails = ({
  data,
  cancelSchedule,
  deleteSchedule,
  isLoadingCancel,
  isLoadingDelete,
  setOpen,
}: ScheduleDetailsProps) => {
  return (
    <>
      <DrawerContent className="bg-gray-100">
        <div className="mx-auto w-full max-w-sm md:max-w-3xl">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>{data.title}</DrawerTitle>
            <DrawerClose>
              <X />
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-col items-center gap-6 p-6">
            <Image
              src={`http://localhost:3002/uploads/${data.service.image}`}
              alt={data.title}
              width={300}
              height={300}
              className="rounded-md shadow-lg"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <DetailItem
                icon={<List />}
                label="Tipo de Serviço"
                value={data.service.category.name}
              />
              <DetailItem
                icon={<Calendar />}
                label="Data"
                value={formatDatePtBr(String(data.date))}
              />
              <DetailItem
                icon={<Clock />}
                label="Horário"
                value={`${data.time} hrs`}
              />
              <DetailItem
                icon={<Home />}
                label="Endereço"
                value={`${data.address.street}, ${data.address.number}, ${data.address.city}, ${data.address.zipCode}, ${data.address.state}`}
              />
              <DetailItem
                icon={<MapPin />}
                label="Status"
                value={data.status}
              />
              <div className="col-span-1 md:col-span-2">
                <p className="text-lg">
                  <strong>Descrição:</strong> {data.description}
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Refazer agendamento</Button>
              </DialogTrigger>
              <ModaldAddSchedule schedule={data} setOpen={setOpen} />
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                {data.status !== "CONCLUIDO" && data.status !== "CANCELADO" && (
                  <Button variant="destructive" disabled={isLoadingCancel}>
                    Cancelar agendamento
                  </Button>
                )}
              </AlertDialogTrigger>
              <ScheduleCancel
                appointment={data}
                isLoadingCancel={isLoadingCancel}
                handleCancelSchedule={cancelSchedule}
              />
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isLoadingDelete}>
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <ScheduleDeletar
                appointment={data}
                isLoadingDeletar={isLoadingDelete}
                handleDeletarSchedule={deleteSchedule}
              />
            </AlertDialog>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => {
  return (
    <p className="flex items-center gap-2 text-sm">
      <span className="inline-block">{icon}</span>
      <strong>{label}:</strong> {value}
    </p>
  );
};
