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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { z } from "zod";

interface EditServiceCategoryProps {
  setOpen: (open: boolean) => void;
  serviceC: {
    id: number;
    name: string;
  };
}

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
});

type formType = z.infer<typeof formSchema>;

export function EditServiceCategory({
  setOpen,
  serviceC,
}: EditServiceCategoryProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: serviceC.name,
    },
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: editServiceCategory, isLoading } = useMutation({
    mutationKey: ["services"],
    mutationFn: async (data: formType) => {
      const response = await api.put(
        `/services/categories/edit/${serviceC.id}`,
        {
          name: data.name,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  async function handleNewServiceCategory(data: formType) {
    try {
      await editServiceCategory(data);
      setOpen(false);
      toast({
        title: "Sucesso!",
        description: "Categoria editada com sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao editar a categoria",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar categoria</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleNewServiceCategory)}
      >
        <div>
          <Label>Nome</Label>
          <Input type="text" {...register("name")} />
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <DialogFooter className="mt-6">
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Excluir
          </Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="bg-orage uppercase font-bold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
