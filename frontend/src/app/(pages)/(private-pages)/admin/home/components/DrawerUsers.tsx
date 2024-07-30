import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { User } from "@/types/User";
import { X } from "lucide-react";
import { TransformToProvider } from "./TransformToProvider";
import { DeleteUser } from "./DeleteUser";
import { Loading } from "@/components/Loading";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditUser } from "./EditUser";
import { SchedulesProvider } from "./SchedulesProvider";

export function DrawerUsers({ user }: { user?: User }) {
  if (!user) {
    return (
      <DrawerContent className="bg-gray-100">
        <div className="mx-auto w-full max-w-sm md:max-w-3xl">
          <Loading />
        </div>
      </DrawerContent>
    );
  }

  return (
    <DrawerContent className="bg-gray-100">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <DrawerHeader className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <DrawerTitle>{user.name}</DrawerTitle>
            <DrawerDescription>{user.role}</DrawerDescription>
          </div>
          <DrawerClose>
            <X />
          </DrawerClose>
        </DrawerHeader>
        <div></div>
        <DrawerFooter>
          {user.role === "PRESTADOR" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Ver serviços prestados</Button>
              </DialogTrigger>
              <SchedulesProvider user={user} />
            </Dialog>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Editar</Button>
            </DialogTrigger>
            <EditUser user={user} />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Tornar Prestador</Button>
            </AlertDialogTrigger>
            <TransformToProvider user={user} />
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Excluir</Button>
            </AlertDialogTrigger>
            <DeleteUser user={user} />
          </AlertDialog>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
