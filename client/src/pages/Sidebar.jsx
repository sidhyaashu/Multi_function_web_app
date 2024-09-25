import { useState } from "react";
import { motion } from "framer-motion";
import AddLinkIcon from '@mui/icons-material/AddLink';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="flex h-screen ">
      <motion.div
        initial={{ width: isExpanded ? 64 : 16 }}
        animate={{ width: isExpanded ? 256 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-blue-800 text-white flex flex-col fixed h-full"
      >
        <div className="flex justify-between items-center p-4 bg-blue-700">
          {isExpanded && (
            <NavLink to="/" className="flex items-center">
              <h2 className={`text-lg font-semibold transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                ZERO
              </h2>
            </NavLink>
          )}
          <button className="text-gray-400 hover:text-white" onClick={toggleSidebar}>
            {isExpanded ? "<" : ">"}
          </button>
        </div>

        <nav className="flex flex-col p-4 space-y-4">
          {[
            { to: "/home/url-to-ss", icon: <AddLinkIcon />, label: "URL TO SS" },
            { to: "/home/random-data-generator", icon: <FolderIcon />, label: "RANDOM DATA" },
            { to: "/home/qr-generator", icon: <QrCodeIcon />, label: "QR GENERATOR" },
          ].map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className="flex items-center hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200">
              {icon}
              <span className={`ml-2 text-sm transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </motion.div>

      <div className="flex-grow ml-64"> {/* Adjust margin to accommodate sidebar */}
        <header className="bg-blue-700 text-white p-4 shadow-md">
          <h1 className="text-lg font-semibold">ZERO TO ONE</h1>
        </header>

        <main className="flex-grow container mx-auto p-4 overflow-y-auto"> {/* Enable vertical overflow */}
          <div className="flex flex-col h-full  rounded-lg shadow-md p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
