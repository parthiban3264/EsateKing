import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react"; // ✅ FIX: Added useContext
import apiRequest from "../../lib/apiRequest.js";
import { AuthContext } from "../../context/AuthContext.jsx";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(AuthContext); // ✅ gets updateUser from context

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const userName = formData.get("userName");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        userName,
        password,
      });

      updateUser(res.data); // ✅ sets the user in context
      navigate("/");        // ✅ navigates to home on successful login

    } catch (err) {
      setError(err.response?.data?.message || "Login failed."); // ✅ safe error access
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="userName"
            type="text"
            placeholder="Username"
            minLength={4}
            maxLength={20}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && <span className="error">{error}</span>}
          <Link to="/register">Don't have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="Background" />
      </div>
    </div>
  );
}

export default Login;
