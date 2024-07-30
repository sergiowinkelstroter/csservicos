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

interface SchedulePauseProps {
  appointment: Schedule;
  isLoadingPause: boolean;
  handlePauseSchedule: (id: number) => void;
}

export const SchedulePause = ({
  appointment,
  isLoadingPause,
  handlePauseSchedule,
}: SchedulePauseProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Pausar serviço {appointment.title}</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Tem certeza que deseja pausar este serviço?
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoadingPause}
            onClick={() => handlePauseSchedule(appointment.id)}
          >
            {isLoadingPause ? <Loading /> : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
