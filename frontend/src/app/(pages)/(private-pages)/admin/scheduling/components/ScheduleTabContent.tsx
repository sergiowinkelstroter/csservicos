import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Schedule } from "@/types/Schedule";
import { ScheduleCard } from "./ScheduleCard";

const ScheduleTabContent = ({
  schedules,
  title,
  description,
}: {
  schedules: Schedule[];
  title: string;
  description: string;
}) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="flex justify-center items-center">
            <p className="text-sm text-muted-foreground"> Nenhum agendamento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((appointment) => (
              <ScheduleCard key={appointment.id} schedule={appointment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleTabContent;
