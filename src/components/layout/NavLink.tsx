'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  to?: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, to, ...props }, ref) => {
    const pathname = usePathname();
    const targetHref = href || to || "#";
    const isActive = pathname === targetHref;

    return (
      <Link
        ref={ref}
        href={targetHref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
export default NavLink;
