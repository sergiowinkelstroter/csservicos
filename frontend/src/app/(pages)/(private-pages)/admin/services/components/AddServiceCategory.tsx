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
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

export function AddServiceCategory({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: createServiceCategory, isLoading } = useMutation({
    mutationKey: ["services"],
    mutationFn: async () => {
      const response = await api.post("/services/categories/register", {
        name: name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  async function handleNewServiceCategory(e: any) {
    e.preventDefault();
    if (!name) {
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Nome obrigatório",
      });
      return;
    }
    try {
      await createServiceCategory();
      setOpen(false);
      setName("");
      toast({
        title: "Sucesso!",
        description: "Categoria criada com sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao criar a categoria",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar categoria</DialogTitle>
      </DialogHeader>
      <form className="flex flex-col gap-4" onSubmit={handleNewServiceCategory}>
        <div>
          <Label>Nome</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => setName("")}>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="bg-orage uppercase font-bold"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
