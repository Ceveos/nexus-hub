
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode
}
const SectionHeading: React.FC<Props> = ({ children, className, action }) => {

  return (
    <div className={cn("border-b border-gray-200 pb-2 sm:flex sm:items-center sm:justify-between", className)}>
      <h3 className="text-base font-semibold leading-6 text-gray-900">{children}</h3>
      {action}
    </div>
  );
};

export default SectionHeading;
