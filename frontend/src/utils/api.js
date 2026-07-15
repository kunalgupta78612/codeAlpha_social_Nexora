// ============================================================
// Nexora — Axios API Instance
// ============================================================

import axios from "axios";

// Create an axios instance with our backend base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ── Request Interceptor ──────────────────────────────────────
// Automatically attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("nexora_user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────
// Handle global errors (e.g., token expired → logout)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nexora_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth Endpoints ───────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ── User Endpoints ───────────────────────────────────────────
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateProfile = (data) => API.put("/users/profile", data);
export const followUser = (id) => API.post(`/users/${id}/follow`);
export const searchUsers = (query) => API.get(`/users/search?q=${query}`);
export const getUserPosts = (id) => API.get(`/users/${id}/posts`);
export const getSuggestions = () => API.get("/users/suggestions");

// ── Post Endpoints ───────────────────────────────────────────
export const createPost = (data) => API.post("/posts", data);
export const getFeed = (page = 1) => API.get(`/posts/feed?page=${page}`);
export const getPostById = (id) => API.get(`/posts/${id}`);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.post(`/posts/${id}/like`);
export const addComment = (id, data) => API.post(`/posts/${id}/comment`, data);
export const deleteComment = (postId, commentId) =>
  API.delete(`/posts/${postId}/comment/${commentId}`);

export default API;