import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/userSlice";
import apiCall from "../../utils/axiosInstance";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstname] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");

  const [msgText, setMsgText] = useState("");
  const [toastType, setToastType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingImage(true);
    setMsgText("Uploading image…");
    setToastType("success");

    try {
      const res = await apiCall.post("/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPhotoURL(res.data.photoURL);
      setMsgText("Image uploaded successfully!");
      setToastType("success");
      setTimeout(() => setToastType(null), 3000);
    } catch (error) {
      setMsgText(error?.response?.data?.error || "Failed to upload image.");
      setToastType("fail");
      setTimeout(() => setToastType(null), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!firstName) {
      setMsgText("First name is required.");
      setToastType("fail");
      setTimeout(() => setToastType(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall.patch("/profile/edit", {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(photoURL && { photoURL }),
        ...(about && { about }),
        skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        ...(age && { age: Number(age) }),
        ...(gender && { gender }),
      });

      setMsgText(res.data.msg || "Profile updated successfully!");
      setToastType("success");
      setTimeout(() => setToastType(null), 3000);

      dispatch(addUser(res.data.user));
    } catch (error) {
      setMsgText(error?.response?.data?.msg || "Something went wrong. Please check your fields.");
      setToastType("fail");
      setTimeout(() => setToastType(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card bg-base-200 border border-base-300 w-full shadow-xl rounded-2xl overflow-hidden">
        <form onSubmit={saveProfile} className="card-body p-5 sm:p-7 space-y-4">
          <h3 className="card-title text-lg font-bold tracking-tight text-base-content border-b border-base-300 pb-3 mb-1">
            Personal Information
          </h3>

          {/* Grid splitting first/last name fields across breakpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label htmlFor="first-name" className="label py-1 px-0.5">
                <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">First Name *</span>
              </label>
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                spellCheck={false}
                placeholder="First Name"
                className="input input-bordered w-full h-11 bg-base-100/40 focus:bg-base-100 font-medium rounded-xl text-sm"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-control">
              <label htmlFor="last-name" className="label py-1 px-0.5">
                <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">Last Name</span>
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                spellCheck={false}
                placeholder="Last Name"
                className="input input-bordered w-full h-11 bg-base-100/40 focus:bg-base-100 font-medium rounded-xl text-sm"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Split grid row capturing age selector fields and gender radio cards layout parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div className="form-control">
              <label htmlFor="age" className="label py-1 px-0.5">
                <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">Age (18 - 55)</span>
              </label>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="Age"
                min="18"
                max="55"
                className="input input-bordered w-full h-11 bg-base-100/40 focus:bg-base-100 font-medium rounded-xl text-sm"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-control h-11 justify-center bg-base-100/30 border border-base-300 rounded-xl px-4">
              <div className="flex justify-around gap-2">
                <label htmlFor="gender-male" className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-base-content/70">
                  <input
                    id="gender-male"
                    type="radio"
                    name="profile-gender"
                    className="radio radio-primary radio-sm"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={loading}
                  />
                  Male
                </label>

                <label htmlFor="gender-female" className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-base-content/70">
                  <input
                    id="gender-female"
                    type="radio"
                    name="profile-gender"
                    className="radio radio-secondary radio-sm"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={loading}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          {/* Avatar File Selector */}
          <div className="form-control">
            <label htmlFor="photo-upload" className="label py-1 px-0.5">
              <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">Profile Picture</span>
            </label>
            <div className="flex items-center gap-4 w-full">
              <input
                id="photo-upload"
                name="avatar"
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full bg-base-100/40 rounded-xl text-sm"
                onChange={handleImageUpload}
                disabled={loading || uploadingImage}
              />
              {uploadingImage && (
                <span className="loading loading-spinner text-primary shrink-0" aria-hidden="true"></span>
              )}
            </div>
          </div>

          {/* Core Stack Skill Sets list tags inputs block */}
          <div className="form-control">
            <label htmlFor="skills" className="label py-1 px-0.5">
              <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">Skills (Comma Separated)</span>
            </label>
            <input
              id="skills"
              name="skills"
              type="text"
              placeholder="React, Node, TypeScript, MLOps…"
              className="input input-bordered w-full h-11 bg-base-100/40 focus:bg-base-100 font-medium rounded-xl text-sm"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Biography About Box Controller input block */}
          <div className="form-control">
            <label htmlFor="biography" className="label py-1 px-0.5">
              <span className="label-text text-xs font-bold uppercase text-base-content/60 tracking-wider">Biography</span>
            </label>
            <textarea
              id="biography"
              name="about"
              placeholder="Tell other local developers about your background, projects, or stack interests…"
              className="textarea textarea-bordered w-full h-24 bg-base-100/40 focus:bg-base-100 font-medium rounded-xl p-3 text-sm leading-relaxed"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submission action triggers layout panel container buttons */}
          <div className="form-control pt-4">
            <button
              type="submit"
              className="btn btn-warning w-full h-11 rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-warning/10 transition-[background-color,color,border-color,transform,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-warning/50 text-warning-content"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner" aria-hidden="true"></span> : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Floating System Notification Feedback alert toast layouts popup */}
      {toastType && (
        <div className="toast toast-top toast-end z-[100] p-4">
          <div className={`alert ${toastType === "success" ? "alert-success text-success-content" : "alert-error text-error-content"} shadow-xl rounded-xl font-medium text-sm flex gap-2 border-none`}>
            {toastType === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{msgText}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;