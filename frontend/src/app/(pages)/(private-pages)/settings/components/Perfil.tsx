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
import { AddNewAddress } from "@/components/AddNewAddress";
import { Pencil, Trash } from "lucide-react";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteAddress } from "@/components/DeleteAddress";

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
      <Card>
        <CardHeader>
          <CardTitle>Endereços</CardTitle>
          <CardDescription>Configurações dos endereços</CardDescription>
        </CardHeader>
        <CardContent className="w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {user?.addresses?.length ? (
            user.addresses.map((address, index) => (
              <Card key={address.id} className="bg-orage text-white">
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    {index + 1}° Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 font-semibold">
                  <div className="flex gap-1">
                    <span>Rua:</span>
                    <span> {address.street}</span>
                  </div>
                  <div className="flex gap-1">
                    <span>Número:</span>
                    <span> {address.number}</span>
                  </div>
                  <div className="flex gap-1">
                    <span>Cidade:</span>
                    <span> {address.city}</span>
                  </div>
                  <div className="flex gap-1">
                    <span>Estado:</span>
                    <span> {address.state}</span>
                  </div>
                  <div className="flex gap-1">
                    <span>CEP:</span>
                    <span> {address.zipCode}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-orage hover:text-orage hover:opacity-90 hover:transition-opacity"
                        variant={"outline"}
                        type="button"
                        size={"icon"}
                      >
                        <Pencil size={20} />
                      </Button>
                    </DialogTrigger>
                    <AddNewAddress
                      userId={user.id}
                      address={address}
                      setOpen={setOpenEdit}
                    />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="text-orage hover:text-orage hover:opacity-90 hover:transition-opacity"
                        variant={"outline"}
                        type="button"
                        size={"icon"}
                      >
                        <Trash size={20} />
                      </Button>
                    </AlertDialogTrigger>
                    <DeleteAddress address={address} />
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum endereço cadastrado
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Dialog open={openNewAddress} onOpenChange={setOpenNewAddress}>
            <DialogTrigger asChild>
              <Button className="">Novo endereço</Button>
            </DialogTrigger>
            <AddNewAddress userId={user.id} setOpen={setOpenNewAddress} />
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
};
