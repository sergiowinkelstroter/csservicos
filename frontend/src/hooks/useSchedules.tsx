import { useToast } from "@/components/ui/use-toast";
import { ScheduleContext } from "@/contexts/Schedules";
import { api } from "@/lib/axios";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

export function useSchedules() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { setScheduleStatus } = useContext(ScheduleContext);

  const { mutateAsync: updateConfirmStatus, isLoading } = useMutation({
    mutationFn: async ({
      id,
      status,
      providerId,
    }: {
      id: number;
      status: string;
      providerId?: number;
    }) => {
      const response = await api.put(`/schedules/update-status/confirm/${id}`, {
        status: status,
        providerId: providerId ? providerId : null,
      });

      return response.data;
    },
    mutationKey: ["schedules"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  async function scheduleToConfirm({
    id,
    providerId,
  }: {
    id: number;
    providerId: string;
  }) {
    try {
      await updateConfirmStatus({
        id,
        status: "AGENDADO",
        providerId: Number(providerId),
      });
      setScheduleStatus("agendados");
      toast({
        title: "Sucesso!",
        description: "Agendamento confirmado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao confirmar o agendamento",
      });
    }
  }

  const { mutateAsync: updateStartStatus, isLoading: isLoadingStart } =
    useMutation({
      mutationFn: async ({
        id,
        status,
        providerId,
      }: {
        id: number;
        status: string;
        providerId?: number;
      }) => {
        const response = await api.put(`/schedules/update-status/start/${id}`, {
          status: status,
        });

        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleToStart(id: number) {
    try {
      await updateStartStatus({ id, status: "EM_ANDAMENTO" });
      setScheduleStatus("em_andamento");
      toast({
        title: "Sucesso!",
        description: "Agendamento iniciado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao iniciar o agendamento",
      });
    }
  }

  const { mutateAsync: updatePauseStatus, isLoading: isLoadingPause } =
    useMutation({
      mutationFn: async ({
        id,
        status,
        providerId,
      }: {
        id: number;
        status: string;
        providerId?: number;
      }) => {
        const response = await api.put(`/schedules/update-status/pause/${id}`, {
          status: status,
        });

        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleToPause(id: number) {
    try {
      await updatePauseStatus({ id, status: "PAUSADO" });
      toast({
        title: "Sucesso!",
        description: "Agendamento pausado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao pausar o agendamento",
      });
    }
  }

  const { mutateAsync: updateRestartStatus, isLoading: isLoadingRestart } =
    useMutation({
      mutationFn: async ({
        id,
        status,
        providerId,
      }: {
        id: number;
        status: string;
        providerId?: number;
      }) => {
        const response = await api.put(
          `/schedules/update-status/restart/${id}`,
          {
            status: status,
          }
        );

        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleToRestart(id: number) {
    try {
      await updateRestartStatus({ id, status: "EM_ANDAMENTO" });
      toast({
        title: "Sucesso!",
        description: "Agendamento reagendado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao reagendar o agendamento",
      });
    }
  }

  const { mutateAsync: updateFinishStatus, isLoading: isLoadingFinish } =
    useMutation({
      mutationFn: async ({
        id,
        status,
        providerId,
      }: {
        id: number;
        status: string;
        providerId?: number;
      }) => {
        const response = await api.put(
          `/schedules/update-status/finish/${id}`,
          {
            status: status,
          }
        );

        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleToFinish(id: number) {
    try {
      await updateFinishStatus({ id, status: "CONCLUIDO" });
      setScheduleStatus("concluidos");
      toast({
        title: "Sucesso!",
        description: "Agendamento concluido com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao concluir o agendamento",
      });
    }
  }

  const { mutateAsync: updateCancelStatus, isLoading: isLoadingCancel } =
    useMutation({
      mutationFn: async ({
        id,
        status,
        providerId,
      }: {
        id: number;
        status: string;
        providerId?: number;
      }) => {
        const response = await api.put(
          `/schedules/update-status/cancel/${id}`,
          {
            status: status,
          }
        );

        return response.data;
      },
      mutationKey: ["schedules"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleToCancel(id: number) {
    try {
      await updateCancelStatus({ id, status: "CANCELADO" });
      toast({
        title: "Sucesso!",
        description: "Agendamento cancelado com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao cancelar o agendamento",
      });
    }
  }

  const { mutateAsync: deleteSchedule, isLoading: isLoadingDelete } =
    useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/schedules/delete/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      },
    });

  async function scheduleDelete(id: number) {
    try {
      const res = await deleteSchedule(id);
      toast({
        title: "Sucesso!",
        description: "Agendamento excluído com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao excluir o agendamento",
      });
    }
  }

  return {
    scheduleToConfirm,
    scheduleToStart,
    scheduleToFinish,
    scheduleToCancel,
    scheduleToPause,
    scheduleDelete,
    scheduleToRestart,
    isLoadingDelete,
    isLoading,
    isLoadingStart,
    isLoadingFinish,
    isLoadingCancel,
    isLoadingPause,
    isLoadingRestart,
  };
}
