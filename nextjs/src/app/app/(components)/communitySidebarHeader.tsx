import { Avatar } from "@nextjs/components/catalyst/avatar";
import { cn, generateInitials } from "@nextjs/lib/utils";

interface Props {
  id: string;
  name: string;
  avatarClass?: string;
};

const communitySidebarHeader = ({ name, avatarClass }: Props) => {

  return (
    <div className="mt-2 flex h-16 shrink-0 items-center w-full">
      <Avatar
        initials={generateInitials(name, 2)}
        className={cn("h-10 w-10 shrink-0", avatarClass)}
      />
      <span className="text-xl shrink font-semibold ml-4 text-gray-100 line-clamp-1">{name}</span>
    </div>
  )
};

export default communitySidebarHeader;