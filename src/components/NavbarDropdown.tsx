import { MouseEventHandler, PropsWithChildren, useRef } from "react";

interface Props {
  username: string;
}

export default function NavbarDropdown(props: Props) {
  const signOutRef = useRef<HTMLFormElement>(null);

  function signOutHandler() {
    signOutRef.current?.submit();
  }

  return (
    <ul className="absolute right-0 top-below-parent z-50 w-96 cursor-auto overflow-auto rounded-xl border border-solid border-gray-200 bg-white p-1">
      <DropdownItem>
        <i className="bi bi-person-circle mr-3 text-6xl text-blue"></i>
        <span className="flex flex-col">
          <span className="font-bold">{props.username}</span>
          <span className="text-sm">See Your Profile</span>
        </span>
      </DropdownItem>
      <DropdownItem>
        <DropdownIcon name="bi-gear" />
        <span>Settings</span>
      </DropdownItem>
      <DropdownItem>
        <DropdownIcon name="bi-moon" />
        <span>Dark Mode</span>
      </DropdownItem>
      <DropdownItem onClick={signOutHandler}>
        <DropdownIcon name="bi-box-arrow-right" />
        <form action="/api/signout" method="POST" ref={signOutRef}>
          <input type="hidden" />
        </form>
        <span>Sign Out</span>
      </DropdownItem>
    </ul>
  );
}

interface DropdownItemProps extends PropsWithChildren {
  onClick?: MouseEventHandler<HTMLLIElement>;
}

function DropdownItem(props: DropdownItemProps) {
  return (
    <li
      className="flex cursor-pointer flex-row items-center rounded-xl p-3 transition-colors hover:bg-slate-100"
      onClick={props.onClick}
    >
      {props.children}
    </li>
  );
}

function DropdownIcon(props: { name: string }) {
  return <i className={`bi ${props.name} mr-3 text-xl text-blue`}></i>;
}
