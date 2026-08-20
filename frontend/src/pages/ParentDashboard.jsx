
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ParentDashboard() {
  const navigate = useNavigate();

  const [child, setChild] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!user || user.role !== "parent") {
          setError("Only parents can access this dashboard.");
          return;
        }

        // Get parent's children
        const childrenResponse = await api.get(
          "/relationships/my-children"
        );

        const children = childrenResponse.data.children;

        if (!children || children.length === 0) {
          setError("No child is linked to your account.");
          return;
        }

        // Use the first linked child
        const selectedChild = children[0];

        setChild(selectedChild);

        // Get child's attendance
        const attendanceResponse = await api.get(
          `/attendance/parent/${user.id}/child/${selectedChild.id}`
        );

        setAttendance(attendanceResponse.data);

      } catch (error) {
        console.error("PARENT DASHBOARD ERROR:", error);

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

      {/* =================================================
          SIDEBAR
      ================================================= */}

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
            onClick={() =>
              navigate("/parent-dashboard")
            }
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              navigate("/ai")
            }
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


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <div>

            <h1>
              Parent Dashboard
            </h1>

            <p>
              Welcome back, {user?.name}
            </p>

          </div>

          {/* PROFILE */}

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
                Parent
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="content">

          {/* ERROR */}

          {error && (
            <div className="error-card">
              {error}
            </div>
          )}


          {!error && child && attendance && (
            <>

              {/* =================================================
                  WELCOME CARD
              ================================================= */}

              <div className="welcome-card">

                <div>

                  <span className="badge">
                    PARENT
                  </span>

                  <h2>
                    Welcome, {user?.name}!
                  </h2>

                  <p>
                    Monitor {child.name}'s
                    academic attendance from
                    one place.
                  </p>

                </div>

                <div className="welcome-icon">
                  👨‍👩‍👦
                </div>

              </div>


              {/* =================================================
                  CHILD CARD
              ================================================= */}

              <div className="child-card">

                <div className="child-avatar">

                  {child.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <span>
                    Your Child
                  </span>

                  <h2>
                    {child.name}
                  </h2>

                  <p>
                    {child.email}
                  </p>

                </div>

              </div>


              {/* =================================================
                  ATTENDANCE STATISTICS
              ================================================= */}

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


              {/* =================================================
                  ATTENDANCE PROGRESS
              ================================================= */}

              <div className="attendance-card">

                <div className="card-header">

                  <div>

                    <h2>
                      Attendance Progress
                    </h2>

                    <p>
                      {child.name}'s current
                      attendance
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


              {/* =================================================
                  AI ASSISTANT
              ================================================= */}

              <div className="ai-card">

                {/* CLICKABLE AI AVATAR */}

                <button
                  type="button"
                  className="ai-avatar-button"
                  onClick={() => navigate("/ai")}
                  title="Open XYZ AI Assistant"
                >

                  <div className="ai-avatar">

                    <div className="ai-avatar-face">
                      🤖
                    </div>

                  </div>

                </button>


                {/* AI INFORMATION */}

                <div className="ai-card-content">

                  <span className="ai-badge">
                    AI ASSISTANT
                  </span>

                  <h2>
                    Ask XYZ AI
                  </h2>

                  <p>
                    Ask questions about{" "}
                    {child.name}'s attendance
                    and studies.
                  </p>

                </div>


                {/* ASK AI BUTTON */}

                <button
                  type="button"
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
          CLICKING IT OPENS AI ASSISTANT
      ================================================= */}

      <button
        type="button"
        className="floating-ai-avatar"
        onClick={() => navigate("/ai")}
        title="Open XYZ AI Assistant"
      >
        <span>
          🤖
        </span>
      </button>

    </div>
  );
}

export default ParentDashboard;
