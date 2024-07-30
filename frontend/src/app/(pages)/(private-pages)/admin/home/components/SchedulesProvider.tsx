import { Loading } from "@/components/Loading";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { Schedule } from "@/types/Schedule";
import { User } from "@/types/User";
import { formatDatePtBr } from "@/utils/formatedDateBr";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "react-query";

export const SchedulesProvider = ({ user }: { user: User }) => {
  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await api.get(`/schedules/provider/list/${user.id}`);
      return response.data;
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Serviços</DialogTitle>
        <DialogDescription>
          Serviços prestados por: {user.name}
        </DialogDescription>
      </DialogHeader>
      <div>
        {isLoading || schedules === undefined ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="p-2 px-4 rounded-md border text-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <h3>{schedule.title}</h3>
                    <p className="text-xs text-gray-600">
                      {schedule.service.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p>{formatDatePtBr(String(schedule.date))}</p>
                    <p>{schedule.time}</p>
                  </div>
                </div>
                <div>
                  <p>Status: {schedule.status}</p>
                  <p>Agendado por: {schedule.user.name}</p>
                </div>
                <p>Descricão: {schedule.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DialogContent>
  );
};
