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

interface ScheduleDeletarProps {
  appointment: Schedule;
  isLoadingDeletar: boolean;
  handleDeletarSchedule: (id: number) => void;
}

export const ScheduleDeletar = ({
  appointment,
  isLoadingDeletar,
  handleDeletarSchedule,
}: ScheduleDeletarProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Excluir agendamento {appointment.title}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        Tem certeza que deseja excluir este agendamento?
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            disabled={isLoadingDeletar}
            onClick={() => handleDeletarSchedule(appointment.id)}
          >
            {isLoadingDeletar ? <Loading /> : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
