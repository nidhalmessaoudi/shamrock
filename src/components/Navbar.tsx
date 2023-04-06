import Image from "next/image";

import brand from "../../public/brand/brand.png";
import Link from "next/link";

export default function Navbar() {
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
      <ul className="flex flex-row items-center">
        <li>Home</li>
        <li>Terms</li>
        <li>Privacy</li>
      </ul>
      <div className="">
        <i className="bi bi-person-circle"></i>
        Mr. Nidhal Messaoudi
      </div>
    </nav>
  );
}
