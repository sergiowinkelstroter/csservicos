import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { User } from "@/types/User";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

interface NotificationProps {
  user: User;
}

export const Notification = ({ user }: NotificationProps) => {
  const [isChecked, setIsChecked] = useState(
    user.notification === "A" ? true : false || false
  );

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    mutateAsync: updateNotifications,
    isLoading: updateNotificationsLoading,
  } = useMutation({
    mutationKey: ["users"],
    mutationFn: async () => {
      setIsChecked(!isChecked);
      console.log("teste");
      const response = await api.put(`users/update-notification/${user.id}`, {
        notification: isChecked ? "I" : "A",
      });

      console.log(response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Sucesso",
        description: "Notificações atualizadas",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar notificações",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>Configurações das notificações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className="flex justify-between items-center py-6 px-4">
          <p className="text-sm font-medium">
            Receber notificações via WhatsApp
          </p>
          <Switch
            disabled={updateNotificationsLoading}
            checked={isChecked}
            onCheckedChange={() => updateNotifications()}
          />
        </Card>
      </CardContent>
    </Card>
  );
};
