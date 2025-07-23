import React from "react";

import {
  LogOut,
  MessageSquare,
  Plus,
  FileText,
  User,
  Heart,
  Send,
  File,
} from "lucide-react";


const Navbar = ({handleGit, handleLogout}) => {

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-white font-semibold text-xl">Vault</span>
            </div>
          </div>

          <button
            onClick={handleGit}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            <File className="h-4 w-4" />
            My Commits
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
