import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./app/views/home";
import VersionManagerProvider from "./app/context/versionManagerProvider";

const App: React.FC = () => {
  return (
    <VersionManagerProvider>
      <Routes>
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </VersionManagerProvider>
  );
};

export default App;
