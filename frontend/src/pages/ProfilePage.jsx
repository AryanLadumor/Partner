import { useState } from 'react';
import { useSelector } from 'react-redux';
import EditProfile from '../components/profile/EditProfile';
import ProfileCardPreview from '../components/profile/ProfileCardPreview';

const ProfilePage = () => {
  const userInfo = useSelector(store => store.user.userInfo);

  // Live editing state for preview
  const [liveFormData, setLiveFormData] = useState({});

  if (!userInfo) return null;

  // Merge saved user data with live form changes for preview
  const parsedPreviewUser = {
    ...userInfo,
    ...liveFormData,
    skills: liveFormData.skills
      ? (typeof liveFormData.skills === 'string'
          ? liveFormData.skills.split(",").map(s => s.trim()).filter(Boolean)
          : liveFormData.skills)
      : (typeof userInfo.skills === 'string'
          ? userInfo.skills.split(",").map(s => s.trim()).filter(Boolean)
          : userInfo.skills)
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header Wrapper Context */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-black tracking-tight text-base-content">
          Account Settings
        </h2>
        <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mt-1">
          Manage your cluster identity and public profile card
        </p>
      </div>

      {/* Workspace Grid wrapper */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
        
        {/* Form Column Panel */}
        <div className="w-full lg:flex-1 max-w-xl mx-auto lg:mx-0">
          <EditProfile user={userInfo} onFormChange={setLiveFormData} />
        </div>

        {/* Live Visual Preview Column Panel */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center sticky top-24">
          <span className="text-xs font-bold uppercase tracking-widest text-base-content/40 mb-3 bg-base-200 px-3 py-1 rounded-full border border-base-300">
            Live Preview Card
          </span>
          
          {/* Card Container constraints */}
          <div className="w-full max-w-sm shrink-0">
            <ProfileCardPreview user={parsedPreviewUser} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;