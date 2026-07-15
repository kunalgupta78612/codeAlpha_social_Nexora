import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    website: user?.website || "",
    location: user?.location || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append("profileImage", imageFile);

      const { data } = await updateProfile(formData);
      updateUser(data);
      toast.success("Profile updated! ✅");
      navigate(`/profile/${user._id}`);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = imagePreview || (user?.profileImage
    ? `${import.meta.env.VITE_UPLOADS_URL}/${user.profileImage}`
    : `https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff&size=200`);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="pt-[calc(var(--navbar-height)+24px)] md:pl-[calc(var(--sidebar-width)+24px)] pl-4 pr-4 md:pr-6 max-w-[600px] mx-auto pb-10">
        <div className="glass-card p-8">
          <h2 className="text-[20px] font-bold mb-7">Edit Profile</h2>

          {/* Avatar Upload */}
          <div className="flex items-center gap-5 mb-7">
            <label htmlFor="avatar-upload" className="relative cursor-pointer group">
              <img src={currentAvatar} alt="avatar"
                className="w-20 h-20 rounded-full object-cover bg-bg-secondary border-2 border-border" />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <FiCamera size={20} color="white" />
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*"
              className="hidden" onChange={handleImageChange} />
            <div>
              <div className="font-semibold">{user?.username}</div>
              <label htmlFor="avatar-upload"
                className="text-[13px] text-accent cursor-pointer hover:underline">
                Change profile photo
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-secondary">Full Name</label>
              <input className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none" name="fullName"
                placeholder="Your full name" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-secondary">Bio</label>
              <textarea className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none resize-none" name="bio" rows={3}
                placeholder="Tell people about yourself..." maxLength={160}
                value={form.bio} onChange={handleChange} />
              <span className="text-xs text-text-muted text-right">
                {form.bio.length}/160
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-secondary">Website</label>
              <input className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none" name="website"
                placeholder="https://yoursite.com" value={form.website} onChange={handleChange} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-secondary">Location</label>
              <input className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none" name="location"
                placeholder="City, Country" value={form.location} onChange={handleChange} />
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:bg-accent-light"
                onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-accent text-white hover:bg-accent-hover hover:shadow-glow hover:-translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;