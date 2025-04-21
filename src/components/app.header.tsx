import React from 'react';
// Remove FaBell import since we'll use static image

const AppHeader: React.FC = () => {
  return (
    <header className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between">
      {/* Logo section */}
      <div className="flex items-center">
        <div className="w-10 h-10">
          <img 
            src="/app.header/headphone-logo.png" 
            alt="Headphone Logo" 
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Search section */}
      <div className="flex-1 mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-[#1e1e1e] text-gray-200 px-8 py-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-gray-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <img 
              src="/app.header/search-icon.png"
              alt="Search"
              className="w-5 h-5 opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Notification section */}
      <div className="flex items-center">
        <button className="p-2 text-gray-400 hover:text-white">
          <img 
            src="/app.header/bell-icon.png" 
            alt="Notification Bell" 
            className="w-6 h-6"
          />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;