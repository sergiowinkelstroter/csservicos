import { Loading } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { ServiceCategory } from "@/types/Service";
import { Pencil, Trash } from "lucide-react";
import { useQuery } from "react-query";
import { EditServiceCategory } from "./EditServiceCategory";
import { useState } from "react";
import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteCategory } from "./DeleteCategoryService";
import { AddServiceCategory } from "./AddServiceCategory";

export const Categories = ({
  setOpenCategories,
}: {
  setOpenCategories: (open: boolean) => void;
}) => {
  const [openEditCategory, setOpenEditCategory] = useState<{
    [key: number]: boolean;
  }>({});
  const { data: categories, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["servicesCategories"],
    queryFn: async () => {
      const response = await api.get("/services/categories/list");
      return response.data;
    },
  });

  const handleOpenEditCategory = (categoryId: number, isOpen: boolean) => {
    setOpenEditCategory((prevState) => ({
      ...prevState,
      [categoryId]: isOpen,
    }));
  };

  if (isLoading || !categories) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <DrawerContent className="bg-gray-100">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Categorias</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <div
              className="flex items-center justify-between bg-gray-50 border p-2 px-4 rounded-md"
              key={category.id}
            >
              <p>{category.name}</p>
              <div className="flex gap-2 ">
                <Dialog
                  open={openEditCategory[category.id] || false}
                  onOpenChange={(isOpen) =>
                    handleOpenEditCategory(category.id, isOpen)
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant={"outline"} size={"icon"}>
                      <Pencil />
                    </Button>
                  </DialogTrigger>
                  <EditServiceCategory
                    serviceC={category}
                    setOpen={(isOpen) =>
                      handleOpenEditCategory(category.id, isOpen)
                    }
                  />
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"destructive"} size={"icon"}>
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <DeleteCategory category={category} />
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
        <DrawerFooter className="w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Adicionar</Button>
            </DialogTrigger>
            <AddServiceCategory setOpen={setOpenCategories} />
          </Dialog>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
};
