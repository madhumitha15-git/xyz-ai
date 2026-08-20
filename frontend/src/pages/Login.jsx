
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        null,
        {
          params: {
            email: email.trim(),
          },
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data?.access_token;
      const user = response.data?.user;

      // =========================================
      // CHECK TOKEN
      // =========================================

      if (!token) {
        setError(
          "Login failed: access token was not received."
        );
        return;
      }

      // =========================================
      // CHECK USER
      // =========================================

      if (!user) {
        setError(
          "Login failed: user information was not received."
        );

        localStorage.removeItem("access_token");
        return;
      }

      console.log("LOGGED IN USER:", user);
      console.log("USER ROLE:", user.role);

      // =========================================
      // SAVE LOGIN DATA
      // =========================================

      localStorage.setItem(
        "access_token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // =========================================
      // REDIRECT
      // =========================================

      const role = String(user.role || "")
        .toLowerCase()
        .trim();

      if (role === "parent") {
        console.log(
          "REDIRECTING TO PARENT DASHBOARD"
        );

        window.location.replace(
          "/parent-dashboard"
        );

        return;
      }

      if (role === "student") {
        console.log(
          "REDIRECTING TO STUDENT DASHBOARD"
        );

        window.location.replace(
          "/dashboard"
        );

        return;
      }

      // Fallback
      console.log(
        "UNKNOWN ROLE - REDIRECTING TO DASHBOARD"
      );

      window.location.replace(
        "/dashboard"
      );

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      const detail =
        error.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      }

      else if (typeof detail === "string") {
        setError(detail);
      }

      else if (
        error.response?.status === 422
      ) {
        setError(
          "Invalid login request. Please check your email."
        );
      }

      else if (
        error.response?.status === 401
      ) {
        setError(
          "Email not recognized."
        );
      }

      else {
        setError(
          "Unable to login. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          LEFT BRAND
      ========================== */}

      <section className="login-brand">

        <div className="brand-decoration decoration-one"></div>

        <div className="brand-decoration decoration-two"></div>

        <div className="brand-content">

          <div className="brand-logo">
            ✨
          </div>

          <h1>
            XYZ <span>AI</span>
          </h1>

          <h2>
            Smarter School.
            <br />
            Better Learning.
          </h2>

          <p>
            An intelligent school assistant
            that helps students, parents,
            and teachers stay connected,
            track progress, and learn better.
          </p>

          <div className="brand-features">

            <div>
              <span>✓</span>
              Smart attendance tracking
            </div>

            <div>
              <span>✓</span>
              AI-powered school assistant
            </div>

            <div>
              <span>✓</span>
              Parent & student insights
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          LOGIN
      ========================== */}

      <section className="login-section">

        <div className="login-card">

          <div className="mobile-logo">
            ✨
          </div>

          <h2>
            Welcome back
          </h2>

          <p className="login-subtitle">
            Sign in to continue to XYZ AI
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
              />

            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div className="login-footer">
            Powered by{" "}
            <strong>XYZ AI</strong>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;
