interface Props {
  text: string;
  color?: string;
  textColor?: string;
}

export default function Button(props: Props) {
  const color = props.color || "bg-sky-500";
  const textColor = props.textColor || "text-white";

  return (
    <div>
      <button
        className={`rounded-xl px-5 py-3 transition-all hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-white/50 ${color} ${textColor}`}
      >
        {props.text}
      </button>
    </div>
  );
}
