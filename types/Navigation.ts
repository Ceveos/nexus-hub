import {
  type ForwardRefExoticComponent,
  type SVGProps,
  type RefAttributes,
} from "react";

export type SVGIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string | undefined;
    titleId?: string | undefined;
  } & RefAttributes<SVGSVGElement>
>;

export type NavigationLink =
  | {
      name: string;
      href: string;
      relative?: boolean;
      segment?: string | null;
      icon: SVGIcon;
      initial?: never;
      badge?: number | string;
    }
  | {
      name: string;
      href: string;
      relative?: boolean;
      segment?: string | null;
      initial: string;
      icon?: never;
      badge?: number | string;
    };

export type NavigationSection = {
  [key: string]: NavigationLink[];
};

export type NavigationItem = NavigationLink | NavigationSection;
