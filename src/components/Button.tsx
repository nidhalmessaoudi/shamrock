import { MouseEventHandler, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  type?: "submit" | "button";
  color?: "white" | "blue" | "grey" | "green" | "outlineBlue";
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Props) {
  const colorVariants = {
    white: "focus:ring-white/50 bg-white text-black",
    blue: "focus:ring-green-blue/50 bg-green-blue text-white dark:bg-light-green dark:focus:ring-light-green/50",
    grey: "focus:ring-slate-200/50 bg-slate-200 text-black",
    green:
      "focus:ring-green-600/50 bg-green-600 text-white dark:bg-green-400 dark:focus:ring-green-400/70",
    outlineBlue:
      "focus:ring-green-blue/50 bg-transparent text-green-blue border border-green-blue dark:border-light-green dark:text-light-green dark:focus:ring-light-green/50",
  };

  const color = (props.color || "blue") as keyof typeof colorVariants;

  return (
    <button
      type={props.type || "button"}
      className={`flex select-none flex-row items-center justify-center rounded-xl px-5 py-3 uppercase transition-all hover:opacity-90 focus:outline-none focus:ring-4 active:border-0 ${
        colorVariants[color]
      } ${
        props.className || ""
      } disabled:cursor-not-allowed disabled:opacity-60`}
      disabled={props.disabled || false}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
