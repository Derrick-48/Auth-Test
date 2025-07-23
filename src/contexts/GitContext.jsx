import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const GitContext = createContext();

export const useGit = () => {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error("useGit must be used within a GitProvider");
  }
  return context;
};

export const GitProvider = ({ children }) => {
  const { axiosInstance } = useAuth();

  // State management
  const [commits, setCommits] = useState([]);
  const [commitFiles, setCommitFiles] = useState([]);
  const [repositoryFiles, setRepositoryFiles] = useState([]);
  const [currentCommit, setCurrentCommit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function to handle errors
  const handleError = (err, defaultMessage) => {
    const errorMessage = err.response?.data?.error || defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, err);
    throw new Error(errorMessage);
  };

  // Clear error state
  const clearError = () => setError("");

  // COMMIT OPERATIONS

  /**
   * Create a new commit with files
   * @param {number} repoId - Repository ID
   * @param {string} message - Commit message
   * @param {FileList} files - Files to commit
   * @returns {Promise<Object>} - Created commit object
   */
  const createCommit = async (repoId, message, files) => {
    setIsLoading(true);
    clearError();

    try {
      const formData = new FormData();
      formData.append("message", message);

      // Add files to form data
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post(
        `/git/repositories/${repoId}/commit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh commit history after successful commit
      await fetchCommitHistory(repoId);

      return response.data;
    } catch (err) {
      handleError(err, "Failed to create commit");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get commit history for a repository
   * @param {number} repoId - Repository ID
   * @returns {Promise<Array>} - Array of commits
   */
  const fetchCommitHistory = async (repoId) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(
        `/git/repositories/${repoId}/commits`
      );
      setCommits(response.data);
      return response.data;
    } catch (err) {
      handleError(err, "Failed to fetch commit history");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get a specific commit by hash
   * @param {string} hash - Commit hash
   * @returns {Promise<Object>} - Commit object
   */
  const fetchCommit = async (hash) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(`/git/commits/${hash}`);
      setCurrentCommit(response.data);
      return response.data;
    } catch (err) {
      handleError(err, "Failed to fetch commit");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get files from a specific commit
   * @param {string} hash - Commit hash
   * @returns {Promise<Array>} - Array of files in the commit
   */
  const fetchCommitFiles = async (hash) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(`/git/commits/${hash}/files`);
      setCommitFiles(response.data);
      return response.data;
    } catch (err) {
      handleError(err, "Failed to fetch commit files");
    } finally {
      setIsLoading(false);
    }
  };

  // REPOSITORY FILE OPERATIONS

  /**
   * Get all files in a repository
   * @param {number} repoId - Repository ID
   * @returns {Promise<Array>} - Array of files in the repository
   */
  const fetchRepositoryFiles = async (repoId) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(
        `/git/repositories/${repoId}/files`
      );
      setRepositoryFiles(response.data);
      return response.data;
    } catch (err) {
      handleError(err, "Failed to fetch repository files");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a single file to repository
   * @param {number} repoId - Repository ID
   * @param {File} file - File to add
   * @param {string} filePath - Path where file should be stored
   * @returns {Promise<Object>} - Success response
   */
  const addFileToRepository = async (repoId, file, filePath) => {
    setIsLoading(true);
    clearError();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filePath", filePath);

      const response = await axiosInstance.post(
        `/git/repositories/${repoId}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh repository files after successful upload
      await fetchRepositoryFiles(repoId);

      return response.data;
    } catch (err) {
      handleError(err, "Failed to add file to repository");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a file from repository
   * @param {number} repoId - Repository ID
   * @param {string} fileName - Name of the file to delete
   * @param {string} filePath - Path of the file to delete
   * @returns {Promise<Object>} - Success response
   */
  const deleteFileFromRepository = async (repoId, fileName, filePath) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.delete(
        `/git/repositories/${repoId}/files`,
        {
          params: { fileName, filePath },
        }
      );

      // Refresh repository files after successful deletion
      await fetchRepositoryFiles(repoId);

      return response.data;
    } catch (err) {
      handleError(err, "Failed to delete file from repository");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Download a file from repository
   * @param {number} repoId - Repository ID
   * @param {string} fileName - Name of the file to download
   * @param {string} filePath - Path of the file to download
   * @returns {Promise<Blob>} - File blob for download
   */
  const downloadFile = async (repoId, fileName, filePath) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(
        `/git/repositories/${repoId}/files/download`,
        {
          params: { fileName, filePath },
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (err) {
      handleError(err, "Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get download URL for a file
   * @param {number} repoId - Repository ID
   * @param {string} fileName - Name of the file
   * @param {string} filePath - Path of the file
   * @returns {Promise<string>} - Download URL
   */
  const getFileDownloadUrl = async (repoId, fileName, filePath) => {
    setIsLoading(true);
    clearError();

    try {
      const response = await axiosInstance.get(
        `/git/repositories/${repoId}/files/url`,
        {
          params: { fileName, filePath },
        }
      );

      return response.data.downloadUrl;
    } catch (err) {
      handleError(err, "Failed to get file download URL");
    } finally {
      setIsLoading(false);
    }
  };

  // UTILITY FUNCTIONS

  /**
   * Clear all state
   */
  const clearState = () => {
    setCommits([]);
    setCommitFiles([]);
    setRepositoryFiles([]);
    setCurrentCommit(null);
    setError("");
  };

  /**
   * Check if a file exists in the repository files
   * @param {string} fileName - Name of the file
   * @param {string} filePath - Path of the file
   * @returns {boolean} - True if file exists
   */
  const fileExists = (fileName, filePath) => {
    return repositoryFiles.some(
      (file) => file.fileName === fileName && file.filePath === filePath
    );
  };

  /**
   * Get file by name and path from repository files
   * @param {string} fileName - Name of the file
   * @param {string} filePath - Path of the file
   * @returns {Object|null} - File object or null if not found
   */
  const getFileByNameAndPath = (fileName, filePath) => {
    return (
      repositoryFiles.find(
        (file) => file.fileName === fileName && file.filePath === filePath
      ) || null
    );
  };

  /**
   * Filter files by path
   * @param {string} path - Path to filter by
   * @returns {Array} - Filtered files
   */
  const getFilesByPath = (path) => {
    return repositoryFiles.filter((file) => file.filePath.startsWith(path));
  };

  /**
   * Get file statistics
   * @returns {Object} - File statistics
   */
  const getFileStats = () => {
    const totalFiles = repositoryFiles.length;
    const totalSize = repositoryFiles.reduce(
      (sum, file) => sum + (file.size || 0),
      0
    );
    const fileTypes = repositoryFiles.reduce((types, file) => {
      const ext = file.fileName.split(".").pop() || "unknown";
      types[ext] = (types[ext] || 0) + 1;
      return types;
    }, {});

    return {
      totalFiles,
      totalSize,
      fileTypes,
    };
  };

  // Context value
  const value = {
    // State
    commits,
    commitFiles,
    repositoryFiles,
    currentCommit,
    isLoading,
    error,

    // Commit operations
    createCommit,
    fetchCommitHistory,
    fetchCommit,
    fetchCommitFiles,

    // File operations
    fetchRepositoryFiles,
    addFileToRepository,
    deleteFileFromRepository,
    downloadFile,
    getFileDownloadUrl,

    // Utility functions
    clearState,
    clearError,
    fileExists,
    getFileByNameAndPath,
    getFilesByPath,
    getFileStats,

    // State setters (for advanced usage)
    setCommits,
    setCommitFiles,
    setRepositoryFiles,
    setCurrentCommit,
  };

  return <GitContext.Provider value={value}>{children}</GitContext.Provider>;
};
