import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const RepositoryContext = createContext();

export const useRepository = () => useContext(RepositoryContext);

export const RepositoryProvider = ({ children }) => {
  const { axiosInstance } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [publicRepositories, setPublicRepositories] = useState([]);
  const [repoFiles, setRepoFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [repoError, setRepoError] = useState("");

  // Fetch user's repositories
  const fetchRepositories = async () => {
    try {
      const res = await axiosInstance.get("/repositories");
      setRepositories(res.data);
    } catch (err) {
      setRepoError(err.response?.data?.error || "Failed to fetch repositories");
    }
  };

  // Fetch public repositories
  const fetchPublicRepositories = async () => {
    try {
      const res = await axiosInstance.get("/repositories/public");
      setPublicRepositories(res.data);
    } catch (err) {
      setRepoError(
        err.response?.data?.error || "Failed to fetch public repositories"
      );
    }
  };

  // Create a new repository
  const createRepository = async (repoData) => {
    try {
      const res = await axiosInstance.post("/repositories", repoData);
      fetchRepositories();
      return res.data;
    } catch (err) {
      setRepoError(err.response?.data?.error || "Failed to create repository");
      throw err;
    }
  };

  // Get files in a repository
  const fetchRepositoryFiles = async (repoId) => {
    try {
      const res = await axiosInstance.get(`/repositories/${repoId}/files`);
      setRepoFiles(res.data);
    } catch (err) {
      setRepoError(err.response?.data?.error || "Failed to fetch files");
    }
  };

  // Get commit history for a repository
  const fetchCommits = async (repoId) => {
    try {
      const res = await axiosInstance.get(
        `/git/repositories/${repoId}/commits`
      );
      setCommits(res.data);
    } catch (err) {
      setRepoError(err.response?.data?.error || "Failed to fetch commits");
    }
  };

  // Add more functions as needed for update, delete, file upload, etc.

  return (
    <RepositoryContext.Provider
      value={{
        repositories,
        publicRepositories,
        repoFiles,
        commits,
        repoError,
        fetchRepositories,
        fetchPublicRepositories,
        createRepository,
        fetchRepositoryFiles,
        fetchCommits,
        // ...add more as needed
      }}
    >
      {children}
    </RepositoryContext.Provider>
  );
};
