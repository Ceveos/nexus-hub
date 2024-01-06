import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function CardContainer({ children }: Props) {

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {children}
    </ul>
  );
}
