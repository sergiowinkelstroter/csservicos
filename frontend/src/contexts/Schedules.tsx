"use client";
import { createContext, useState } from "react";

interface ScheduleContextProps {
  children: React.ReactNode;
}

interface ScheduleContextData {
  openSchedulesDetails: boolean;
  setOpenSchedulesDetails: (open: boolean) => void;
  scheduleStatus: string;
  setScheduleStatus: (status: string) => void;
}

export const ScheduleContext = createContext({} as ScheduleContextData);

export const ScheduleProvider = ({ children }: ScheduleContextProps) => {
  const [openSchedulesDetails, setOpenSchedulesDetails] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState("a_confirmar");

  return (
    <ScheduleContext.Provider
      value={{
        openSchedulesDetails,
        setOpenSchedulesDetails,
        scheduleStatus,
        setScheduleStatus,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
