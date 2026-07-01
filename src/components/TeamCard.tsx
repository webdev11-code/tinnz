import React from "react";
import { TeamMember } from "../data/teamData";

interface TeamCardProps {
  member: TeamMember;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="card-depth p-5 flex flex-col items-center text-center hover:border-[var(--accent-blue)] group">
      
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border-color)] group-hover:border-[var(--accent-blue)] transition-all duration-300 mb-4.5">
        {imgError ? (
          <div className="w-full h-full bg-[var(--accent-blue)]/10 flex items-center justify-center">
            <i className="fas fa-user text-2xl text-[var(--accent-blue)]/40" />
          </div>
        ) : (
          <img
            src={member.image_url}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      
      <h3 className="text-base font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors">
        {member.name}
      </h3>
      <span className="text-xs font-semibold text-[var(--text-secondary)] mt-1">
        {member.role}
      </span>

      
      {member.socials && (
        <div className="flex items-center gap-3.5 mt-5">
          {member.socials.discord && (
            <a
              href={member.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-indigo-500 transition-colors text-sm"
              aria-label={`${member.name} Discord`}
            >
              <i className="fab fa-discord" />
            </a>
          )}
          {member.socials.instagram && (
            <a
              href={member.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-pink-500 transition-colors text-sm"
              aria-label={`${member.name} Instagram`}
            >
              <i className="fab fa-instagram" />
            </a>
          )}
          {member.socials.whatsapp && (
            <a
              href={member.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-green-500 transition-colors text-sm"
              aria-label={`${member.name} WhatsApp`}
            >
              <i className="fab fa-whatsapp" />
            </a>
          )}
          {member.socials.tiktok && (
            <a
              href={member.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-sm"
              aria-label={`${member.name} TikTok`}
            >
              <i className="fab fa-tiktok" />
            </a>
          )}
          {member.socials.portfolio && (
            <a
              href={member.socials.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-blue-500 transition-colors text-sm"
              aria-label={`${member.name} Portfolio`}
            >
              <i className="fas fa-globe" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
