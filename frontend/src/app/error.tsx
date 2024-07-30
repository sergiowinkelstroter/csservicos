"use client";

import Error403Page from "@/components/403";
import { logout } from "@/utils/logout";
import { ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const navigate = useRouter();

  if (
    error.message === "Request failed with status code 403" ||
    error.message === "Request failed with status code 401"
  ) {
    return <Error403Page />;
  }

  return (
    <html>
      <body className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <ShieldX className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Algo deu errado!
          </h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          {error.digest && (
            <p className="mt-1 text-gray-500 text-sm">
              Código de erro: {error.digest}
            </p>
          )}
          <button
            onClick={() => {
              logout();
              navigate.push("/login");
            }}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sair
          </button>
        </div>
      </body>
    </html>
  );
}
