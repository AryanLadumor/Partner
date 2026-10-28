import React from "react";

const ProfileCardPreview = ({ user }) => {
  const { firstName, lastName, age, gender, photoURL, about, skills } = user;

  // Modern gender emblem assignment
  const getGenderEmblem = (g) => {
    switch (g?.toLowerCase()) {
      case "male": return { icon: "♂", style: "badge-primary" };
      case "female": return { icon: "♀", style: "badge-secondary" };
      default: return { icon: "⚧", style: "badge-ghost" };
    }
  };

  const emblem = getGenderEmblem(gender);

  return (
    <div className="card w-full max-w-sm bg-base-200 border border-base-300 shadow-2xl overflow-hidden shrink-0" style={{ height: "540px" }}>
      {/* Profile Image Section */}
      <div className="relative h-1/2 w-full bg-base-300 shrink-0">
        <img
          src={photoURL || "https://example.com/default-avatar.png"}
          alt="Preview profile avatar"
          className="w-full h-full object-cover select-none pointer-events-none"
          width="384"
          height="270"
        />

        {/* Subtle gradient scrim over picture for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-200 via-transparent to-transparent opacity-60" />

        {/* Core Descriptive Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <span className={`badge ${emblem.style} font-bold tracking-wide shadow-md px-2.5 py-1 text-xs gap-1`}>
            <span aria-hidden="true">{emblem.icon}</span> {gender || "Developer"}
          </span>
          <span className="badge bg-neutral text-neutral-content font-black tracking-wide shadow-md px-3 py-1 text-xs">
            {age || "—"} YRS
          </span>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="card-body p-5 flex flex-col justify-between h-1/2 bg-base-200 min-w-0">
        <div className="min-w-0">
          {/* Identity Title Heading */}
          <h3 className="text-xl font-bold tracking-tight text-base-content flex items-baseline gap-1.5 min-w-0">
            <span className="truncate">{firstName || "Your Name"}</span>
            {lastName && (
              <span className="font-serif italic font-normal text-base-content/60 text-lg truncate">
                {lastName}
              </span>
            )}
          </h3>

          {/* Profile Bio Description */}
          <p className="text-sm text-base-content/70 mt-2 line-clamp-3 leading-relaxed font-medium min-h-[4.25rem] break-words">
            {about || "Tell other local developers about your background, projects, or stack interests..."}
          </p>
        </div>

        {/* Technical Skills Array */}
        <div className="mt-2 min-w-0">
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-16">
            {skills && skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-sm bg-base-300 text-base-content/80 border-base-300 font-bold uppercase tracking-wider text-[10px] truncate"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-base-content/40 font-medium">No skills cataloged</span>
            )}
          </div>
        </div>

        {/* Professional Static Footer Badge (Replaces Match Swipe Buttons) */}
        <div className="mt-4 pt-3 border-t border-base-300/40 w-full flex items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-success bg-success/10 border border-success/20 px-4 py-2 rounded-xl flex items-center gap-1.5 w-full justify-center">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true"></span>
            Public Discoverable Card
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProfileCardPreview;