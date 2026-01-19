import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// @ts-ignore - Case sensitivity issue on Windows file system
import User from "./Pages/User";
import AdminPage from "./Pages/AdminPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />           {/* Home / User page */}
        <Route path="/admin" element={<AdminPage />} /> {/* Admin page */}
        {/* Add more pages if needed */}
      </Routes>
    </Router>
  );
};

export default App;



