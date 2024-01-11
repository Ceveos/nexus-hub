
import { cn } from "@nextjs/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode
}
const SectionHeading: React.FC<Props> = ({ children, className, action }) => {

  return (
    <div className={cn("border-b border-primary-300 dark:border-b-2 dark:border-primary-dark-800 pb-2 sm:flex sm:items-center sm:justify-between mb-6", className)}>
      <h3 className="text-base py-2 font-semibold leading-6 text-gray-900 dark:text-primary-dark-200">{children}</h3>
      {action}
    </div>
  );
};

export default SectionHeading;
