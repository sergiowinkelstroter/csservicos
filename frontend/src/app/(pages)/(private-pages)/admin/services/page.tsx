"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { Loading } from "@/components/Loading";
import { ModaldAddSchedule } from "@/components/ModaldAddSchedule";
import { NavigationViewer } from "@/components/NavigationViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { Service, ServiceCategory } from "@/types/Service";
import { ArrowRightCircle, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AddServiceCategory } from "./components/AddServiceCategory";
import { AddService } from "./components/AddService";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteService } from "./components/DeleteService";
import { EditServiceCategory } from "./components/EditServiceCategory";
import { Categories } from "./components/Categories";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { EditService } from "./components/EditService";

export default function Services() {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const [openAddService, setOpenAddService] = useState(false);
  const { data: services, isLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services/listByCategory");
      return response.data;
    },
  });
  // const [services, setServices] = useState<ServiceCategory[]>();

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     const response = await api.get("/services/listByCategory");
  //     setServices(response.data);
  //   };
  //   fetchServices();
  // }, []);

  if (services === undefined || isLoading) {
    <div className="w-full h-screen flex justify-center items-center">
      <Loading />
    </div>;
  }

  return (
    <ContainerPage>
      <div className="flex items-center justify-between">
        <NavigationViewer data={[{ href: "/services", prefix: "Serviços" }]} />
        <Link href="/admin/settings">
          <ArrowRightCircle />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Nossos Serviços</h2>
        <div className="flex gap-2">
          <Drawer open={openAddCategory} onOpenChange={setOpenAddCategory}>
            <DrawerTrigger asChild>
              <Button className="bg-orage uppercase font-bold">
                Categorias
              </Button>
            </DrawerTrigger>
            {/* <AddServiceCategory setOpen={setOpenAddCategory} /> */}
            <Categories setOpenCategories={setOpenAddCategory} />
          </Drawer>
          <Dialog open={openAddService} onOpenChange={setOpenAddService}>
            <DialogTrigger asChild>
              <Button className="bg-orage uppercase font-bold">
                Adicionar
              </Button>
            </DialogTrigger>
            <AddService setOpen={setOpenAddService} />
          </Dialog>
        </div>
      </div>
      {services &&
        services.map((serviceC) => (
          <div key={serviceC.id} className="flex flex-col gap-4">
            {serviceC.services?.length !== 0 && (
              <div className="flex items-center gap-1 group">
                <h3 className="text-2xl font-semibold">{serviceC.name}</h3>
                <Dialog
                  open={openEditCategory}
                  onOpenChange={setOpenEditCategory}
                >
                  <DialogTrigger
                    asChild
                    className="hover:cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    <Pencil size={16} />
                  </DialogTrigger>
                  <EditServiceCategory
                    serviceC={serviceC}
                    setOpen={setOpenEditCategory}
                  />
                </Dialog>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviceC.services &&
                serviceC.services.map((service) => (
                  <Card
                    key={service.name}
                    className="hover:scale-105 ease-in duration-300 hover:cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                      <Image
                        src={`http://localhost:3002/uploads/${service.image}`}
                        alt={service.name}
                        width={640}
                        height={480}
                        className="rounded-lg"
                      />
                      <span className="text-sm text-muted-foreground">
                        {service.description}
                      </span>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant={"destructive"}>Excluir</Button>
                        </AlertDialogTrigger>
                        <DeleteService service={service} />
                      </AlertDialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Editar</Button>
                        </DialogTrigger>
                        <EditService
                          service={service}
                          setOpen={setOpenAddService}
                        />
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </ContainerPage>
  );
}
