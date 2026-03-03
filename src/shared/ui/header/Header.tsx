import Link from "next/link";
import { Icon } from "../icon";
import Image from "next/image";
import { IconLogo } from "../icon/IconLogo";

export default function Header() {
  return (
    <header className="flex h-screen w-[20%] flex-col items-start gap-4 rounded-tl-lg bg-[#f4f3f8] p-4">
      <div className="flex items-center self-center">
        <IconLogo />
        <span className="text-[24px] font-bold">CodeCat</span>
      </div>
      <nav className="flex w-full flex-col items-center justify-start">
        <Link
          href="/"
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-[#f4f3f8] px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-white hover:bg-[#e0e5eb]"
        >
          <Icon name="home" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">Home</span>
        </Link>
        <Link
          href="/profile"
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-[#f4f3f8] px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-white hover:bg-[#e0e5eb]"
        >
          <Icon name="profile" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">Profile</span>
        </Link>
        <Link
          href="/practice"
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-[#f4f3f8] px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-white hover:bg-[#e0e5eb]"
        >
          <Icon name="practice" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">Practice</span>
        </Link>
        <Link
          href="/settings"
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-[#f4f3f8] px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-white hover:bg-[#e0e5eb]"
        >
          <Icon name="settings" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">Settings</span>
        </Link>
      </nav>
    </header>
  );
}
