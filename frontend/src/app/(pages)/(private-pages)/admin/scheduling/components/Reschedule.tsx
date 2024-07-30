import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "@/lib/axios";

import { Service } from "@/types/Service";
import { Address } from "@/types/Address";

import { Schedule } from "@/types/Schedule";
import { getUserProfile } from "@/utils/getUserProfile";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const scheduleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  services: z.string().min(1, "Serviço é obrigatório"),
  address: z.string().min(1, "Endereço é obrigatório"),
  date: z
    .string()
    .min(1, "Data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido"),
  time: z
    .string()
    .min(1, "Hora é obrigatória")
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido"),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ModalAddScheduleProps {
  schedule?: Schedule;
  setOpen: (open: boolean) => void;
}

export const Reschedule = ({ schedule, setOpen }: ModalAddScheduleProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: schedule?.title,
      description: schedule?.description,
      services: String(schedule?.service.id),
      address: String(schedule?.address.id),
      date: new Date().toISOString().split("T")[0],
      time: String(schedule?.time),
    },
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: createSchedule, isLoading: isLoadingCreate } =
    useMutation({
      mutationFn: async (data: ScheduleFormValues) => {
        const response = await api.post("/schedules/register", {
          serviceId: Number(data.services),
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          status: "A_CONFIRMAR",
          addressId: Number(data.address),
          userId: Number(schedule?.userId),
        });
        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      await createSchedule(data);

      setOpen(false);
      toast({
        title: "Sucesso!",
        description: "Agendamento criado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao criar o agendamento",
      });
    }
  };

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services/list");
      return response.data;
    },
  });

  const { data: adresses, isLoading: isLoadingAdresses } = useQuery<Address[]>({
    queryKey: ["adresses"],
    queryFn: async () => {
      const response = await api.get(`/adresses/list/${schedule?.userId}`);
      return response.data;
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendamento</DialogTitle>
        <DialogDescription>
          Faça o agendamento de um dos nossos serviços
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Título
          </Label>
          <Input
            id="title"
            type="text"
            {...register("title")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Data
            </Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date.message}</p>
            )}
          </div>
          <div>
            <Label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700"
            >
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              {...register("time")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {errors.time && (
              <p className="text-red-600 text-sm">{errors.time.message}</p>
            )}
          </div>
        </div>
        <div>
          <Label
            htmlFor="services"
            className="block text-sm font-medium text-gray-700"
          >
            Serviços
          </Label>
          <Controller
            control={control}
            name="services"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="0">Carregando...</SelectItem>
                  ) : (
                    services?.map((service, index) => (
                      <SelectItem key={index} value={String(service.id)}>
                        {service.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.services && (
            <p className="text-red-600 text-sm">{errors.services.message}</p>
          )}
        </div>
        <div>
          <Label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Endereço
          </Label>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingAdresses ? (
                    <SelectItem value="0">Carregando...</SelectItem>
                  ) : (
                    adresses?.map((adress, index) => (
                      <SelectItem key={index} value={String(adress.id)}>
                        {`${adress.street}, N°${adress.number}, ${adress.city}, ${adress.zipCode}, ${adress.state}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.address && (
            <p className="text-red-600 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description.message}</p>
          )}
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-orage text-white"
            disabled={isLoading}
          >
            Agendar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
