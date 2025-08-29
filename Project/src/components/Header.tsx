import React from 'react';
import { Search, Sparkles, Github } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50 poppins-text">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ProductMatcher</h1>
              <p className="text-sm text-gray-300">Visual AI Search</p>
            </div>
          </div>
          <div
            className="
              hidden md:flex items-center space-x-2 text-sm text-white 
              hover:text-white transition-colors
              bg-white/20 backdrop-blur-md rounded-lg border border-white/30
              px-4 py-2
            "
          >
            <a
              href="https://github.com/Sunscarsonys/Visual-Product-Matcher"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <Github className="w-6 h-6" />
              <span>GitHub Repo</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
