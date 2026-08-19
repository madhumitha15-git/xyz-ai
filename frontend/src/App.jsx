import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIAssistant from "./pages/AIAssistant";
import ParentDashboard from "./pages/ParentDashboard";


function App() {

  const token = localStorage.getItem("access_token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            token ? (
              user?.role === "parent" ? (
                <Navigate
                  to="/parent-dashboard"
                  replace
                />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            ) : (
              <Login />
            )
          }
        />


        {/* STUDENT DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            token ? (
              user?.role === "parent" ? (
                <Navigate
                  to="/parent-dashboard"
                  replace
                />
              ) : (
                <Dashboard />
              )
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* PARENT DASHBOARD */}

        <Route
          path="/parent-dashboard"
          element={
            token ? (
              user?.role === "parent" ? (
                <ParentDashboard />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* AI ASSISTANT */}

        <Route
          path="/ai"
          element={
            token ? (
              <AIAssistant />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* DEFAULT */}

        <Route
          path="*"
          element={
            token ? (
              user?.role === "parent" ? (
                <Navigate
                  to="/parent-dashboard"
                  replace
                />
              ) : (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;