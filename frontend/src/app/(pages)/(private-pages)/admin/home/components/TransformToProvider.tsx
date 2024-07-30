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

export function TransformToProvider({ user }: { user: User }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setOpenUsersDetails } = useContext(AdminContext);

  const { mutateAsync: transformToProvider, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/users/update-role`, {
        newRole: "PRESTADOR",
        userId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    mutationKey: ["users"],
  });

  async function handleTransformToProvider() {
    try {
      await transformToProvider();
      setOpenUsersDetails(false);
      toast({
        title: "Sucesso!",
        description: "O usuário foi transformado em Prestador!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao transformar o usuário em Prestador",
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
          <Button onClick={handleTransformToProvider} disabled={isLoading}>
            {isLoading ? "Carregando..." : "Confirmar"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
