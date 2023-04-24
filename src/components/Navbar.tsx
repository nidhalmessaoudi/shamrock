import Image from "next/image";

import logoBlack from "../../public/brand/logoBlack.png";
import Link from "next/link";
import NavbarDropdown from "./NavbarDropdown";
import { useEffect, useState, MouseEvent } from "react";
import { IUser } from "../../prisma/user";
import DefaultProfilePicture from "./DefaultProfilePicture";
import truncateUsername from "@/helpers/truncateUsername";

interface Props {
  user: IUser;
}

export default function Navbar(props: Props) {
  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);

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
    <nav className="fixed left-0 top-0 z-10 flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 p-4 backdrop-blur-md">
      <Link href="/" shallow={true} className="flex flex-row items-center">
        <Image
          src={logoBlack}
          alt="Shamrock Logo"
          width={32}
          className="object-contain"
        />
        <h3 className="ml-2 bg-gradient-to-r from-black to-light-green bg-clip-text text-2xl font-bold uppercase text-transparent">
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
