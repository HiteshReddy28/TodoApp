// Root.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/login";
import Signup from "./components/signup";
import Completed from "./components/Completed";
import Todo from "./components/todo";

const Root = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  
  const [userid, setUserid] = useState(() => {
    return localStorage.getItem("userid") || 0;
  });
  
  return (
    <Routes>
      <Route path="/" element={<App isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userid ={userid} setUserid={setUserid}/>} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserid={setUserid}/>} />
      <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated}userId={userid} setUserid={setUserid}/>} />
      <Route path="/completed" element={<Completed />} />
      <Route path="/todo" element={<Todo />} />
    </Routes>
  );
};

export default Root;
