import { useId } from "react";

interface Props {
  type: "text" | "password" | "email";
  label: string | null;
  name?: string;
  color?: "white" | "black";
  className?: string;
  disabled?: boolean;
  val?: string;
}

export default function TextField(props: Props) {
  const INPUT_ID = useId();

  const colorVariants = {
    white: "bg-white/10 focus:ring-white/50 disabled:bg-white/20",
    black: "bg-black/5 focus:ring-blue-400 disabled:bg-black/10",
  };

  const input = (
    <input
      type={props.type}
      id={INPUT_ID}
      name={props.name || ""}
      className={`rounded-xl p-3 transition-shadow focus:outline-none focus:ring-4 ${
        colorVariants[props.color || "black"]
      } ${props.disabled && "italic text-black/70"}`}
      disabled={props.disabled}
      defaultValue={props.val || ""}
    />
  );

  return (
    <>
      {props.label && (
        <div className={`mb-4 flex flex-col ${props.className || ""}`}>
          <label htmlFor={INPUT_ID} className="mb-2">
            {props.label}
          </label>
          {input}
        </div>
      )}
      {!props.label && input}
    </>
  );
}
