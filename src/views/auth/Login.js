import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth(); // Get the login function from the context
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/admin/login`, {
                email,
                password,
            });

            if (response.data.status === "success") {
                localStorage.setItem("authToken", response.data.token);
                login(); // Update authentication state
                navigate("/admin/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div id="container">
            <div className="flex-container">
                <div className="login">
                    <div className="content">
                        <h1 className="text-white">Log In</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="clearfix">
                                <span className="remember">Remember me</span>
                                <span className="forget ms-md-3">Forgot password?</span>
                            </div>
                            <button type="submit">Log In</button>
                        </form>
                        <span className="loginwith">Or Connect with</span>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/emin.qasimovdia">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="https://www.twitter.com/webkoder">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                </svg>
                            </a>
                            <a href="https://www.github.com/eminqasimov">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-github">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            </a>
                            <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="page front">
                    <div className="content" id="loginPage">
                        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        <h1>Hello, friend!</h1>
                        <p>Enter your personal details and start your journey with us</p>
                        <button type="button" id="register">
                            Register
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right-circle">
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
          background: dark;
          color: #1d2129;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #container {
          width: 95%;
          margin-left:10px;
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
          display: flex;
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
          background: dark;
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
          color:white;
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
          color:white;
        
           justify-content: flex-start;
        }
          .forget{
          font-size: 0.9rem;
          color:white;
          margin-left:100px !important;
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
				padding: .8em 2em;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
	
				svg{
						vertical-align: middle;
				}
} 
button:hover {
    cursor:pointer;
}
button:active {
    transform: scale(.95);
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
        }
      `}</style>
        </div>
    );
};

export default Login;
