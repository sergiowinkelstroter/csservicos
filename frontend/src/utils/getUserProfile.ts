import { api } from "@/lib/axios";

export async function getUserProfile() {
  try {
    const response = await api.get("/users/profile");
    return response.data.user;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
}
