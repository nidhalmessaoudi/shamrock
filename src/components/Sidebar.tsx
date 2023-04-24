import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
}

export default function Sidebar(props: Props) {
  return (
    <div
      className={`max-h-[34rem] min-h-[18rem] w-[24rem] overflow-hidden break-words rounded-xl bg-gray-100 ${
        props.className || ""
      }`}
    >
      <h2 className="px-6 pb-2 pt-6 text-2xl font-bold">{props.title}</h2>
      {props.children}
    </div>
  );
}
