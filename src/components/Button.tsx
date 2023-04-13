import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  color?: "white" | "blue" | "grey" | "green";
  className?: string;
  disabled?: boolean;
}

export default function Button(props: Props) {
  const colorVariants = {
    white: "focus:ring-white/50 bg-white text-black",
    blue: "focus:ring-blue-600/50 bg-blue-600 text-white",
    grey: "focus:ring-slate-200/50 bg-slate-200 text-black",
    green: "focus:ring-green-600/50 bg-green-600 text-white",
  };

  const color = (props.color || "blue") as keyof typeof colorVariants;

  return (
    <button
      className={`flex select-none flex-row items-center rounded-xl px-5 py-3 transition-all hover:opacity-90 focus:outline-none focus:ring-4 active:border-0 ${
        colorVariants[color]
      } ${props.className || ""} disabled:opacity-60`}
      disabled={props.disabled || false}
    >
      {props.children}
    </button>
  );
}
