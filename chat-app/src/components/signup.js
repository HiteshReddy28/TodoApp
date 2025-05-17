import React, { useEffect } from "react";
import { useState } from "react";
import './Style.css'
import { data } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SignUp = ({ setIsAuthenticated,userId, setUserid}) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');

    const validatePassword = (value) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
    
        if (value.length < minLength) {
          return `Password must be at least ${minLength} characters`;
        }
        if (!hasUpperCase || !hasLowerCase) {
          return 'Password needs both upper and lower case letters';
        }
        if (!hasNumbers) {
          return 'Password must contain at least one number';
        }
        if (!hasSpecial) {
          return 'Password must contain at least one special character';
        }
        return '';
      };
      const validateUserName = async(e) =>{ 
        const response = await fetch('http://localhost:8000/userNameExists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({userName: e})
                })
            const data = await response.json();
            if (data.message == "Username already exists"){
                return "Username already exists";
            }
            return '';
      }
    const validateConfirmPassword = () => {
        if (password !== confirmPassword) {
            return 'Passwords do not match';
        }
        return '';
    }
    const handleUsername = (e) =>{
        const value = e.target.value;
        setUserName(value);
        // setError(validateUserName(value));
    }
    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
        setError(validatePassword(value));
    }
    const storeData =  async (e) => {
        e.preventDefault(); // Prevent default form submission
      
        // Final validation
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword();
        const usernameError = await validateUserName(userName);
      
        if (passwordError || confirmPasswordError || usernameError) {
          setError(passwordError || confirmPasswordError || usernameError);
          return;
        }
      
        try {
          const response = await fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userName,
              email,
              password,
            }),
          });
      
          const data = await response.json();
      
          if (response.ok && data.userId) {
            setIsAuthenticated(true);
            setUserid(data.userId); // Set the actual userId returned
            navigate('/');
          } else {
            setError(data.message || "Signup failed. Please try again.");
          }
        } catch (err) {
          console.error("Signup error:", err);
          setError("An unexpected error occurred. Please try again later.");
        }
      };
    const toLogin = () =>{
        navigate('/login')
    }
    return (<>
    <div className="signUpContainer">
        <form className="signUpForm" onSubmit={storeData}>
            <label>Username:</label><br/>
            <input type="username" value = {userName} onChange={handleUsername} onBlur={() =>{setError(validateUserName(userName))}} required /><br/>
            <label>Email</label><br/>
            <input type = "email" value = {email} onChange = {(e) =>{setEmail(e.target.value)}}></input><br/>
            <label>Password:</label><br/>
            <input type = "password" value = {password} onChange={handlePassword} onBlur={()=>{setError(validatePassword(password))}}></input><br/>
            <label>Confirm Password:</label><br/>
            <input type = "password" value = {confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} onBlur={()=>{setError(validateConfirmPassword())}}></input><br/>
            
            {error && (
          <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}
        <button type = "submit">Submit</button>
        <button onClick={toLogin}>Login</button>
        </form>
    </div>
    </>)
}

export default SignUp;