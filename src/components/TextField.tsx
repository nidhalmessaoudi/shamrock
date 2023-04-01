import { useId } from "react";

interface Props {
  type: "text" | "password" | "email";
  label: string;
  name?: string;
}

export default function TextField(props: Props) {
  const INPUT_ID = useId();

  return (
    <div className="mb-4 flex flex-col">
      <label htmlFor={INPUT_ID} className="mb-2">
        {props.label}
      </label>
      <input
        type={props.type}
        id={INPUT_ID}
        name={props.name || ""}
        className="rounded-xl bg-white/10 p-3 transition-shadow focus:outline-none focus:ring-4 focus:ring-white/50"
      />
    </div>
  );
}
