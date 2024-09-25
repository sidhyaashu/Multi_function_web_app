import { useState } from "react";
import { motion } from "framer-motion";
import AddLinkIcon from '@mui/icons-material/AddLink';
import FolderIcon from '@mui/icons-material/Folder';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Link, Outlet ,NavLink } from "react-router-dom"; // Import Link and Outlet

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Toggle Sidebar
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
        className={`bg-s2 text-white flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 bg-s3">
          <motion.h2
            initial={{ opacity: isExpanded ? 1 : 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-semibold"
          >
            <NavLink to="/">
            {isExpanded ? "ZERO" : ""}
            </NavLink>
          </motion.h2>
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            
            {isExpanded ? "<" : ">"}
            
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hover:bg-s5 p-2 rounded-lg flex items-center"
          >
            <Link to="/home/url-to-ss">
              <span className="material-icons"><AddLinkIcon /></span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className={`${isExpanded ? "ml-4" : "hidden"} text-sm`}
              >
                URL TO SS
              </motion.span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hover:bg-s5 p-2 rounded-lg flex items-center"
          >
            <Link to="/home/random-data-generator">
              <span className="material-icons"><FolderIcon /></span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className={`${isExpanded ? "ml-4" : "hidden"} text-sm`}
              >
                RANDOM DATA
              </motion.span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="hover:bg-s5 p-2 rounded-lg flex items-center"
          >
            <Link to="/home/qr-generator">
              <span className="material-icons"><QrCodeIcon /></span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className={`${isExpanded ? "ml-4" : "hidden"} text-sm`}
              >
                QR GENERATOR
              </motion.span>
            </Link>
          </motion.div>
        </nav>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-grow flex-col">
        {/* Header */}
        <header className="bg-s3 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-lg font-semibold">ZERO TO ONE</h1>
          </div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-grow container mx-auto p-4">
          <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            {/* Include Outlet for rendering child components */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
