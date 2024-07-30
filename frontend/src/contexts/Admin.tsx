"use client";
import { createContext, useState } from "react";

interface AdminContextProps {
  children: React.ReactNode;
}

interface AdminContextData {
  openUsersDetails: boolean;
  setOpenUsersDetails: (open: boolean) => void;
  openBackupDrawer: boolean;
  setOpenBackupDrawer: (open: boolean) => void;
  openRestoreDrawer: boolean;
  setOpenRestoreDrawer: (open: boolean) => void;
}

export const AdminContext = createContext({} as AdminContextData);

export const AdminProvider = ({ children }: AdminContextProps) => {
  const [openUsersDetails, setOpenUsersDetails] = useState(false);
  const [openBackupDrawer, setOpenBackupDrawer] = useState(false);
  const [openRestoreDrawer, setOpenRestoreDrawer] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        openUsersDetails,
        setOpenUsersDetails,
        openBackupDrawer,
        setOpenBackupDrawer,
        openRestoreDrawer,
        setOpenRestoreDrawer,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
