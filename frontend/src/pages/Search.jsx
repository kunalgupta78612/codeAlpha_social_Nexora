import { useState, useEffect, useRef } from "react";
import { searchUsers } from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import Loader from "../components/Loader";
import { FiSearch } from "react-icons/fi";

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
      <div className="flex min-h-screen pt-[var(--navbar-height)]">
        <div className="flex-1 ml-0 md:ml-[var(--sidebar-width)] p-4 md:p-6 max-w-full md:max-w-[680px]">
          <h2 className="mb-5 text-[22px] font-bold">
            Search Users
          </h2>

          {/* Search Input */}
          <div className="glass-card p-4 mb-5">
            <div className="flex items-center gap-3">
              <FiSearch size={20} className="text-text-muted" />
              <input
                className="flex-1 border-none bg-transparent py-1 text-text-primary text-sm placeholder:text-text-muted outline-none"
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
            <div className="text-center p-10 text-text-muted flex flex-col items-center">
              <FiSearch size={40} className="mb-3 opacity-30" />
              <p>No users found for "{query}"</p>
            </div>
          )}

          {!loading && results.map((u) => (
            <UserCard key={u._id} userData={u} />
          ))}

          {!query && !searched && (
            <div className="text-center py-16 text-text-muted flex flex-col items-center">
              <FiSearch size={48} className="mb-4 opacity-20" />
              <p className="text-base">Search for people to connect with</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;