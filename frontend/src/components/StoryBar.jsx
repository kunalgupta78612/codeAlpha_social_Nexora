import { useAuth } from "../context/AuthContext";

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
    <div className="flex gap-4 p-4 bg-bg-glass backdrop-blur-[20px] border border-border rounded-[20px] overflow-x-auto mb-5 [&::-webkit-scrollbar]:hidden">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
          <div
            className="w-16 h-16 rounded-full p-[2px] flex items-center justify-center"
            style={{ background: story.isYou ? "transparent" : `linear-gradient(135deg, ${story.color}, #ff6b9d)` }}
          >
            <div className="w-[58px] h-[58px] rounded-full bg-bg-primary p-[2px] flex items-center justify-center">
              {story.isYou ? (
                <div className="relative">
                  <img
                    src={user?.profileImage
                      ? `${import.meta.env.VITE_UPLOADS_URL}/${user.profileImage}`
                      : `https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff`}
                    alt="you"
                    className="w-[52px] h-[52px] rounded-full object-cover bg-bg-secondary border-2 border-border"
                  />
                  <span className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-accent rounded-full flex items-center justify-center text-xs text-white font-bold">+</span>
                </div>
              ) : (
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold"
                  style={{ background: story.color + "33" }}
                >
                  <span style={{ color: story.color, fontSize: 20 }}>
                    {story.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] text-text-secondary max-w-[64px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
            {story.isYou ? "Your Story" : story.username}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;