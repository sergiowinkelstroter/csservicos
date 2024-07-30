import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Error403Page = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold text-red-500">
        Erro 403: Acesso Não Autorizado
      </h1>
      <p className="text-lg mt-4">
        Você não tem permissão para acessar esta página.
      </p>
      <p className="text-lg mt-2">
        Você será redirecionado para a página inicial em breve...
      </p>
    </div>
  );
};

export default Error403Page;
