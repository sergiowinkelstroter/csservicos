"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { api } from "@/lib/axios";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ModalAlterarPassword } from "@/components/ModalAlterarPassword";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/User";

const perfilFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  fone: z.string(),
});

interface PerfilProps {
  user: User;
}

export const Perfil = ({ user }: PerfilProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof perfilFormSchema>>({
    resolver: zodResolver(perfilFormSchema),
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [openEdit, setOpenEdit] = useState(false);
  const [openNewAddress, setOpenNewAddress] = useState(false);

  const { mutateAsync: updateUser, isLoading: updateUserIsLoading } =
    useMutation({
      mutationFn: async (data: z.infer<typeof perfilFormSchema>) => {
        const res = await api.put(`/users/edit/${data.id}`, {
          name: data.name,
          email: data.email,
          fone: data.fone,
        });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  async function handleUpdateUser(data: z.infer<typeof perfilFormSchema>) {
    try {
      await updateUser(data);
      toast({
        title: "Sucesso",
        description: "Perfil atualizado",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Configurações da sua conta</CardDescription>
        </CardHeader>
        <Dialog>
          <form onSubmit={handleSubmit(handleUpdateUser)}>
            <CardContent className="w-full">
              <Input
                type="text"
                className="hidden"
                defaultValue={String(user?.id)}
                {...register("id")}
              />
              <div className="grid w-full grid-cols-1 sm:grid-cols-5 gap-2">
                <div className="col-span-2 flex flex-col gap-1">
                  <Label>Nome</Label>
                  <Input
                    type="text"
                    placeholder=""
                    required
                    defaultValue={user?.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    placeholder=""
                    required
                    defaultValue={user?.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <Label>Telefone</Label>
                  <Input
                    type="text"
                    placeholder="(12) 93456-7890"
                    required
                    defaultValue={user?.fone}
                    {...register("fone")}
                  />

                  {errors.fone && (
                    <span className="text-red-500">{errors.fone.message}</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant={"outline"} type="button">
                  Alterar senha
                </Button>
              </DialogTrigger>

              <Button type="submit" disabled={updateUserIsLoading}>
                {updateUserIsLoading ? "Carregando..." : "Salvar alterações"}
              </Button>
            </CardFooter>
          </form>
          <ModalAlterarPassword userId={user.id} />
        </Dialog>
      </Card>
    </>
  );
};
