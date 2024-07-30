"use client";
import { CircleUser, Menu, Package2Icon } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/User";
import { logout } from "@/utils/logout";
import Logo from "/public/logo.png";

export const Header = ({ user }: { user: User }) => {
  const pathname = usePathname();
  const navigate = useRouter();

  const sections = [
    { id: "home", label: "Home", perfil: ["CLIENTE"] },
    { id: "services", label: "Serviços", perfil: ["CLIENTE"] },
    { id: "scheduling", label: "Agendamentos", perfil: ["CLIENTE"] },
    { id: "settings", label: "Configurações", perfil: ["CLIENTE"] },
    {
      id: "admin",
      label: "Administrador",
      perfil: ["ADMIN"],
      subsections: [
        { id: "home", label: "Home", perfil: ["ADMIN"] },
        // { id: "services-providers", label: "Prestadores", perfil: ["ADMIN"] },
        { id: "scheduling", label: "Agendamentos", perfil: ["ADMIN"] },
        { id: "services", label: "Serviços", perfil: ["ADMIN"] },
        { id: "settings", label: "Configurações", perfil: ["ADMIN"] },
      ],
    },
    {
      id: "provider",
      label: "Prestador",
      perfil: ["PRESTADOR"],
      subsections: [
        { id: "home", label: "Home", perfil: ["PRESTADOR"] },

        { id: "settings", label: "Configurações", perfil: ["PRESTADOR"] },
      ],
    },
  ];

  const filteredSections = sections.filter((section) => {
    return section.perfil.includes(user.role);
  });

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="relative w-10 h-10">
          <Image
            src={Logo}
            alt="Logo"
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        {filteredSections.map((section) => {
          if (section.subsections) {
            return section.subsections.map((sub) => (
              <Link
                key={sub.id}
                href={`/${section.id}/${sub.id}`}
                className={`text-muted-foreground transition-colors hover:text-foreground   ${
                  pathname === `/${section.id}/${sub.id}`
                    ? "text-foreground"
                    : ""
                }`}
              >
                {sub.label}
              </Link>
            ));
          } else {
            return (
              <Link
                key={section.id}
                href={`/${section.id}`}
                className={`text-muted-foreground transition-colors hover:text-foreground ${
                  pathname === `/${section.id}` ? "text-foreground" : ""
                }`}
              >
                {section.label}
              </Link>
            );
          }
        })}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5 text-foreground" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <SheetClose asChild>
              <Link
                href="/home"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
            </SheetClose>
            {filteredSections.map((section) => {
              if (section.subsections) {
                return section.subsections.map((sub) => (
                  <SheetClose key={section.id} asChild>
                    <Link
                      href={`/${section.id}/${sub.id}`}
                      className=" hover:text-foreground"
                    >
                      {sub.label}
                    </Link>
                  </SheetClose>
                ));
              } else {
                return (
                  <SheetClose key={section.id} asChild>
                    <Link
                      href={`/${section.id}`}
                      className=" hover:text-foreground"
                    >
                      {section.label}
                    </Link>
                  </SheetClose>
                );
              }
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44 text-center" align="end">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuItem>{user.name}</DropdownMenuItem>
            <DropdownMenuItem>{user.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Configurações</DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => {
                  logout();
                  navigate.push("/login");
                }}
              >
                Sair
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
