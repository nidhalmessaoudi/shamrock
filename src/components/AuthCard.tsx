import Image from "next/image";
import { PropsWithChildren } from "react";

import logo from "../../public/brand/logo.png";

interface Props extends PropsWithChildren {
  title: string;
}

export default function AuthCard(props: Props) {
  return (
    <div className="w-4/5 rounded-xl bg-dark-blue p-8 shadow-2xl sm:p-12 xl:w-3/5">
      <h1 className="mb-8 text-center text-4xl sm:mb-4">{props.title}</h1>
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="hidden w-1/2 pr-10 lg:flex lg:items-center lg:justify-center">
          <Image
            className="w-4/5 object-contain"
            src={logo}
            alt="Shamrock Logo"
            priority={true}
          />
        </div>
        <div className="w-full lg:w-1/2">{props.children}</div>
      </div>
    </div>
  );
}
