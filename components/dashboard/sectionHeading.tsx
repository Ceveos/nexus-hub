
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode
}
const SectionHeading: React.FC<Props> = ({ children, className, action }) => {

  return (
    <div className={cn("border-b border-gray-200 pb-2 sm:flex sm:items-center sm:justify-between mb-6", className)}>
      <h3 className="text-base py-2 font-semibold leading-6 text-gray-900">{children}</h3>
      {action}
    </div>
  );
};

export default SectionHeading;
