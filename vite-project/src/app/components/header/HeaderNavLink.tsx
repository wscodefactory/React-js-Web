import { Link } from "react-router";
import type { NavigationLinkItem } from "@/app/types/navigation";

type HeaderNavLinkProps = {
  isActive: boolean;
  item: NavigationLinkItem;
  label: string;
};

export function HeaderNavLink({ isActive, item, label }: HeaderNavLinkProps) {
  const activeClass = isActive ? "header-nav-link-active" : "header-nav-link-inactive";

  return (
    <Link to={item.path} className={`header-nav-link ${activeClass}`}>
      {label}
    </Link>
  );
}
