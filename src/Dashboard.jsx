"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  MessageSquare,
  Plus,
  FileText,
  User,
  Heart,
  Send,
  GitBranch,
  Star,
  Code,
  Search,
  Bell,
  Home,
  Folder,
  Eye,
  GitCommit,
  Bookmark,
} from "lucide-react";
import axios from "axios";
import { useRepository } from "./contexts/RepositoryContext";
import Navbar from "./components/Navbar";

const API_BASE = "https://vault-backend-susi.onrender.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { repositories, fetchRepositories, repoError } = useRepository();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handleGit = () => {
    navigate("/git-repository-manager");
  };

  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
  });
  const [commentForms, setCommentForms] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("feed");

  // Post-related functions
  const fetchPosts = async (page = 0) => {
    try {
      const res = await axiosInstance.get(`/posts?page=${page}&size=10`);
      setPosts(res.data.content);
      setCurrentPage(res.data.number);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setError("Failed to fetch posts");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    try {
      await axiosInstance.post("/posts", postForm);
      setPostForm({ title: "", content: "" });
      fetchPosts();
      setError("");
    } catch (err) {
      console.error("Failed to create post", err);
      setError("Failed to create post");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/${postId}/like`);
      // Update the posts state to reflect the like change
      setPosts(
          posts.map((post) =>
              post.id === postId
                  ? {
                    ...post,
                    liked: res.data.liked,
                    likeCount: post.likeCount + (res.data.liked ? 1 : -1),
                  }
                  : post
          )
      );
    } catch (err) {
      console.error("Failed to like/unlike post", err);
    }
  };

  const handleAddComment = async (postId) => {
    const commentContent = commentForms[postId];
    if (!commentContent?.trim()) {
      return;
    }

    try {
      const res = await axiosInstance.post(`/posts/${postId}/comments`, {
        content: commentContent,
      });

      // Update the posts state to add the new comment
      setPosts(
          posts.map((post) =>
              post.id === postId
                  ? { ...post, comments: [...(post.comments || []), res.data] }
                  : post
          )
      );

      // Clear the comment form
      setCommentForms({ ...commentForms, [postId]: "" });
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`);
      setPosts(
          posts.map((post) =>
              post.id === postId ? { ...post, comments: res.data } : post
          )
      );
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      Python: "bg-blue-400",
      TypeScript: "bg-blue-500",
      Java: "bg-orange-400",
      Go: "bg-cyan-400",
      Rust: "bg-orange-500",
      default: "bg-gray-400",
    };
    return colors[language] || colors.default;
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white">
        {/* Modern Dark Navbar */}
        <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                    <GitBranch className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    Vault
                  </h1>
                </div>

                <div className="hidden md:flex space-x-1">
                  <button
                      onClick={() => setActiveTab("feed")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          activeTab === "feed"
                              ? "bg-violet-500/20 text-violet-300 shadow-lg border border-violet-500/30"
                              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                  >
                    <Home className="w-4 h-4 inline mr-2" />
                    Feed
                  </button>
                  <button
                      onClick={() => setActiveTab("repositories")}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          activeTab === "repositories"
                              ? "bg-violet-500/20 text-violet-300 shadow-lg border border-violet-500/30"
                              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                  >
                    <Folder className="w-4 h-4 inline mr-2" />
                    Repositories
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 transform hover:scale-110">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-all duration-300 transform hover:scale-110 relative">
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </button>
                <button
                    onClick={handleGit}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105"
                >
                  <GitBranch className="w-4 h-4 inline mr-2" />
                  Git Manager
                </button>
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Tab Selector */}
          <div className="md:hidden flex space-x-2 mb-6">
            <button
                onClick={() => setActiveTab("feed")}
                className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "feed"
                        ? "bg-gray-800/80 shadow-xl text-violet-300 border border-violet-500/30 backdrop-blur-xl"
                        : "bg-gray-800/40 text-gray-400 hover:bg-gray-800/60 hover:text-white backdrop-blur-xl"
                }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Feed
            </button>
            <button
                onClick={() => setActiveTab("repositories")}
                className={`flex-1 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "repositories"
                        ? "bg-gray-800/80 shadow-xl text-violet-300 border border-violet-500/30 backdrop-blur-xl"
                        : "bg-gray-800/40 text-gray-400 hover:bg-gray-800/60 hover:text-white backdrop-blur-xl"
                }`}
            >
              <Folder className="w-4 h-4 inline mr-2" />
              Repositories
            </button>
          </div>

          {/* Feed Tab */}
          {activeTab === "feed" && (
              <div className="space-y-8 animate-fade-in">
                {/* Create Post Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 transform hover:scale-[1.02]">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 animate-pulse">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      Share Your Thoughts
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Post Title *
                      </label>
                      <input
                          type="text"
                          placeholder="What's on your mind?"
                          value={postForm.title}
                          onChange={(e) =>
                              setPostForm({ ...postForm, title: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl text-white placeholder-gray-400 hover:bg-gray-900/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Content *
                      </label>
                      <textarea
                          placeholder="Write your post content here..."
                          rows={4}
                          value={postForm.content}
                          onChange={(e) =>
                              setPostForm({ ...postForm, content: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl text-white placeholder-gray-400 hover:bg-gray-900/70 resize-none"
                      />
                    </div>

                    <button
                        onClick={handleCreatePost}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center space-x-2 shadow-xl hover:shadow-emerald-500/25 transform hover:scale-105 hover:-translate-y-1"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Create Post</span>
                    </button>
                  </div>

                  {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mt-6 backdrop-blur-xl animate-fade-in">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                  )}
                </div>

                {/* Posts Feed */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-6 h-6 text-violet-400" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      Recent Posts
                    </h2>
                  </div>

                  {posts.length === 0 ? (
                      <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-16 text-center shadow-2xl animate-fade-in">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <MessageSquare className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                          No posts yet
                        </h3>
                        <p className="text-gray-400 text-lg">
                          Create your first post to get started and connect with the community.
                        </p>
                      </div>
                  ) : (
                      posts.map((post, index) => (
                          <div
                              key={post.id}
                              className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in"
                              style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="p-8">
                              <div className="flex items-start space-x-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                            <span className="font-bold text-white text-lg">
                              {post.authorUsername}
                            </span>
                                    <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded-lg backdrop-blur-xl">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                                  </div>
                                  <h3 className="text-xl font-bold text-white mb-3">
                                    {post.title}
                                  </h3>
                                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                                    {post.content}
                                  </p>

                                  {/* Post Actions */}
                                  <div className="flex items-center space-x-6 text-sm text-gray-400 border-t border-gray-700/50 pt-4">
                                    <button
                                        onClick={() => handleLikePost(post.id)}
                                        className={`flex items-center space-x-2 hover:text-red-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transform hover:scale-110 ${
                                            post.liked ? "text-red-400 bg-red-500/10" : ""
                                        }`}
                                    >
                                      <Heart
                                          className={`w-5 h-5 transition-all duration-300 ${
                                              post.liked ? "fill-current animate-pulse" : ""
                                          }`}
                                      />
                                      <span className="font-medium">{post.likeCount || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => fetchComments(post.id)}
                                        className="flex items-center space-x-2 hover:text-blue-400 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-blue-500/10 transform hover:scale-110"
                                    >
                                      <MessageSquare className="w-5 h-5" />
                                      <span className="font-medium">{post.comments?.length || 0} comments</span>
                                    </button>
                                  </div>

                                  {/* Comments */}
                                  {post.comments && post.comments.length > 0 && (
                                      <div className="mt-6 space-y-4 border-t border-gray-700/50 pt-6 animate-fade-in">
                                        {post.comments.map((comment, commentIndex) => (
                                            <div
                                                key={comment.id}
                                                className="flex items-start space-x-3 p-4 bg-gray-900/50 rounded-2xl backdrop-blur-xl hover:bg-gray-900/70 transition-all duration-300 animate-fade-in"
                                                style={{ animationDelay: `${commentIndex * 50}ms` }}
                                            >
                                              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                      <span className="font-semibold text-sm text-white">
                                        {comment.authorUsername}
                                      </span>
                                                  <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                                </div>
                                                <p className="text-sm text-gray-300">
                                                  {comment.content}
                                                </p>
                                              </div>
                                            </div>
                                        ))}
                                      </div>
                                  )}

                                  {/* Add Comment */}
                                  <div className="mt-6 flex items-center space-x-3">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentForms[post.id] || ""}
                                        onChange={(e) =>
                                            setCommentForms({
                                              ...commentForms,
                                              [post.id]: e.target.value,
                                            })
                                        }
                                        className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm backdrop-blur-xl text-white placeholder-gray-400 transition-all duration-300 hover:bg-gray-900/70"
                                    />
                                    <button
                                        onClick={() => handleAddComment(post.id)}
                                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-violet-500/25 transform hover:scale-110"
                                    >
                                      <Send className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      ))
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-12 animate-fade-in">
                        <button
                            onClick={() => fetchPosts(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-6 py-3 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-sm font-medium text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-xl transform hover:scale-105"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-3 text-sm text-gray-300 bg-gray-700/50 rounded-2xl backdrop-blur-xl">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                        <button
                            onClick={() => fetchPosts(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-6 py-3 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-sm font-medium text-gray-300 hover:bg-gray-800/70 hover:text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-xl transform hover:scale-105"
                        >
                          Next
                        </button>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Repositories Tab */}
          {activeTab === "repositories" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GitBranch className="w-6 h-6 text-violet-400" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                      Your Repositories
                    </h2>
                    <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-sm font-medium border border-violet-500/30 animate-pulse">
                  {repositories.length}
                </span>
                  </div>
                  <button
                      onClick={handleGit}
                      className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-violet-500/25 flex items-center space-x-2 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Repository</span>
                  </button>
                </div>

                {repoError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-xl animate-fade-in">
                      <p className="text-red-400">{repoError}</p>
                    </div>
                )}

                {repositories.length === 0 ? (
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-16 text-center shadow-2xl animate-fade-in">
                      <div className="w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Folder className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No repositories yet
                      </h3>
                      <p className="text-gray-400 text-lg mb-6">
                        Create your first repository to start building amazing projects.
                      </p>
                      <button
                          onClick={handleGit}
                          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-violet-500/25 transform hover:scale-105"
                      >
                        Create Repository
                      </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {repositories.map((repo, index) => (
                          <div
                              key={repo.id}
                              className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-2 transform hover:scale-105 animate-fade-in group"
                              style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                                  <Folder className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg text-white group-hover:text-violet-300 transition-colors duration-300">
                                    {repo.name}
                                  </h3>
                                </div>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-xl transition-all duration-300 transform hover:scale-110">
                                <Bookmark className="w-5 h-5" />
                              </button>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 group-hover:text-gray-300 transition-colors duration-300">
                              {repo.description || "No description available"}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                {repo.language && (
                                    <div className="flex items-center space-x-1">
                                      <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)} animate-pulse`}></div>
                                      <span className="group-hover:text-gray-300 transition-colors duration-300">{repo.language}</span>
                                    </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-4">
                              <button className="flex-1 px-3 py-2 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 hover:text-white text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-xl transform hover:scale-105">
                                <Eye className="w-4 h-4 inline mr-1" />
                                View
                              </button>
                              <button className="flex-1 px-3 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 hover:text-violet-200 text-sm font-medium rounded-xl transition-all duration-300 border border-violet-500/30 transform hover:scale-105">
                                <GitBranch className="w-4 h-4 inline mr-1" />
                                Clone
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          
          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(55, 65, 81, 0.1);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #8b5cf6, #a855f7);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #7c3aed, #9333ea);
          }
        `}</style>
      </div>
  );
}