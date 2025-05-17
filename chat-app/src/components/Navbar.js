import React from "react";
import { useNavigate } from "react-router-dom";
import './Style.css';

const Navbar = ({ isAuthenticated, setIsAuthenticated, userid, setUserid}) => {
    const navigate = useNavigate();

    const changeToCompleted = () => {
        navigate("/completed");
    };

    const changeToSignUp = () => {
        navigate("/signup");
    };

    const handleLogout = () => {
        // setIsAuthenticated(false);
        // setUserid(0);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userid");
        navigate("/login");
      };
      

    return (
        <div className="navbar-container">
            <div className="navbar-logo">
                <h1>To Do List</h1>
            </div>
            <div className="navbar-links">
                <a href="#" className="nav-link">Home</a>
                <button className="nav-link" onClick={changeToCompleted}>Completed Tasks</button>

                {isAuthenticated ? (
                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                ) : (
                    <button className="nav-link" onClick={() => navigate("/login")}>Login</button>
                )}

                <button className="nav-link" onClick={changeToSignUp}>Signup</button>
            </div>
        </div>
    );
};

export default Navbar;
