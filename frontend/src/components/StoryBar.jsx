import { useAuth } from "../context/AuthContext";
import "../styles/components.css";

// Stories are UI-only in this version (no backend needed for portfolio)
const StoryBar = () => {
  const { user } = useAuth();

  const stories = [
    { id: "your", username: "Your Story", isYou: true },
    { id: 1, username: "alex_dev", color: "#6c63ff" },
    { id: 2, username: "sarah_ui", color: "#ff6b9d" },
    { id: 3, username: "mike_x", color: "#4ade80" },
    { id: 4, username: "design_co", color: "#fbbf24" },
    { id: 5, username: "john_doe", color: "#60a5fa" },
  ];

  return (
    <div className="story-bar">
      {stories.map((story) => (
        <div key={story.id} className="story-item">
          <div
            className="story-ring"
            style={{ background: story.isYou ? "transparent" : `linear-gradient(135deg, ${story.color}, #ff6b9d)` }}
          >
            <div className="story-avatar-wrap">
              {story.isYou ? (
                <div className="story-add">
                  <img
                    src={user?.profileImage
                      ? `${import.meta.env.VITE_UPLOADS_URL}/${user.profileImage}`
                      : `https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff`}
                    alt="you"
                    className="avatar"
                    style={{ width: 52, height: 52 }}
                  />
                  <span className="story-plus">+</span>
                </div>
              ) : (
                <div
                  className="story-placeholder"
                  style={{ background: story.color + "33" }}
                >
                  <span style={{ color: story.color, fontSize: 20 }}>
                    {story.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="story-name">
            {story.isYou ? "Your Story" : story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;