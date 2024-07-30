import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/axios";

const formSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  oldPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type formType = z.infer<typeof formSchema>;

export const ModalAlterarPassword = ({ userId }: { userId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: updatePassword, isLoading: updatePasswordIsLoading } =
    useMutation({
      mutationFn: async (data: formType) => {
        const res = await api.put(`/users/change-password/${userId}`, {
          password: data.password,
          oldPassword: data.oldPassword,
        });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });

  async function handleUpdatePassword(data: formType) {
    try {
      await updatePassword(data);
      toast({
        title: "Sucesso",
        description: "Senha alterada",
      });
      reset();
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha",
      });
    }
  }

  return (
    <DialogContent>
      <form action="" onSubmit={handleSubmit(handleUpdatePassword)}>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <Label>Senha atual</Label>
            <Input type="password" {...register("oldPassword")} />
            {errors.oldPassword && (
              <p className="text-red-500">{errors.oldPassword.message}</p>
            )}
          </div>
          <div>
            <Label>Nova senha</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Alterar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
