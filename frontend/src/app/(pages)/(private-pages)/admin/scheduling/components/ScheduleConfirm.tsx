import { Loading } from "@/components/Loading";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/types/Schedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";

interface ScheduleConfirmProps {
  appointment: Schedule;
  isLoadingConfirm: boolean;
  handleConfirmSchedule: (data: formType) => void;
}

const formSchema = z.object({
  id: z.number(),
  providerId: z.string().min(1, "Selecione o prestador"),
});

type formType = z.infer<typeof formSchema>;

export const ScheduleConfirm = ({
  appointment,
  isLoadingConfirm,
  handleConfirmSchedule,
}: ScheduleConfirmProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: appointment.id,
    },
  });

  const { data: providers, isLoading } = useQuery<User[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      const response = await api.get("/users/providers/list");
      return response.data;
    },
  });

  return (
    <AlertDialogContent>
      <form onSubmit={handleSubmit(handleConfirmSchedule)}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmar agendamento {appointment.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Selecione o prestador para confirmar o agendamento
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Input
            className="hidden"
            {...register("id")}
            value={appointment.id}
          />
          <Controller
            control={control}
            name="providerId"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="0">Carregando...</SelectItem>
                  ) : (
                    providers?.map((provider, index) => (
                      <SelectItem key={index} value={String(provider.id)}>
                        {provider.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600"
              disabled={isLoadingConfirm}
              type="submit"
            >
              {isLoadingConfirm ? <Loading /> : "Confirmar"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  );
};
