import { type ReactNode } from 'react';

interface ContactButtonProps {
  href: string;
  children: ReactNode;
}

/**
 * ContactButton — Bordered CTA button for the navbar.
 * SRP: Renders a styled call-to-action link with a plus indicator.
 */
export default function ContactButton({ href, children }: ContactButtonProps) {
  return (
    <a href={href} className="contact-btn">
      <span className="contact-btn__text">{children}</span>
      <span className="contact-btn__plus" aria-hidden="true">+</span>
    </a>
  );
}
