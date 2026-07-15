import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🎉");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute w-[400px] h-[400px] bg-accent rounded-full blur-[80px] opacity-15 animate-pulse -top-[100px] -left-[100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#ff6b9d] rounded-full blur-[80px] opacity-15 animate-pulse -bottom-[80px] -right-[80px]" style={{ animationDelay: '3s' }} />

      <div className="w-full max-w-[440px] p-7 md:p-10 bg-bg-glass backdrop-blur-[30px] border border-border rounded-2xl shadow-lg relative z-10 animate-[fadeIn_0.5s_ease]">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold bg-gradient-to-br from-accent to-[#ff6b9d] text-transparent bg-clip-text">Nexora</h1>
          <p className="text-text-secondary text-sm mt-1.5">Welcome back — sign in to continue</p>
        </div>

        {error && <div className="bg-danger/10 border border-danger/30 text-danger px-[14px] py-[10px] rounded-lg text-[13px] text-center mb-4">{error}</div>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">Email</label>
            <input
              className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-text-secondary">Password</label>
            <input
              className="w-full bg-bg-glass border border-border rounded-xl px-4 py-3 text-text-primary text-sm transition-all focus:border-accent focus:ring-[3px] focus:ring-accent-light placeholder:text-text-muted outline-none"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="w-full p-[13px] bg-gradient-to-br from-accent to-[#574fd6] text-white rounded-full text-[15px] font-semibold cursor-pointer transition-all mt-2 hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-text-secondary">
          Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;