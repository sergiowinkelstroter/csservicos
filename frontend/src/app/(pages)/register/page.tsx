import Image from "next/image";
import { RegisterForm } from "./components/RegisterForm";

export default function Register() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-service  lg:flex justify-center items-center">
        <Image
          src="/logo.png"
          alt="Image"
          width="500"
          height="500"
          className=" object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <RegisterForm />
    </div>
  );
}
