"use client";
import { ContainerPage } from "@/components/ContainerPage";
import { Loading } from "@/components/Loading";
import { ModaldAddSchedule } from "@/components/ModaldAddSchedule";
import { NavigationViewer } from "@/components/NavigationViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { Service, ServiceCategory } from "@/types/Service";
import { ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Services() {
  // const { data: services, isLoading } = useQuery<ServiceCategory[]>({
  //   queryKey: ["services"],
  //   queryFn: async () => {
  //     const response = await api.get("/services/listByCategory");
  //     console.log(response.data);
  //     return response.data;
  //   },
  // });
  const [services, setServices] = useState<ServiceCategory[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await api.get("/services/listByCategory");
      setServices(response.data);
    };
    fetchServices();
  }, []);

  if (services === undefined) {
    <div className="w-full h-screen flex justify-center items-center">
      <Loading />
    </div>;
  }

  return (
    <ContainerPage>
      <div className="flex items-center justify-between">
        <NavigationViewer data={[{ href: "/services", prefix: "Serviços" }]} />
        <Link href="/scheduling">
          <ArrowRightCircle />
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Nossos Serviços</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orage uppercase font-bold">Agendar</Button>
          </DialogTrigger>
          <ModaldAddSchedule setOpen={setOpen} />
        </Dialog>
      </div>
      {services &&
        services.map((serviceC) => (
          <div key={serviceC.name} className="flex flex-col gap-4">
            {serviceC.services?.length !== 0 && (
              <h3 className="text-2xl font-semibold">{serviceC.name}</h3>
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
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </ContainerPage>
  );
}
