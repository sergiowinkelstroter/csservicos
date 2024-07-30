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
import { api } from "@/lib/axios";
import { Service, ServiceCategory } from "@/types/Service";
import { useMutation, useQueryClient } from "react-query";

export function DeleteCategory({ category }: { category: ServiceCategory }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteCategory, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/services/category/${category.id}`);

      return response.data;
    },
    mutationKey: ["servicesCategories"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicesCategories"] });
    },
  });

  async function handleDeleteCategory() {
    try {
      await deleteCategory();
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao deletar a categoria",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <p>Deseja realmente excluir o categoria {category.name}?</p>
        <p>Essa ação tambem apagará todos os serviços relacionados.</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            variant="destructive"
            type="submit"
            onClick={handleDeleteCategory}
            disabled={isLoading}
          >
            Excluir
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
