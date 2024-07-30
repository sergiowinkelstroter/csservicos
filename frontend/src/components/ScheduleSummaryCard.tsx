import { Schedule } from "@/types/Schedule";
import { Calendar, Clock, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDatePtBr } from "@/utils/formatedDateBr";

export interface ScheduleSummaryCardProps {
  data: Schedule;
}

export const ScheduleSummaryCard = ({ data }: ScheduleSummaryCardProps) => {
  return (
    <Card className="mb-2 bg-orage text-white">
      <CardHeader>
        <CardTitle className="text-xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        <p>{data.description}</p>
        {data.status === "PAUSADO" && (
          <div className="flex gap-2 items-center bg-orange-400 rounded-md p-2 justify-center">
            <Pause /> <p>Serviço Pausado</p>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2  items-center justify-center">
            <Clock className="" />
            <span>{data.time} hrs</span>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <Calendar className="" />
            <span> {formatDatePtBr(String(data.date))}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
