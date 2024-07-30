import { TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const TabSeparator = () => {
  return <Separator className="hidden sm:flex sm:w-8 md:w-24 xl:w-64" />;
};

const TabList = () => {
  return (
    <TabsList className="flex w-full justify-between">
      <TabsTrigger
        className="text-xs md:text-sm text-white bg-orage hover:opacity-90 transition-opacity "
        value="a_confirmar"
      >
        A confirmar
      </TabsTrigger>
      <TabSeparator />
      <TabsTrigger
        className="text-xs md:text-sm text-white bg-orage hover:opacity-90 transition-opacity "
        value="agendados"
      >
        Agendados
      </TabsTrigger>
      <TabSeparator />
      <TabsTrigger
        className="text-xs md:text-sm text-white bg-orage hover:opacity-90 transition-opacity "
        value="em_andamento"
      >
        Em andamento
      </TabsTrigger>
      <TabSeparator />
      <TabsTrigger
        className="text-xs md:text-sm text-white bg-orage hover:opacity-90 transition-opacity "
        value="concluidos"
      >
        Concluidos
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
