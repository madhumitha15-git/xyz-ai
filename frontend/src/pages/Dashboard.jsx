import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!user || user.role !== "student") {
          setError("Only students can access this dashboard.");
          return;
        }

        const response = await api.get(
          `/attendance/student/${user.id}`
        );

        setAttendance(response.data);

      } catch (error) {
        console.error("STUDENT DASHBOARD ERROR:", error);

        setError(
          error.response?.data?.detail ||
          "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="app">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            AI
          </div>

          <div>
            <h2>XYZ AI</h2>
            <span>School Assistant</span>
          </div>

        </div>

        <nav>

          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/ai")}
          >
            <span>◉</span>
            AI Assistant
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={logout}
          >
            ↪ Logout
          </button>

        </div>

      </aside>


      {/* Main */}

      <main className="main">

        <header className="header">

          <div>

            <h1>
              Student Dashboard
            </h1>

            <p>
              Welcome back, {user?.name}
            </p>

          </div>

          <div className="profile">

            <div className="avatar">
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <strong>
                {user?.name}
              </strong>

              <span>
                Student
              </span>

            </div>

          </div>

        </header>


        <section className="content">

          {error && (
            <div className="error-card">
              {error}
            </div>
          )}


          {!error && attendance && (
            <>

              {/* Welcome */}

              <div className="welcome-card">

                <div>

                  <span className="badge">
                    STUDENT
                  </span>

                  <h2>
                    Welcome, {user?.name}!
                  </h2>

                  <p>
                    Track your attendance and
                    use XYZ AI for academic
                    assistance.
                  </p>

                </div>

                <div className="welcome-icon">
                  🎓
                </div>

              </div>


              {/* Statistics */}

              <h2 className="section-title">
                Attendance Overview
              </h2>

              <div className="stats-grid">

                <div className="stat-card">

                  <div className="stat-icon">
                    %
                  </div>

                  <div>

                    <span>
                      Attendance
                    </span>

                    <h3>
                      {attendance.attendance_percentage}%
                    </h3>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon">
                    📅
                  </div>

                  <div>

                    <span>
                      Total Days
                    </span>

                    <h3>
                      {attendance.total_days}
                    </h3>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon">
                    ✓
                  </div>

                  <div>

                    <span>
                      Present
                    </span>

                    <h3>
                      {attendance.present_days}
                    </h3>

                  </div>

                </div>


                <div className="stat-card">

                  <div className="stat-icon">
                    ✕
                  </div>

                  <div>

                    <span>
                      Absent
                    </span>

                    <h3>
                      {attendance.total_days -
                        attendance.present_days}
                    </h3>

                  </div>

                </div>

              </div>


              {/* Progress */}

              <div className="attendance-card">

                <div className="card-header">

                  <div>

                    <h2>
                      Attendance Progress
                    </h2>

                    <p>
                      Your current attendance
                    </p>

                  </div>

                  <strong>
                    {attendance.attendance_percentage}%
                  </strong>

                </div>


                <div className="progress-container">

                  <div
                    className="progress-bar"
                    style={{
                      width: `${Math.min(
                        attendance.attendance_percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>


                <div className="progress-footer">

                  <span>
                    Present:{" "}
                    {attendance.present_days}
                  </span>

                  <span>
                    Absent:{" "}
                    {attendance.total_days -
                      attendance.present_days}
                  </span>

                </div>

              </div>


              {/* AI Assistant */}

              <div className="ai-card">

                <div className="ai-icon">
                  ✨
                </div>

                <div>

                  <h2>
                    Ask XYZ AI
                  </h2>

                  <p>
                    Ask questions about your
                    attendance, studies, and
                    academic progress.
                  </p>

                </div>

                <button
                  onClick={() => navigate("/ai")}
                >
                  Ask AI
                </button>

              </div>

            </>
          )}

        </section>

      </main>


      {/* =================================================
          FLOATING AI AVATAR
      ================================================= */}

      <button
        className="floating-ai-button"
        onClick={() => navigate("/ai")}
        title="Open XYZ AI"
        aria-label="Open XYZ AI"
      >

        <div className="floating-ai-face">

          <div className="floating-ai-eyes">
            <span></span>
            <span></span>
          </div>

          <div className="floating-ai-mouth">
            •
          </div>

        </div>

      </button>

    </div>
  );
}

export default Dashboard;