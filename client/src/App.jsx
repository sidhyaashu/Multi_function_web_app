import "./App.css";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./pages/Sidebar";
import URL from "./components/URL";
import DATA from "./components/DATA";
import QR from "./components/QR";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />, 
  },
  {
    path: "/home", 
    element: <Sidebar />, 
    children: [
      {
        path: "", // This should be an empty string to catch the "/home" route
        element: <Navigate to="url-to-ss" replace />, // Redirect to url-to-ss
      },
      {
        path: "url-to-ss", 
        element: <URL />,
        index: true,
      },
      {
        path: "random-data-generator", 
        element: <DATA />,
      },
      {
        path: "qr-generator",
        element: <QR />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;