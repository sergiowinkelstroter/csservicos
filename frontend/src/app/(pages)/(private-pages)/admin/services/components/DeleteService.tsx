import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/Service";

export function DeleteService({ service }: { service: Service }) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir serviço</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <p>Deseja realmente excluir o serviço {service.name}?</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" type="submit">
            Excluir
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
