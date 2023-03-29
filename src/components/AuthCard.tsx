import Image from "next/image";

import logo from "../../public/brand/logo.png";

export default function AuthCard() {
  return (
    <div className="flex flex-row items-center justify-between bg-dark-blue rounded-xl p-8">
      <Image src={logo} alt="Pikri.com Logo" />
      <div>Sign Up To Pikri.com</div>
    </div>
  );
}
