export type DropdownLink = {
  name: string;
  href: string;
  relative?: boolean;
  action?: never;
  badge?: number | string;
};

export type DropdownAction = {
  name: string;
  action: () => void;
  relative?: never;
  href?: never;
  badge?: number | string;
};

export type DropdownItem = DropdownLink | DropdownAction;