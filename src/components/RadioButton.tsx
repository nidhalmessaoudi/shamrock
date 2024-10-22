import { useState } from "react";

interface Props {
  checked?: boolean;
}

export default function RadioButton(props: Props) {
  const checked = props.checked || false;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 fill-green-blue text-green-blue dark:fill-light-green dark:text-light-green"
        viewBox="0 0 512 512"
      >
        <path
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          fill="none"
          stroke="currentColor"
          strokeMiterlimit="10"
          strokeWidth="32"
        />
        {checked && <circle cx="256" cy="256" r="144" />}
      </svg>
    </>
  );
}
