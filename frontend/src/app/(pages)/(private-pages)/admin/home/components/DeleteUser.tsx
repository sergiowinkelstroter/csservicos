"use client";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AdminContext } from "@/contexts/Admin";

import { api } from "@/lib/axios";
import { User } from "@/types/User";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

export function DeleteUser({ user }: { user: User }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setOpenUsersDetails } = useContext(AdminContext);

  const { mutateAsync: DeleteUser, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/users/delete/${user.id}`);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    mutationKey: ["users"],
  });

  async function handleDeleteUser() {
    try {
      await DeleteUser();
      setOpenUsersDetails(false);
      toast({
        title: "Sucesso!",
        description: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar o usuário",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Transformar usuário em Prestador</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <p>Tem certeza que deseja transformar {user.name} em Prestador?</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant={"outline"}>Cancelar</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button onClick={handleDeleteUser} disabled={isLoading}>
            {isLoading ? "Carregando..." : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
