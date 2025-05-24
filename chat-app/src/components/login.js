import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login({ setIsAuthenticated, setUserid}){
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({})
  async function getCSRFToken() {
    const response = await fetch("http://localhost:8000/get_token", {
        credentials: "include",  
    });
    const data = await response.json();
    // console.log(data)
    return data.csrfToken;
}
  const loginCheck = async () =>{
    const csrfToken = await getCSRFToken();
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          username: username,
          password: password
          })
          })
          const data = await response.json();
          setCredentials(data);
          return data;
    }
  
    
  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const authenticate = async(e) => {
    e.preventDefault();
    const result = await loginCheck();
    console.log(result)
    if (result.message === "Login successful"){
        console.log("login successful");
        setIsAuthenticated(true);
        setUserid(result.id)
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userid", result.id);
        console.log(result.id)
        navigate("/");
    }
    else {
        setError(result.message || "Login failed");
      }

    // // Check against hardcoded credentials
    // if (username === correctUsername && password === correctPassword) {
    //   navigate("/chat");
    // } else {
    //   setError('Invalid username or password');
    // }
  };

  return (
    <div className='login-container'>

      <form className='login-box' onSubmit={authenticate}>
        <label>Username: </label>
        <input 
          type="text" 
          name="username"
          value={username}
          onChange={handleUserNameChange}
          required
        />
        
        <label>Password: </label>
        <input 
          type="password" 
          name="password"
          value={password}
          onChange={handlePasswordChange}
        //   onBlur={() => setError(validatePassword(password))}
          required
        />
        
        {error && (
          <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        <div className='signup'>
          <button type="submit">Login</button>
          <button onClick={()=>{
            navigate("/signup");
          }}>SignUp</button>
        </div>
      </form>
    </div>
  );

}


export default Login;