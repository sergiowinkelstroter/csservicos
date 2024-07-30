import { User } from "@/types/User";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";

import { useContext } from "react";
import { Backup } from "@/types/Backup";
import { AdminContext } from "@/contexts/Admin";
import { formatDatePtBr } from "@/utils/formatedDateBr";
import { ModalRestaurarBackup } from "./ModalRestaurarBackup";

interface BackupDrawerProps {
  backup?: Backup;
}

export const BackupDrawer = ({ backup }: BackupDrawerProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setOpenBackupDrawer, openRestoreDrawer, setOpenRestoreDrawer } =
    useContext(AdminContext);
  const { mutateAsync: deleteBackup } = useMutation({
    mutationFn: async () => {
      await api.delete(`/backups/${backup?.id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("backups");
    },
  });

  const { mutateAsync: restoreFullBackup } = useMutation({
    mutationFn: async () => {
      await api.patch(`/backups/restoreFull/${backup?.id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("backups");
    },
  });

  if (backup === undefined) return null;

  async function handleDeleteBackup() {
    try {
      await deleteBackup();
      setOpenBackupDrawer(false); // fechar o drawer
      toast({
        title: "Sucesso",
        description: "Backup excluido com sucesso",
        color: "green",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir backup",
        color: "red",
      });
    }
  }

  async function handleRestoreFullBackup() {
    try {
      await restoreFullBackup();
      setOpenBackupDrawer(false); // fechar o drawer
      toast({
        title: "Sucesso",
        description: "Backup restaurado com sucesso",
        color: "green",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar backup",
        color: "red",
      });
    }
  }

  return (
    <DrawerContent className="bg-gray-100/90">
      <div className="mx-auto w-full max-w-sm">
        <DrawerHeader className="flex flex-row  justify-between">
          <div>
            <DrawerTitle>{backup.name.substring(0, 17)}</DrawerTitle>
            <DrawerDescription>
              {formatDatePtBr(String(backup.createdAt))}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerFooter>
          <Dialog open={openRestoreDrawer} onOpenChange={setOpenRestoreDrawer}>
            <DialogTrigger asChild>
              <Button>Restaurar por usuario</Button>
            </DialogTrigger>
            <ModalRestaurarBackup backupId={backup.id} />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Restaurar completo</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não podera ser desfeita
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleRestoreFullBackup();
                  }}
                >
                  Restaurar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Excluir</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não podera ser desfeita
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDeleteBackup();
                  }}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <Dialog open={openEditUser} onOpenChange={setOpenEditUser}>
            <DialogTrigger asChild>
              <Button variant={"default"}>Editar</Button>
            </DialogTrigger>
            <ModalEditUser setOpen={setOpenEditUser} user={user} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"default"}>Alterar senha</Button>
            </DialogTrigger>
            <ModalAdminAlterarSenha user={user} />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>
                {user.situacao === "A" ? "Bloquear" : "Desbloquear"}
              </Button>
            </AlertDialogTrigger>
            {user.situacao === "A" ? (
              <ModalBlockUser user={user} />
            ) : (
              <ModalRetirarBlockUser user={user} />
            )}
          </AlertDialog> */}
          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Excluir</Button>
            </AlertDialogTrigger>
            <ModalDeleteUser user={user} />
          </AlertDialog> */}
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
};
