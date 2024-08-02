"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { addCookies } from "@/utils/cookies";

const LoginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatório"),
});

type loginSchema = z.infer<typeof LoginSchema>;

export default function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<loginSchema>({
    resolver: zodResolver(LoginSchema),
  });
  const { toast } = useToast();
  const navigate = useRouter();

  const { mutateAsync: login, isLoading } = useMutation({
    mutationFn: async (values: loginSchema) => {
      const response = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      const token = response.data.token;
      await addCookies(token);
      return response.data;
    },
    mutationKey: ["login"],
  });

  async function onSubmit(values: loginSchema) {
    try {
      const data = await login(values);
      if (data.user_role === "ADMIN") {
        navigate.push("/admin/home");
      } else if (data.user_role === "PRESTADOR") {
        navigate.push("/provider/home");
      } else if (data.user_role === "CLIENTE") {
        navigate.push("/home");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao tentar login",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Autenticação</h1>
            {/* <p className=" text-sm text-muted-foreground">
              Digite seu e-mail e senha abaixo para fazer login em sua conta.
            </p> */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
              <Link
                href="/forgot-password"
                className="mr-auto inline-block text-sm underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={"outline"}
                className="w-full"
                disabled={isLoading}
                onClick={() => navigate.push("/")}
              >
                Voltar
              </Button>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : "Entrar"}
              </Button>
            </div>
            {/* <span className="text-center text-sm">ou</span>
            <Button variant="outline" type="button" className="w-full">
              Autenticar com Google
            </Button> */}
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="underline">
              Crie uma
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-service  lg:flex justify-center items-center">
        <Image
          src="/logo_login.png"
          alt="Image"
          width="500"
          height="500"
          className=" object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
