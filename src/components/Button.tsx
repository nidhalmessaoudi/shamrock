interface Props {
  text: string;
  color?: "white" | "blue" | "grey";
  className?: string;
}

export default function Button(props: Props) {
  const colorVariants = {
    white: "focus:ring-white/50 bg-white text-black",
    blue: "focus:ring-blue-600/50 bg-blue-600 text-white",
    grey: "focus:ring-slate-200/50 bg-slate-200 text-black",
  };

  const color = (props.color || "blue") as keyof typeof colorVariants;

  return (
    <div>
      <button
        className={`select-none rounded-xl px-5 py-3 transition-all hover:opacity-90 focus:outline-none focus:ring-4 active:border-0 ${
          colorVariants[color]
        } ${props.className || ""}`}
      >
        {props.text}
      </button>
    </div>
  );
}
