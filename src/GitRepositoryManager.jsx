import React, { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Trash2,
  GitCommit,
  FileText,
  Folder,
  Clock,
  User,
  Hash,
  AlertCircle,
  Loader,
  Terminal,
  GitBranch,
  Code,
  Activity,
  Database,
  Zap,
  ChevronRight,
} from "lucide-react";

const GitRepositoryManager = ({ repositoryId }) => {
  // Simulated data for demo - replace with your actual useGit hook
  const [commits] = useState([
    {
      hash: "a1b2c3d4e5f6g7h8",
      message: "Initial commit with project structure",
      authorName: "John Doe",
      createdAt: "2024-01-15T10:30:00Z",
      files: ["src/main.js", "package.json", "README.md"]
    },
    {
      hash: "b2c3d4e5f6g7h8i9",
      message: "Add authentication module",
      authorName: "Jane Smith",
      createdAt: "2024-01-14T15:45:00Z",
      files: ["src/auth.js", "src/middleware.js"]
    }
  ]);

  const [repositoryFiles] = useState([
    {
      fileName: "main.js",
      filePath: "/src/",
      size: 2048,
      updatedAt: "2024-01-15T10:30:00Z"
    },
    {
      fileName: "package.json",
      filePath: "/",
      size: 1024,
      updatedAt: "2024-01-15T10:30:00Z"
    }
  ]);

  const [isLoading] = useState(false);
  const [error] = useState(null);
  const [activeTab, setActiveTab] = useState("files");
  const [commitMessage, setCommitMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadPath, setUploadPath] = useState("");
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulated functions - replace with your actual functions
  const handleFileSelect = (e) => setSelectedFiles(e.target.files);

  const handleCommit = () => {
    if (!commitMessage.trim() || !selectedFiles || selectedFiles.length === 0) return;
    // Your commit logic here
    setCommitMessage("");
    setSelectedFiles(null);
    // Reset file input
    const fileInput = document.getElementById("commit-files");
    if (fileInput) fileInput.value = "";
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // navigate("/login"); // Uncomment when using with router
  };

  const handleFileUpload = () => {
    const fileInput = document.getElementById("single-file");
    const file = fileInput?.files[0];
    if (!file) return;
    // Your upload logic here
    setUploadPath("");
    if (fileInput) fileInput.value = "";
  };

  const handleFileDelete = async (fileName, filePath) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      // Your delete logic here
    }
  };

  const handleFileDownload = async (fileName, filePath) => {
    // Your download logic here
  };

  const handleCommitSelect = async (commit) => {
    setSelectedCommit(commit);
    // Your commit selection logic here
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const fileStats = {
    totalFiles: repositoryFiles.length,
    totalSize: repositoryFiles.reduce((acc, file) => acc + (file.size || 0), 0)
  };

  const tabs = [
    { key: "files", label: "Files", icon: FileText, color: "blue" },
    { key: "commits", label: "Commits", icon: GitCommit, color: "purple" },
    { key: "upload", label: "Upload", icon: Upload, color: "green" },
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-400',
        border: 'border-blue-500',
        shadow: 'shadow-blue-500'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-400',
        border: 'border-purple-500',
        shadow: 'shadow-purple-500'
      },
      green: {
        bg: 'bg-green-500',
        text: 'text-green-400',
        border: 'border-green-500',
        shadow: 'shadow-green-500'
      },
      yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
        shadow: 'shadow-yellow-500'
      }
    };
    return colorMap[color]?.[type] || '';
  };

  return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
              className="absolute w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse"
              style={{
                left: mousePosition.x * 0.01,
                top: mousePosition.y * 0.01,
              }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-black to-purple-900/5" />
        </div>

        {/* Grid Pattern */}
        <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}
        />

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          {/* Futuristic Header */}
          <header className="mb-8 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Repository Control Center
                  </h1>
                  <p className="text-gray-400">Advanced version control interface</p>
                </div>
              </div>
              <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300"
              >
                Logout
              </button>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Files", value: fileStats.totalFiles, icon: Database, color: "blue" },
                { label: "Size", value: formatFileSize(fileStats.totalSize), icon: Activity, color: "green" },
                { label: "Commits", value: commits.length, icon: GitCommit, color: "purple" },
                { label: "Status", value: "Active", icon: Zap, color: "yellow" },
              ].map((stat, index) => (
                  <div key={index} className="p-4 bg-black/30 border border-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${getColorClasses(stat.color, 'text')}`} />
                      <span className={`${getColorClasses(stat.color, 'text')} text-sm font-semibold`}>
                    {stat.value}
                  </span>
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
              ))}
            </div>
          </header>

          {/* Error Display */}
          {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-300">{error}</span>
              </div>
          )}

          {/* Loading Display */}
          {isLoading && (
              <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center">
                <Loader className="w-5 h-5 text-blue-400 mr-3 animate-spin" />
                <span className="text-blue-300">Processing...</span>
              </div>
          )}

          {/* Futuristic Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 p-2 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl">
              {tabs.map(({ key, label, icon: Icon, color }) => (
                  <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                          activeTab === key
                              ? `bg-${color}-500/20 border border-${color}-500/30 text-${color}-300 shadow-lg shadow-${color}-500/20`
                              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Files Tab */}
            {activeTab === "files" && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Repository Files</span>
                    </h2>
                    <div className="text-sm text-gray-400">
                      {repositoryFiles.length} files tracked
                    </div>
                  </div>

                  {repositoryFiles.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Folder className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">No files in this repository</p>
                      </div>
                  ) : (
                      <div className="space-y-2">
                        {repositoryFiles.map((file, index) => (
                            <div
                                key={index}
                                className="group p-4 bg-black/30 border border-gray-700/30 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-white">{file.fileName}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                      <span>{file.filePath}</span>
                                      <span>{formatFileSize(file.size || 0)}</span>
                                      <span>{formatDate(file.updatedAt)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                      onClick={() => handleFileDownload(file.fileName, file.filePath)}
                                      className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
                                  >
                                    <Download className="w-4 h-4 text-green-400" />
                                  </button>
                                  <button
                                      onClick={() => handleFileDelete(file.fileName, file.filePath)}
                                      className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* Commits Tab */}
            {activeTab === "commits" && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center space-x-2">
                      <GitCommit className="w-5 h-5 text-purple-400" />
                      <span>Commit Timeline</span>
                    </h2>

                    {/* Commit Form */}
                    <div className="flex items-center space-x-3">
                      <input
                          type="text"
                          placeholder="Commit message"
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                          id="commit-files"
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30"
                      />
                      <button
                          onClick={handleCommit}
                          disabled={!commitMessage.trim() || !selectedFiles || selectedFiles.length === 0}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <GitCommit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {commits.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <GitCommit className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400">No commits yet</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        {commits.map((commit, index) => (
                            <div
                                key={commit.hash}
                                className={`group p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                                    selectedCommit?.hash === commit.hash
                                        ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                                        : "border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/30"
                                }`}
                                onClick={() => handleCommitSelect(commit)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Hash className="w-5 h-5 text-purple-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <code className="text-sm font-mono text-gray-400 bg-black/50 px-2 py-1 rounded">
                                        {commit.hash.substring(0, 8)}
                                      </code>
                                    </div>
                                    <h3 className="font-medium text-white mb-2">{commit.message}</h3>
                                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                                      <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4" />
                                        <span>{commit.authorName}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(commit.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">
                            {commit.files?.length || 0} files
                          </span>
                                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                </div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Upload className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-semibold">Upload Files</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select File
                      </label>
                      <div className="relative">
                        <input
                            id="single-file"
                            type="file"
                            className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-green-500/20 file:text-green-300 hover:file:bg-green-500/30 file:transition-all file:duration-300 bg-black/50 border border-gray-600 rounded-lg p-3"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Upload Path
                      </label>
                      <input
                          type="text"
                          placeholder="e.g., /src/main/java/"
                          value={uploadPath}
                          onChange={(e) => setUploadPath(e.target.value)}
                          className="block w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <button
                        onClick={handleFileUpload}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Deploy File</span>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default GitRepositoryManager;