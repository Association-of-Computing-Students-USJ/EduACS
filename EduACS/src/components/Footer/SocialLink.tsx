interface SocialLinkProps {
  href: string;
  iconId: string;
  label: string;
}

/**
 * SocialLink — Individual social media icon link.
 * SRP: Renders one SVG sprite icon as a clickable link.
 */
export default function SocialLink({ href, iconId, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="social-link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg className="social-link__icon" aria-hidden="true">
        <use href={`/icons.svg#${iconId}`} />
      </svg>
    </a>
  );
}
