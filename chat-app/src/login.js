import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login(){
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [correctUsername, setcorrectusername] = useState('');
  const [correctPassword, setcorrectpassword] = useState('');
  const logindetails = async () =>{
    const user = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
          })
          })
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error('Error:', error));
          if (user === correctUsername && password === correctPassword) {
            navigate('/home');
            console.log('Login Successful');
            } else {
              console.log('Invalid Credentials');
              setPasswordError('Invalid Credentials');
              }
    }
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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const authenticate = (e) => {
    e.preventDefault();
    
    // Final validation check
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }

    // Check against hardcoded credentials
    if (username === correctUsername && password === correctPassword) {
      navigate("/chat");
    } else {
      setPasswordError('Invalid username or password');
    }
  };

  return (
    <div className='login-container'>
      <form className='login-box' onSubmit={authenticate}>
        <label>Username: </label>
        <input 
          type="text" 
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label>Password: </label>
        <input 
          type="password" 
          name="password"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => setPasswordError(validatePassword(password))}
          required
        />
        
        {passwordError && (
          <div className="error-message" style={{ color: 'red', fontSize: '0.8rem' }}>
            {passwordError}
          </div>
        )}

        <div className='signup'>
          <button type="submit">Login</button>
          <button type="button">SignUp</button>
        </div>
      </form>
    </div>
  );

}


export default Login;