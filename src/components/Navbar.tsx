import Image from "next/image";

import brand from "../../public/brand/brand.png";
import Link from "next/link";
import { UserSession as User } from "../../libs/auth/session";
import NavbarDropdown from "./NavbarDropdown";
import { useEffect, useState, MouseEvent } from "react";

interface Props {
  user: User;
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
    <nav className="flex w-full flex-row items-center justify-between border-b border-solid border-gray-200 p-4">
      <div className="">
        <Link href="/">
          <Image
            src={brand}
            alt="Pikri.com Logo"
            width={130}
            className="object-contain"
          />
        </Link>
      </div>
      <div
        className="relative flex cursor-pointer select-none flex-row items-center"
        onClick={navbarDropdownHandler}
      >
        <i className="bi bi-person-circle mr-2 text-2xl text-blue"></i>
        <span className="mr-2">{truncateUsername(props.user.username)}</span>
        <i className="bi bi-chevron-down text-xl"></i>
        {showNavbarDropdown && (
          <NavbarDropdown username={props.user.username} />
        )}
      </div>
    </nav>
  );
}

function truncateUsername(username: string) {
  const MAX_LENGTH = 12;
  let truncated = username.substring(0, MAX_LENGTH);
  if (truncated !== username) {
    truncated += "...";
  }
  return truncated;
}
