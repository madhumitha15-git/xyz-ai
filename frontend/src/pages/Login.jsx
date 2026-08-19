import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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

      const user = response.data.user;

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("LOGIN USER:", user);

      // Role-based dashboard
      if (user.role === "parent") {
        navigate("/parent-dashboard", {
          replace: true,
        });
      } else if (user.role === "student") {
        navigate("/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Login failed"
      );
    }
  };

  return (
    <div>
      <h1>XYZ AI</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      {error && (
        <p>
          {error}
        </p>
      )}

    </div>
  );
}

export default Login;