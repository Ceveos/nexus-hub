
import { cn } from "@nextjs/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode
}
const Section: React.FC<Props> = ({ children, className }) => {

  return (
    <div className={cn("bg-white dark:bg-primary-dark-900", className)}>
      {children}
    </div>
  );
};

export default Section;
