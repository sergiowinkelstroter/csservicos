"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { z } from "zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { api } from "@/lib/axios";
import { Button } from "./ui/button";
import { Address } from "@/types/Address";
import { useState } from "react";

const formSchema = z.object({
  street: z.string().min(1, "A rua é obrigatória"),
  number: z.string().min(1, "O número é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  zipCode: z.string().min(1, "O CEP é obrigatório"),
});

type formType = z.infer<typeof formSchema>;

interface AddNewAddressProps {
  userId: number;
  address?: Address;
  setOpen: (open: boolean) => void;
}

export const AddNewAddress = ({
  userId,
  address,
  setOpen,
}: AddNewAddressProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: address?.city,
      state: address?.state,
      zipCode: address?.zipCode,
      number: String(address?.number),
      street: address?.street,
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: addNewAddress, isLoading } = useMutation({
    mutationFn: async (data: formType) => {
      const response = await api.post("/adresses/register", {
        userId: userId,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        number: Number(data.number),
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleAddNewAddress(data: formType) {
    try {
      await addNewAddress(data);
      setOpen(false);
      reset();
      toast({
        title: "Sucesso",
        description: "Endereço adicionado",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar endereço",
        variant: "destructive",
      });
    }
  }

  const { mutateAsync: editAddress, isLoading: editAddressIsLoading } =
    useMutation({
      mutationFn: async (data: formType) => {
        const response = await api.put(`/adresses/edit/${address?.id}`, {
          userId: userId,
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          number: Number(data.number),
        });

        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  async function handleEditAddress(data: formType) {
    try {
      await editAddress(data);
      setOpen(false);
      reset();
      toast({
        title: "Sucesso",
        description: "Endereço editado",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao editar endereço",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo Endereço</DialogTitle>
        <DialogDescription>Adicione um novo endereço</DialogDescription>
      </DialogHeader>
      <form
        onSubmit={
          address
            ? handleSubmit(handleEditAddress)
            : handleSubmit(handleAddNewAddress)
        }
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <Label>Rua</Label>
          <Input type="text" {...register("street")} required />
          {errors.street && (
            <span className="text-red-500">{errors.street.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Número</Label>
          <Input type="text" {...register("number")} required />
          {errors.number && (
            <span className="text-red-500">{errors.number.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Cidade</Label>
          <Input type="text" {...register("city")} required />
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Estado</Label>
          <Input type="text" {...register("state")} required />
          {errors.state && (
            <span className="text-red-500">{errors.state.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>CEP</Label>
          <Input type="text" {...register("zipCode")} required />
          {errors.zipCode && (
            <span className="text-red-500">{errors.zipCode.message}</span>
          )}
        </div>
        <DialogFooter className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          {address ? (
            <Button type="submit">
              {isLoading ? "Carregando..." : "Editar"}
            </Button>
          ) : (
            <Button type="submit">
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          )}
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
