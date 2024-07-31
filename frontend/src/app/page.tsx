"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ArrowUp,
  DollarSign,
  Layout,
  Mail,
  MapPin,
  Menu,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceCategory } from "@/types/Service";
import { useEffect, useState } from "react";
import Maria from "/public/imagens/maria.jpg";
import Carlos from "/public/imagens/carlos.jpg";
import Ana from "/public/imagens/ana.jpg";
import LogoHero from "/public/logo_login.png";

const depoimentos = [
  {
    nome: "Maria Silva",
    depoimento:
      "A C&S Serviços me ajudou a encontrar profissionais qualificados para consertar minha casa rapidamente. O processo de agendamento foi simples e eficiente. Recomendo fortemente!",
    imagem: Maria,
  },
  {
    nome: "Carlos Santos",
    depoimento:
      "Fiquei impressionado com a qualidade do atendimento da C&S Serviços. Os prestadores de serviço foram pontuais e profissionais. Com certeza usarei novamente!",
    imagem: Carlos,
  },
  {
    nome: "Ana Pereira",
    depoimento:
      "A C&S Serviços tornou minha vida muito mais fácil. Agendar serviços de limpeza e manutenção nunca foi tão prático. A plataforma é intuitiva e os profissionais são excelentes.",
    imagem: Ana,
  },
];

