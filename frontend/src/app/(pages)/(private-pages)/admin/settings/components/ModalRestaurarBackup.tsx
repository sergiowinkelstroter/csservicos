import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { User } from "@/types/User";

import { useContext, useState } from "react";
import { AdminContext } from "@/contexts/Admin";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function ModalRestaurarBackup({ backupId }: { backupId: number }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setOpenBackupDrawer, setOpenRestoreDrawer } =
    useContext(AdminContext);

  const { data: users } = useQuery("users", async () => {
    const response = await api.get("/users");
    return response.data;
  });
  const { mutateAsync: restoreBackup } = useMutation({
    mutationFn: async () => {
      await api.put(`/backups/restore/${backupId}&userId=${selectedUserId}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries("backups");
    },
  });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  function handleSelectUser(userId: number) {
    if (selectedUserId === userId) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  }

  async function handleRestoreBackup() {
    try {
      await restoreBackup();
      setOpenRestoreDrawer(false);
      setOpenBackupDrawer(false);
      toast({
        title: "Sucesso",
        description: "O backup foi restaurado com sucesso",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar o backup",
        variant: "destructive",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Restaurar</DialogTitle>
        <DialogDescription>
          Escolha um usuario para restaurar o backup
        </DialogDescription>
      </DialogHeader>
      <div>
        {users?.map((user: User) => (
          <div key={user.id} className="flex items-center gap-1">
            <Checkbox
              checked={selectedUserId === user.id}
              onClick={() => handleSelectUser(user.id)}
            />
            <div>{user.name}</div>
          </div>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"outline"}>Cancelar</Button>
        </DialogClose>
        <Button onClick={handleRestoreBackup}>Restaurar</Button>
      </DialogFooter>
    </DialogContent>
  );
}
