import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/auth.css";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.fullName);
      toast.success("Account created! Welcome to Nexora 🚀");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Nexora</h1>
          <p>Create your account and start connecting</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" type="text" name="fullName"
              placeholder="John Doe" value={form.fullName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Username *</label>
            <input className="form-input" type="text" name="username"
              placeholder="johndoe" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input className="form-input" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input className="form-input" type="password" name="password"
              placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;