export default function Home() {
  const [services, setServices] = useState<ServiceCategory[]>();

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch(
        "http://localhost:3002/services/listByCategory"
      );
      const data = await response.json();
      setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <div className="bg-[#15233E] text-white">
      <header className="bg-[#15233E] fixed z-50 inset-x-0 top-0 ">
        <div className="container flex py-4 justify-between items-center">
          <Link
            href="/#home"
            className="relative w-12 h-12 hover:shadow hover:shadow-white hover:rounded-lg hover:transition-shadow"
          >
            <Image
              src={Logo}
              alt="Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </Link>
          <nav className="md:flex gap-8 hidden">
            <ul className="flex gap-6 items-center justify-center">
              <li className="hover:underline">
                <Link href="#sobre">Sobre</Link>
              </li>
              <li className="hover:underline">
                <Link href="#servicos">Serviços</Link>
              </li>
              <li className="hover:underline">
                <Link href="#depoimentos">Depoimentos</Link>
              </li>
              <li className="hover:underline">
                <Link href="#contato">Contatos</Link>
              </li>
            </ul>
            <Button asChild>
              <Link href="/login" className="text-white font-semibold bg-orage">
                Entrar
              </Link>
            </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#15233E] text-white">
              <div className="flex justify-between items-center">
                <Link
                  href="/#home"
                  className="relative w-12 h-12 hover:shadow hover:shadow-white hover:rounded-lg hover:transition-shadow"
                >
                  <Image
                    src={Logo}
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </Link>
                <SheetClose />
              </div>
              <div className="flex flex-col gap-4 mt-8">
                <ul className="flex flex-col gap-4 ">
                  <li className="hover:underline">
                    <Link href="#sobre">
                      <SheetClose>Sobre</SheetClose>
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="#servicos">
                      <SheetClose>Serviços</SheetClose>
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="#depoimentos">
                      <SheetClose>Depoimentos</SheetClose>
                    </Link>
                  </li>
                  <li className="hover:underline">
                    <Link href="#contato">
                      <SheetClose>Contatos</SheetClose>
                    </Link>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/login" className="bg-[#F97316] font-semibold">
                    Entrar
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="bg-[#15233E]">
        <section
          id="home"
          className="container flex flex-col md:flex-row gap-20 items-center  justify-center pt-8 md:pt-16 my-16"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-5xl font-bold">
                Serviços de qualidade ao seu alcance com C&S Serviços
              </h1>
              <p className="text-sm md:text-lg">
                Profissionais qualificados, atendimento rápido e preços
                acessíveis.
              </p>
            </div>
            <Button asChild>
              <Link
                href="/register"
                className="text-white font-semibold bg-[#F97316]"
              >
                Cadastre-se gratuitamente
              </Link>
            </Button>
          </div>
          <div className="w-full lg:flex justify-center items-center hidden">
            <Image src={LogoHero} alt="csservicos" width={500} height={500} />
          </div>
        </section>

        <section id="sobre" className="py-16 bg-[#F97316]">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex justify-center w-full md:w-1/3 mb-8 md:mb-0">
                <div className="relative w-60 h-60 hover:shadow hover:shadow-white hover:rounded-lg hover:transition-shadow">
                  <Image
                    src={Logo}
                    alt="Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Sobre nós
                </h3>
                <p className="text-sm md:text-lg text-justify">
                  Na C&S Serviços, estamos comprometidos em fornecer soluções
                  eficientes e de alta qualidade para todas as suas necessidades
                  de manutenção e serviços gerais. Nossa missão é simplificar o
                  processo de agendamento, conectando você com profissionais
                  qualificados e confiáveis, prontos para atender às suas
                  demandas com excelência.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="py-16 ">
          <div className="container">
            <h3 className="text-2xl md:text-4xl font-bold  text-center mb-12">
              Nossos Serviços
            </h3>
            {services &&
              services.map((serviceC) => (
                <div key={serviceC.name} className="flex flex-col gap-4">
                  {serviceC.services?.length !== 0 && (
                    <h3 className="text-2xl font-semibold">{serviceC.name}</h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {serviceC.services &&
                      serviceC.services.map((service) => (
                        <Card
                          key={service.name}
                          className="hover:scale-105 ease-in duration-300 hover:cursor-pointer bg-[#F97316] border-[#F97316] text-white"
                        >
                          <CardHeader>
                            <CardTitle className="text-xl">
                              {service.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2">
                            <Image
                              src={`http://localhost:3002/uploads/${service.image}`}
                              alt={service.name}
                              width={640}
                              height={480}
                              className="rounded-lg"
                            />
                            <span className="text-sm text-white">
                              {service.description}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section id="cta-secundario" className="py-16  text-white">
          <div className="container text-center">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">
              Pronto para agendar seus serviços com a C&S Serviços?
            </h3>
            <p className="text-sm md:text-lg mb-8">
              Cadastra-se agora, faça seus primeiros agendamentos e descubra
              como a C&S Serviços pode <br />
              facilitar a realização dos serviços que você precisa.
            </p>
            <Button asChild variant={"outline"}>
              <Link href="/register" className="text-black font-semibold">
                Cadastre-se gratuitamente
              </Link>
            </Button>
          </div>
        </section>

        <section id="depoimentos" className="py-16 bg-[#F97316] text-white">
          <div className="container">
            <h3 className="text-2xl md:text-4xl font-bold  text-center mb-12">
              O que nossos clientes dizem
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {depoimentos.map((depoimento, index) => (
                <div
                  key={index}
                  className="p-6  bg-[#15233E] rounded-lg shadow-md"
                >
                  <Image
                    src={depoimento.imagem}
                    alt={`Foto de ${depoimento.nome}`}
                    width={128}
                    height={128}
                    className="w-32 h-32 mx-auto rounded-full mb-4"
                  />
                  <p className="italic mb-4">"{depoimento.depoimento}"</p>
                  <p className="font-bold">{depoimento.nome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                Entre em Contato
              </h2>
              <p className="text-sm md:text-lg">
                Estamos aqui para ajudar. Entre em contato conosco para mais
                informações.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center flex-col">
                <Mail size={64} className=" mb-4" />
                <p className="text-lg font-semibold mb-2">E-mail</p>
                <p className="">csservicos@gmail.com</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <Phone size={64} className=" mb-4" />
                <p className="text-lg font-semibold mb-2">Telefone</p>
                <p className="">(99) 99152-9825</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <MapPin size={64} className=" mb-4" />
                <p className="text-lg font-semibold mb-2">Localização</p>
                <p className="">Açailândia - MA</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#F97316] p-4 text-center flex justify-between items-center">
        <div></div>
        <p className=" text-sm md:text-base ">@C&S Serviços</p>
        <Button
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="text-[#F97316]" />
        </Button>
      </footer>
    </div>
  );
}