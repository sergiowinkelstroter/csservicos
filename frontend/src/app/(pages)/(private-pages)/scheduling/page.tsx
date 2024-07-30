import { getUserProfile } from "@/utils/getUserProfile";
import Schedules from "./components/Schedules";

export default async function Scheduling() {
  const user = await getUserProfile();

  return <Schedules user={user} />;
}
