import Link from "next/link";
import {
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useRef,
} from "react";
import DefaultProfilePicture from "./DefaultProfilePicture";
import { useTheme } from "next-themes";

interface Props {
  username: string;
}

export default function NavbarDropdown(props: Props) {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const signOutRef = useRef<HTMLFormElement>(null);

  function toggleDarkMode(e: MouseEvent) {
    e.stopPropagation();

    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  function signOutHandler() {
    signOutRef.current?.submit();
  }

  return (
    <ul
      tabIndex={0}
      className="absolute right-0 top-below-parent z-20 w-96 cursor-auto overflow-auto rounded-xl border border-solid border-gray-200 bg-white p-1 dark:border-slate-500 dark:bg-slate-800"
    >
      <DropdownItem link={`/users/${props.username}`} title={props.username}>
        <DefaultProfilePicture className="mr-3 w-[80px]" />
        <span className="flex flex-col">
          <span className="font-bold">{props.username}</span>
          <span className="text-sm text-black/70 dark:text-slate-400">
            See Your Profile
          </span>
        </span>
      </DropdownItem>
      {/* <DropdownItem link="/settings" title="Settings">
        <DropdownIcon name="bi-gear" />
        <span>Settings</span>
      </DropdownItem> */}
      <DropdownItem title="Dark Mode" onClick={toggleDarkMode}>
        <div className="flex w-full flex-row items-center justify-between">
          <div>
            <DropdownIcon name="bi-moon" />
            <span>Dark Mode</span>
          </div>
          <i
            className={`bi bi-toggle-${
              currentTheme === "dark"
                ? "on text-light-green"
                : "off text-gray-600"
            } text-2xl`}
          ></i>
        </div>
      </DropdownItem>
      <DropdownItem onClick={signOutHandler} title="Sign Out">
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
  title: string;
  link?: string;
  onClick?: MouseEventHandler<HTMLLIElement>;
}

function DropdownItem(props: DropdownItemProps) {
  const styles =
    "flex cursor-pointer flex-row items-center rounded-xl p-3 transition-colors hover:bg-gray-100 dark:hover:bg-slate-700";

  return (
    <li
      className={!props.link ? styles : ""}
      onClick={props.onClick}
      title={props.title}
    >
      {props.link && (
        <Link href={props.link} className={styles} shallow={true}>
          {props.children}
        </Link>
      )}
      {!props.link && props.children}
    </li>
  );
}

function DropdownIcon(props: { name: string }) {
  return (
    <i
      className={`bi ${props.name} text-blue mr-3 text-xl text-gray-600 dark:text-slate-400`}
    ></i>
  );
}
