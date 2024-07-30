import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDatePtBr(dateString: string): string {
  const date = new Date(dateString);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}
