import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CardContainer({ children }: Props) {

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </ul>
  );
}
