import SocialLink from './SocialLink';
import './Footer.css';

/** Social link configuration */
interface SocialItem {
  id: string;
  iconId: string;
  href: string;
  label: string;
}

const SOCIAL_LINKS: SocialItem[] = [
  {
    id: 'github',
    iconId: 'github-icon',
    href: 'https://github.com/Association-of-Computing-Students-USJ',
    label: 'GitHub',
  },
  {
    id: 'discord',
    iconId: 'discord-icon',
    href: '#',
    label: 'Discord',
  },
  {
    id: 'bluesky',
    iconId: 'bluesky-icon',
    href: '#',
    label: 'Bluesky',
  },
  {
    id: 'x',
    iconId: 'x-icon',
    href: '#',
    label: 'X (Twitter)',
  },
];

/**
 * Footer — Dark footer with social links and copyright.
 * Matches the navbar aesthetic for visual cohesion.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer__content container">
        {/* Top row: Brand + Socials */}
        <div className="footer__top">
          <div className="footer__brand">
            <img
              src="/EDUACS 2.0.png"
              alt="EduACS Logo"
              className="footer__logo"
              width={28}
              height={28}
            />
            <span className="footer__brand-name">EduACS</span>
          </div>

          <div className="footer__socials">
            {SOCIAL_LINKS.map((social) => (
              <SocialLink
                key={social.id}
                href={social.href}
                iconId={social.iconId}
                label={social.label}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider" aria-hidden="true" />

        {/* Bottom row: Copyright + Links */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} EduACS — Association of Computing Students, USJ.
          </p>
          <div className="footer__links">
            <a href="#hero" className="footer__link">Home</a>
            <a href="#about" className="footer__link">About</a>
            <a href="#projects" className="footer__link">Projects</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
