interface Props {
  text: string;
  color?: string;
  textColor?: string;
}

export default function Button(props: Props) {
  const color = props.color || "bg-sky-500";
  const textColor = props.textColor || "text-white";

  return (
    <button
      className={`rounded-xl px-5 py-3 opacity-80 transition-opacity hover:opacity-100 focus:outline-none ${color} ${textColor}`}
    >
      {props.text}
    </button>
  );
}
