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

interface ScheduleFinishProps {
  appointment: Schedule;
  isLoadingFinish: boolean;
  handleFinishSchedule: (id: number) => void;
}

export const ScheduleFinish = ({
  appointment,
  isLoadingFinish,
  handleFinishSchedule,
}: ScheduleFinishProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Concluir serviço {appointment.title}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Tem certeza que deseja concluir este serviço?
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoadingFinish}
            onClick={() => handleFinishSchedule(appointment.id)}
          >
            {isLoadingFinish ? <Loading /> : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
