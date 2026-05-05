import NavLogo from './NavLogo';
import NavLink from './NavLink';
import ContactButton from './ContactButton';
import './Navbar.css';

/** Navigation item configuration */
interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME',     href: '#hero' },
  { label: 'ABOUT',    href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'JOURNAL',  href: '#journal' },
];

/**
 * Navbar — Floating pill navigation bar.
 * Fixed to the bottom-center of the viewport.
 * Composes NavLogo, NavLink, and ContactButton.
 */
export default function Navbar() {
  return (
    <nav className="navbar" id="main-nav" role="navigation" aria-label="Main navigation">
      <div className="navbar__pill">
        <NavLogo />

        <ul className="navbar__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="navbar__item">
              <NavLink href={item.href}>{item.label}</NavLink>
            </li>
          ))}
        </ul>

        <ContactButton href="#footer">CONTACT</ContactButton>
      </div>
    </nav>
  );
}
