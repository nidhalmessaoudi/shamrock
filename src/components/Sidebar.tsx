import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string;
  className?: string;
}

export default function Sidebar(props: Props) {
  return (
    <div
      className={`mb-4 max-h-[36rem] min-h-fit w-[18rem] break-words rounded-xl bg-gray-100 dark:bg-slate-700 xl:w-[20rem] min-[1728px]:w-[24rem] ${
        props.className || ""
      }`}
    >
      <h2 className="px-6 pb-2 pt-6 text-2xl font-bold">{props.title}</h2>
      {props.children}
    </div>
  );
}
