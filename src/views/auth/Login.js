import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext"; // Ensure this is the correct path to your AuthContext
import Loader from "components/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Removed setUserId from destructuring
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/login`,
        {
          email,
          password,
        }
      );
      
      if (response.data.status === "success") {
        const token = response.data.token;
        const id = response.data.data._id;
        
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", id);

        login(id); // Pass the id to the login function
        navigate("/admin/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="container">
      <div className="flex-container">
        <div className="login">
          {loading ? (
            <Loader />
          ) : (
            <div className="content">
              <h1 className="text-white">Log In</h1>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="clearfix">
                  <span className="remember">Remember me</span>
                  <span className="forget ms-md-3">Forgot password?</span>
                </div>
                <button type="submit">Log In</button>
              </form>
            </div>

          )}
        </div>

        <div className="page front">
          <div className="content" id="loginPage">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user-plus"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <h1>Hello, friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button type="button" id="register">
              Register
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-right-circle"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 16 16 12 12 8" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url("https://fonts.googleapis.com/css?family=Montserrat:400,700");

        *, *::after, *::before {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          height: 100%;
          font-size: 65.2%;
          box-sizing: border-box;
          font-family: Montserrat, sans-serif;
          -webkit-font-smoothing: antialiased;
          font-weight: 400;
        }
        body {
          height: 100%;
          background: #333; /* Changed from 'dark' to a valid color */
          color: #1d2129;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #container {
          width: 95%;
          margin-left: 10px;
          max-width: 800px;
          height: 500px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          background-color: hsla(0, 100%, 100%, 0.12);
          box-shadow:
            0px 8px 10px 1px hsla(0,0%,0%,0.1), 
            0px 3px 14px 2px hsla(0,0%,0%,0.1), 
            0px 5px 5px -3px hsla(0,0%,0%,0.2);
          flex-wrap: wrap; /* Allow wrapping on smaller screens */
        }
        .flex-container {
          display: flex;
          width: 100%;
          height: 100%;
          flex-wrap: wrap;
        }
        .login {
          flex: 1;
          min-width: 300px; /* Ensure minimum width */
          background: #333; /* Changed from 'dark' to a valid color */
          border-radius: 20px 0 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .page {
          flex: 1;
          min-width: 300px; /* Ensure minimum width */
          color: #fff;
          border-radius: 0 20px 20px 0;
          background: linear-gradient(-45deg, #FFCF00 0%, #FC4F4F 100%) no-repeat 0 0 / 200%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .content {
          width: 100%;
          padding: 2em 4em;
          text-align: center;
        }
        h1 {
          font-weight: 700;
          font-size: 3.5rem;
          color: white;
          margin-bottom: 20px;
        }
        form input {
          background: #eee;
          border: none;
          padding: 12px 15px;
          margin: 8px 0;
          width: 100%;
          font-size: 1.4em;
          border-radius: 5px; /* Rounded input fields */
        }
        .clearfix {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }
        .social-icons {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        .social-icons a {
          margin: 0 10px;
          color: #fff;
        }
        .remember, .loginwith {
          font-size: 0.9rem;
          color: white;
          display: flex; /* Added display to align items properly */
          justify-content: flex-start;
        }
        .forget {
          font-size: 0.9rem;
          color: white;
          margin-left: 100px !important;
        }
        button {
          display: block;
          margin: 1em auto;
          border-radius: 40px;
          border: 1px solid #ff4b2b;
          background: #ff4b2b;
          color: #fff;
          font-size: 1.2em;
          font-weight: bold;
          padding: 0.8em 2em;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in;
        }
        button svg {
          vertical-align: middle;
        }
        button:hover {
          cursor: pointer;
        }
        button:active {
          transform: scale(0.95);
        }
        button:focus {
          outline: none;
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 2em; /* Smaller heading on mobile */
          }
          .content {
            padding: 1em; /* Reduce padding on mobile */
          }
          .forget {
            margin-left: 20px !important; /* Adjust margin for smaller screens */
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
