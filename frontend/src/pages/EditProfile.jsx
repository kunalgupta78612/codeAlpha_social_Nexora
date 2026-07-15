import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiCamera } from "react-icons/fi";
import toast from "react-hot-toast";
import "../styles/profile.css";

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
      <div className="edit-profile-page">
        <div className="edit-profile-card glass-card">
          <h2 className="edit-profile-title">Edit Profile</h2>

          {/* Avatar Upload */}
          <div className="avatar-upload-section">
            <label htmlFor="avatar-upload" className="avatar-upload-label">
              <img src={currentAvatar} alt="avatar"
                className="avatar" style={{ width: 80, height: 80 }} />
              <div className="avatar-upload-overlay">
                <FiCamera size={20} color="white" />
              </div>
            </label>
            <input id="avatar-upload" type="file" accept="image/*"
              style={{ display: "none" }} onChange={handleImageChange} />
            <div>
              <div style={{ fontWeight: 600 }}>{user?.username}</div>
              <label htmlFor="avatar-upload"
                style={{ fontSize: 13, color: "var(--accent)", cursor: "pointer" }}>
                Change profile photo
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" name="fullName"
                placeholder="Your full name" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea className="form-input" name="bio" rows={3}
                placeholder="Tell people about yourself..." maxLength={160}
                value={form.bio} onChange={handleChange}
                style={{ resize: "none" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right" }}>
                {form.bio.length}/160
              </span>
            </div>
            <div className="form-group">
              <label>Website</label>
              <input className="form-input" name="website"
                placeholder="https://yoursite.com" value={form.website} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input className="form-input" name="location"
                placeholder="City, Country" value={form.location} onChange={handleChange} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-outline"
                onClick={() => navigate(-1)} style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary"
                disabled={loading} style={{ flex: 1 }}>
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