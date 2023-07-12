import { getServerSession } from "next-auth";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { authOptions } from "~/server/auth";

const NavbarAvatar: React.FC = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <img
        className="h-8 w-8 rounded-full bg-gray-50"
        src={session?.user.image ?? ""}
        alt=""
      />
      <span className="hidden lg:flex lg:items-center">
        <span
          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
          aria-hidden="true"
        >
          {session?.user.name}
        </span>
        <ChevronDownIcon
          className="ml-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </span>
    </>
  );
};

export default NavbarAvatar;
