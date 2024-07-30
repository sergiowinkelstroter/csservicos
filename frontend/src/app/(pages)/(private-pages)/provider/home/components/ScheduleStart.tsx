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

interface ScheduleStartProps {
  appointment: Schedule;
  isLoadingStart: boolean;
  handleStartSchedule: (id: number) => void;
}

export const ScheduleStart = ({
  appointment,
  isLoadingStart,
  handleStartSchedule,
}: ScheduleStartProps) => {
  console.log(appointment);

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Iniciar serviço {appointment.title}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Tem certeza que deseja cameçar este serviço?
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoadingStart}
            onClick={() => handleStartSchedule(appointment.id)}
          >
            {isLoadingStart ? <Loading /> : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
