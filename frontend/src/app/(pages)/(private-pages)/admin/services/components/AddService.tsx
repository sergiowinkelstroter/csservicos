import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { Service, ServiceCategory } from "@/types/Service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  categoryId: z.number().min(1, "A categoria é obrigatória"),
});

type formType = z.infer<typeof formSchema>;

interface AddServiceProps {
  setOpen: (open: boolean) => void;
}

export const AddService = ({ setOpen }: AddServiceProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync: createService, isLoading: createServiceIsLoading } =
    useMutation({
      mutationFn: async (data: FormData) => {
        const response = await api.post("/services/register", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      },
      mutationKey: ["services"],
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
      },
    });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["servicesCategory"],
    queryFn: async () => {
      const response = await api.get("/services/categories/list");
      return response.data;
    },
  });

  async function handleNewService(data: formType) {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "A imagem é obrigatória",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("image", selectedFile);

    try {
      await createService(formData);
      setOpen(false);
      toast({
        title: "Sucesso!",
        description: "Serviço criado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Tente novamente",
        description: "Erro ao criar o serviço",
      });
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar serviço</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleNewService)}
      >
        <div className="flex flex-col gap-2">
          <Label>Nome</Label>
          <Input type="text" {...register("name")} required />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Categoria</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, value } }) => (
              <Select
                onValueChange={(value) => onChange(Number(value))}
                value={String(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="0">Carregando...</SelectItem>
                  ) : (
                    categories?.map((category: ServiceCategory) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
        <div>
          <Label>Imagem</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Descrição</Label>
          <Textarea {...register("description")} required />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="bg-orage font-bold"
            type="submit"
            disabled={createServiceIsLoading}
          >
            {createServiceIsLoading ? "Carregando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
