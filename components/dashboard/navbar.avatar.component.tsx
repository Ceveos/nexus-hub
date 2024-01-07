import { getServerAuthSession } from "@/lib/auth";
import { Avatar } from "../catalyst/avatar";
import { generateInitials } from "@/lib/utils";
import { ChevronDownIcon } from '@heroicons/react/16/solid'

const NavbarAvatar: React.FC = async () => {
  const session = await getServerAuthSession();

  return (
    <>
        <Avatar className="size-10 rounded-lg" src={session?.user.image} initials={generateInitials(session?.user.name ?? "?")} alt="Avatar" />
        <span className="block text-left">
          <span className="block text-sm/5 font-medium dark:text-white">{session?.user.name}</span>
          <span className="block text-xs/5 text-zinc-500">Admin</span>
        </span>
        <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 stroke-zinc-400" />

      {/* <Image
        className="h-8 w-8 rounded-full bg-gray-50 dark:bg-primary-dark-700"
        src={session?.user.image ?? ""}
        width={32}
        height={32}
        alt="Avatar"
      />
      <span className="flex items-center">
        <span
          className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-primary-dark-200"
          aria-hidden="true"
        >
          {session?.user.name}
        </span>
        <ChevronDownIcon
          className="ml-2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </span> */}
    </>
  );
};

export default NavbarAvatar;
