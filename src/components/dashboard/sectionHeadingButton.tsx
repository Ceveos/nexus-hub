"use client";
import { Button } from "../catalyst/button";

export interface ButtonAction {
  title: string;
  action: (target: HTMLButtonElement) => void;
}

interface Props {
  className?: string;
  children: React.ReactNode;
  action: () => void;
}

const SectionHeadingButton: React.FC<Props> = ({ children, className, action }) => {
  return (
    <div className="mt-3 sm:ml-4 sm:mt-0">
      <Button
        className={className}
        color="accent"
        onClick={action}>
        {children}
      </Button>
    </div>
  );
}

export default SectionHeadingButton;
