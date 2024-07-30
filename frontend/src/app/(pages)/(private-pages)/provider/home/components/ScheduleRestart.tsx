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

interface ScheduleRestartProps {
  appointment: Schedule;
  isLoadingRestart: boolean;
  handleRestartSchedule: (id: number) => void;
}

export const ScheduleRestart = ({
  appointment,
  isLoadingRestart,
  handleRestartSchedule,
}: ScheduleRestartProps) => {
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
            disabled={isLoadingRestart}
            onClick={() => handleRestartSchedule(appointment.id)}
          >
            {isLoadingRestart ? <Loading /> : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
