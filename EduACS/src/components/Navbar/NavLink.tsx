import { type ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
}

/**
 * NavLink — A single navigation link with hover animation.
 * SRP: Renders one nav anchor with visual feedback.
 */
export default function NavLink({ href, children, isActive = false }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
    >
      <span className="nav-link__text">{children}</span>
      <span className="nav-link__underline" aria-hidden="true" />
    </a>
  );
}
