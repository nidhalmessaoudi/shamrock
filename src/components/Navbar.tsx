import Image from "next/image";

import logoBlack from "../../public/brand/logoBlack.png";
import logoWhite from "../../public/brand/logoWhite.png";
import Link from "next/link";
import NavbarDropdown from "./NavbarDropdown";
import { useEffect, useState, MouseEvent } from "react";
import { IUser } from "../../prisma/user";
import DefaultProfilePicture from "./DefaultProfilePicture";
import truncateUsername from "@/helpers/truncateUsername";
import { useTheme } from "next-themes";

interface Props {
  user: IUser;
}

export default function Navbar(props: Props) {
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);

  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showNavbarDropdown) {
      return;
    }

    function bodyClickHandler() {
      setShowNavbarDropdown(false);
    }

    document.addEventListener("click", bodyClickHandler);

    return () => {
      document.removeEventListener("click", bodyClickHandler);
    };
  }, [showNavbarDropdown]);

  function navbarDropdownHandler(e: MouseEvent) {
    setShowNavbarDropdown((oldState) => !oldState);
    e.stopPropagation();
  }

  return (
    <nav className="fixed left-0 top-0 z-10 flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 p-4 backdrop-blur-md dark:border-slate-500 dark:text-white">
      <Link href="/" shallow={true} className="flex flex-row items-center">
        <div className="w-8">
          {mounted && (
            <Image
              src={currentTheme === "dark" ? logoWhite : logoBlack}
              alt="Shamrock Logo"
              width={32}
              className="object-contain"
            />
          )}
        </div>
        <h3 className="ml-2 bg-gradient-to-r from-black to-light-green bg-clip-text text-2xl font-bold uppercase text-transparent dark:from-light-green dark:to-green-blue">
          Shamrock
        </h3>
      </Link>
      <div
        className="relative flex cursor-pointer select-none flex-row items-center"
        onClick={navbarDropdownHandler}
        title={props.user.username}
      >
        <DefaultProfilePicture className="mr-2 w-9" />
        <span className="mr-2">{truncateUsername(props.user.username)}</span>
        <i className="bi bi-chevron-down text-xl"></i>
        {showNavbarDropdown && (
          <NavbarDropdown username={props.user.username} />
        )}
      </div>
    </nav>
  );
}
