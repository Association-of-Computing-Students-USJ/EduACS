import { useEffect, useRef } from 'react';
import './OurTeam.css';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image?: string;
  detail: string;
  icon: string;
  objectPosition?: string;
  imageScale?: number;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'member-1', name: 'Kavishka Venuka',  position: 'Project Chair',        image: '/project-chair.png',        detail: 'Leadership & Vision',      icon: 'ti-crown'     },
  { id: 'member-2', name: 'Sayumi Dihara',    position: 'Secretary',            image: '/secretary.jpeg',            detail: 'Communications & Records', icon: 'ti-edit',      imageScale: 1.1, objectPosition: 'center 15%' },
  { id: 'member-3', name: 'Chamod Chandupa',  position: 'Vice Chair',           image: '/vice-chair.png',            detail: 'Operations & Strategy',    icon: 'ti-user',      imageScale: 1.1, objectPosition: 'center 15%' },
  { id: 'member-4', name: 'Ravindu Yehan',    position: 'Finance Head',         image: '/finance-head.png',          detail: 'Budgets & Finance',        icon: 'ti-chart-bar'  },
  { id: 'member-5', name: 'Vishmi Dewmini',   position: 'Editorial Head',       image: '/editorial-head.jpg',        detail: 'Content & Editorial',      icon: 'ti-file-text'  },
  { id: 'member-6', name: 'V G Hashan',       position: 'Teaching Panel Head',  image: '/teaching-panl-head.png',    detail: 'Teaching & Workshops',     icon: 'ti-school'     },
  { id: 'member-7', name: 'Kavinya Pieris',   position: 'Academic Panel Head',  image: '/academic-panel-head.jpeg',  detail: 'Academic Programs',        icon: 'ti-book'       },
];

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('');
}

function TeamCard({ member, index, featured = false }: { member: TeamMember; index: number; featured?: boolean }) {
  return (
    <div className={`team-card reveal reveal-delay-${(index % 4) + 1}${featured ? ' team-card--featured' : ''}`}>
      <span className="team-card__num">
        {String(index + 1).padStart(2, '0')}{featured ? ' — Chair' : ''}
      </span>

      <div className="team-card__body">
        <div className="team-card__avatar">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              style={{
                '--avatar-position': member.objectPosition || 'center top',
                '--avatar-scale': member.imageScale || 1.4,
                '--avatar-hover-scale': member.imageScale ? member.imageScale + 0.15 : 1.55
              } as React.CSSProperties}
            />
          ) : (
            <span className="team-card__initials">{getInitials(member.name)}</span>
          )}
        </div>

        <div className="team-card__info">
          <h3 className="team-card__name">{member.name}</h3>
          <p className={`team-card__position${featured ? ' team-card__position--accent' : ''}`}>
            {member.position}
          </p>

          {featured ? (
            <div className="team-card__stats">
              <div className="team-card__stat">
                <span className="team-card__stat-num">7</span>
                <span className="team-card__stat-lbl">Members</span>
              </div>
              <div className="team-card__stat">
                <span className="team-card__stat-num">USJ</span>
                <span className="team-card__stat-lbl">Faculty</span>
              </div>
            </div>
          ) : (
            <div className="team-card__expand">
              <div className="team-card__expand-row">
                <i className={`ti ${member.icon}`} aria-hidden="true" />
                {member.detail}
              </div>
            </div>
          )}
        </div>
      </div>

      {!featured && (
        <div className="team-card__icon-badge" aria-hidden="true">
          <i className={`ti ${member.icon}`} />
        </div>
      )}
    </div>
  );
}

export default function OurTeam() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const [chair, ...rest] = TEAM_MEMBERS;
  const row1 = rest.slice(0, 2);   // members 2–3
  const row2 = rest.slice(2);      // members 4–7

  return (
    <section className="our-team" id="our-team" ref={sectionRef}>
      <div className="our-team__content container">

        <div className="our-team__header reveal">
          <span className="our-team__eyebrow">Our Team</span>
          <h2 className="our-team__heading">
            The people <span className="our-team__heading--muted">behind the work.</span>
          </h2>
          <p className="our-team__subtext">
            A dedicated group driving computing education at the University of Sri Jayewardenepura.
          </p>
        </div>

        {/* Row 1: Chair + 2 members + year badge */}
        <div className="our-team__row">
          <TeamCard member={chair} index={0} featured />

          {row1.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i + 1} />
          ))}

          <div className="team-card team-card--info reveal reveal-delay-4">
            <div className="team-card__info-icon" aria-hidden="true">
              <i className="ti ti-users" />
            </div>
            <strong className="team-card__year">2025</strong>
            <p className="team-card__year-label">Executive<br />Committee</p>
          </div>
        </div>

        {/* Row 2: 4 members */}
        <div className="our-team__row">
          {row2.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i + 3} />
          ))}
        </div>

      </div>
    </section>
  );
}