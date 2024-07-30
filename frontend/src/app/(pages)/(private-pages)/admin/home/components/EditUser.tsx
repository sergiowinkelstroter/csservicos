import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { User } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  fone: z.string().min(1, "O telefone é obrigatório"),
});

type formType = z.infer<typeof formSchema>;

export function EditUser({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      fone: user.fone,
    },
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: updateUser, isLoading } = useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: formType) => {
      const response = await api.post(`/users/edit/${user.id}`, {
        name: data.name,
        email: data.email,
        fone: data.fone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleUpdateUser(data: formType) {
    try {
      await updateUser(data);
      toast({
        title: "Sucesso!",
        description: "Usuário editado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao editar o usuário",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar dados de {user.name}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={handleSubmit(handleUpdateUser)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <Label>Nome</Label>
          <Input type="text" {...register("name")} required />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" {...register("email")} required />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Telefone</Label>
          <Input type="text" {...register("fone")} required />
          {errors.fone && <p className="text-red-500">{errors.fone.message}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Editando..." : "Editar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
