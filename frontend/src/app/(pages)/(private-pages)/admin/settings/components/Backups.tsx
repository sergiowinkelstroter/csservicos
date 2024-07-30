import { Button } from "@/components/ui/button";
import { BackupList } from "./BackupList";
import { Loading } from "@/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Backups = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutateAsync: createBackup } = useMutation({
    mutationKey: ["backups"],
    mutationFn: async () => {
      const response = await api.post("/backups/register");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("backups");
    },
  });

  async function handleCreateBackup() {
    try {
      await createBackup();
      toast({
        description: "Backup criado com sucesso!",
        title: "Sucesso!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Erro ao criar o backup",
        title: "Algo de errado aconteceu!!",
        variant: "destructive",
      });
    }
  }

  const { data: backups } = useQuery("backups", async () => {
    const response = await api.get("/backups/list");
    return response.data;
  });

  if (backups === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Backups</CardTitle>
        <CardDescription>Configurações de backups</CardDescription>
      </CardHeader>
      <CardContent>
        <BackupList data={backups} />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Criar</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Criar backup</AlertDialogTitle>
              <AlertDialogDescription>
                Clique aqui para criar um backup.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant={"default"}
                  onClick={() => handleCreateBackup()}
                >
                  Criar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
