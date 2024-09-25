import { useState } from "react";
import { motion } from "framer-motion";
import AddLinkIcon from '@mui/icons-material/AddLink';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <motion.div
        initial={{ width: isExpanded ? 64 : 16 }}
        animate={{ width: isExpanded ? 256 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-blue-800 text-white flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 bg-blue-700">
          {isExpanded&&<NavLink to="/" className="flex items-center">
            <h2 className={`text-lg font-semibold transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              ZERO
            </h2>
          </NavLink>}
          <button className="text-gray-400 hover:text-white focus:outline-none" onClick={toggleSidebar}>
            {isExpanded ? "<" : ">"}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <NavLink to="/home/url-to-ss" className="flex items-center hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
            <AddLinkIcon />
            <span className={`ml-2 text-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              URL TO SS
            </span>
          </NavLink>
          <NavLink to="/home/random-data-generator" className="flex items-center hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
            <FolderIcon />
            <span className={`ml-2 text-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              RANDOM DATA
            </span>
          </NavLink>
          <NavLink to="/home/qr-generator" className="flex items-center hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
            <QrCodeIcon />
            <span className={`ml-2 text-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              QR GENERATOR
            </span>
          </NavLink>
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-blue-700 text-white p-4 shadow-md">
          <h1 className="text-lg font-semibold">ZERO TO ONE</h1>
        </header>

        {/* Main Chat Area */}
        <main className="flex-grow container mx-auto p-4">
          <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
