/**
 * NavLogo — Brand logo thumbnail for the navbar.
 * SRP: Renders the favicon as an interactive logo element.
 */
export default function NavLogo() {
  return (
    <a href="#hero" className="nav-logo" aria-label="EduACS Home">
      <img
        src="/EDUACS 2.0.png"
        alt="EduACS logo"
        className="nav-logo__img"
        width={48}
        height={48}
      />
    </a>
  );
}
