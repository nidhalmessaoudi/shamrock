import Image from "next/image";

import brand from "../../public/brand/brand.png";
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
      <div className="">
        <Link href="/" shallow={true}>
          <Image
            src={brand}
            alt="Shamrock Logo"
            width={130}
            className="object-contain"
          />
        </Link>
      </div>
      <div
        className="relative flex cursor-pointer select-none flex-row items-center"
        onClick={navbarDropdownHandler}
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
