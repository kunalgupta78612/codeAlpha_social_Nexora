import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import { FiSearch } from "react-icons/fi";
import "../styles/home.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  // Debounced search — fires 500ms after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await searchUsers(query);
        setResults(data);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="home-page">
        <div className="feed-column">
          <h2 style={{ marginBottom: 20, fontSize: 22, fontWeight: 700 }}>
            Search Users
          </h2>

          {/* Search Input */}
          <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FiSearch size={20} color="var(--text-muted)" />
              <input
                className="form-input"
                style={{ border: "none", background: "transparent", padding: "4px 0" }}
                placeholder="Search by username or name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          {loading && <Loader size="inline" />}

          {!loading && searched && results.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
              <FiSearch size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p>No users found for "{query}"</p>
            </div>
          )}

          {!loading && results.map((u) => (
            <UserCard key={u._id} userData={u} />
          ))}

          {!query && !searched && (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
              <FiSearch size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
              <p style={{ fontSize: 16 }}>Search for people to connect with</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;