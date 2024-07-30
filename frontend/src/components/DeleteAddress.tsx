import { Address } from "@/types/Address";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "react-query";
import { useToast } from "./ui/use-toast";
import { api } from "@/lib/axios";

export const DeleteAddress = ({ address }: { address: Address }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync: deleteAddress, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/adresses/delete/${address.id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  async function handleDeleteAddress() {
    try {
      await deleteAddress();
      toast({
        description: "Endereço excluído com sucesso",
      });
    } catch (error) {
      toast({
        description: "Erro ao excluir endereço",
      });
    }
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir endereço</AlertDialogTitle>
      </AlertDialogHeader>
      <div>
        <p>
          Tem certeza que deseja excluir o endereço da rua{" "}
          <span className="font-bold">{address.street}</span>,{" "}
          <span className="font-bold">
            N°
            {address.number}?
          </span>
        </p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            onClick={handleDeleteAddress}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
