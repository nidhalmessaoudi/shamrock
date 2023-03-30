import Image from "next/image";
import { PropsWithChildren } from "react";

import logo from "../../public/brand/logo.png";

interface Props extends PropsWithChildren {
  title: string;
}

export default function AuthCard(props: Props) {
  return (
    <div className="w-800px rounded-xl bg-dark-blue p-8 shadow-2xl">
      <h1 className="mb-8 text-center text-4xl">{props.title}</h1>
      <div className="flex flex-row items-center justify-between">
        <Image
          className="w-2/5"
          src={logo}
          alt="Pikri.com Logo"
          priority={true}
        />
        <div className="w-3/5">{props.children}</div>
      </div>
    </div>
  );
}
