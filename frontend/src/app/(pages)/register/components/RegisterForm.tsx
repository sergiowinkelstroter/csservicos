"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

const RegisterSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
  fone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido"),
  password: z.string().min(1, "Senha é obrigatório"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
});

type registerSchema = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<registerSchema>({
    resolver: zodResolver(RegisterSchema),
  });
  const { toast } = useToast();
  const navigate = useRouter();

  const { mutateAsync: registerUser, isLoading } = useMutation({
    mutationFn: async (values: registerSchema) => {
      const response = await api.post("/users/register", {
        name: values.name,
        email: values.email,
        fone: values.fone,
        password: values.password,
      });
    },
    mutationKey: ["register"],
  });

  async function onSubmit(values: registerSchema) {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não são iguais",
        variant: "destructive",
      });
      return null;
    }

    try {
      await registerUser(values);
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso",
        variant: "default",
      });
      reset();
      navigate.push("/login");
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro",
        description: "Erro ao registrar",
        variant: "destructive",
      });
    }
  }
  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nome"
              required
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
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
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fone">Telefone</Label>
            <Input
              id="fone"
              type="text"
              placeholder="(12) 93456-7890"
              required
              {...register("fone")}
            />
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
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirmPassword">Confirme sua senha</Label>
            </div>
            <Input
              id="confirmPassword"
              type="password"
              required
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={() => navigate.push("/")}
            >
              Voltar
            </Button>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Carregando..." : "Cadastrar"}
            </Button>
          </div>
          {/* <span className="text-center text-sm">ou</span>
          <Button variant="outline" type="button" className="w-full">
            Autenticar com Google
          </Button> */}
        </form>
        <div className="mt-4 text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline">
            Clique aqui
          </Link>
        </div>
      </div>
    </div>
  );
};
