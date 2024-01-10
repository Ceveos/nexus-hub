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
          {/* <span className="block text-xs/5 text-zinc-500">Admin</span> */}
        </span>
        <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 stroke-zinc-400" />
    </>
  );
};

export default NavbarAvatar;
