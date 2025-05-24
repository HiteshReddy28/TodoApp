import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import TodoList from './todo'; // adjust path if needed
import Aitodo from "./Todobot";

const Main = ({ isAuthenticated, setIsAuthenticated, userid, setUserid }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const navigate = useNavigate(); // hook to navigate between pages

  useEffect(() => {
    
    if (!isAuthenticated) {
      navigate("/login"); // Go to login page if not authenticated
    }
    // If the user is authenticated, fetch their todos
    if (isAuthenticated && userid) {
        console.log(userid)
      fetch(`http://localhost:8000/todo/get_user_todo/${userid}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure we are setting tasks only if data is an array
          if (Array.isArray(data)) {
            setTasks(data); // Directly setting the array of tasks
          } else {
            setTasks([]); // Fallback to an empty array if the response is not an array
          }
        })
        .catch((error) => {
          console.error("Error fetching todos:", error);
          setTasks([]); // Ensure tasks is an empty array in case of an error
        });
    }
    console.log(tasks);
  }, [isAuthenticated, userid, navigate]);
  

  const handleTaskCompletion = async (taskId, isCompleted) => {
    const csrfToken = await getCSRFToken();
    const response = await fetch(`http://localhost:8000/todo/markUserTaskCompleted/${userid}/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ completed: isCompleted }),
    });
  
    if (response.ok) {
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: isCompleted } : task
      );
      setTasks(updatedTasks);
    }
  };

  // Function to get CSRF token
  async function getCSRFToken() {
    const response = await fetch(`http://localhost:8000/todo/get-csrf-token/`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  }

  // Function to add a new task
  const addtask = async () => {
    const csrfToken = await getCSRFToken();
    const response = await fetch(`http://localhost:8000/todo/set_user_todo/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ title: Title, description: Description, userid: userid }),
    })
      
    const data = await response.json();
    // Add new task to the list if Title is valid
    if (Title.trim() !== "") {
      setTasks([...tasks, data]);
      setDescription("");
      setTitle("");
    }
  };

  const addMultipleAITasks  = (aiTasks) => {
        const newTasks = aiTasks.map(task => ({
            id: Date.now() + Math.random(), // Add Math.random() for uniqueness if multiple are added quickly
            title: task.title,
            description: task.description,
            completed: false,
            updated_at: new Date().toISOString(),
        }));
        setTasks((prevTasks) => [...prevTasks, ...newTasks]);
        alert("AI tasks added to your list!"); // Optional: user feedback
    };
  return (
   <div className="main-container">
    <div className="leftbar-container"> {/* This will be your left column */}
        <div className="manual-todo-input-section"> {/* A new div to group manual inputs */}
            <h1>Enter your to do title</h1>
            <input
                type="text"
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
            />
            <h1>Enter Description</h1>
            <input
                type="text"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        addtask();
                    }
                }}
                placeholder="Describe"
            />
            <button onClick={addtask}>Add Task</button>
        </div>
        <Aitodo onApproveAITasks={addMultipleAITasks}/> {/* The Aitodo component will be below the manual input */}
    </div>

    <div className="rightbar-container"> {/* This will be your right column */}
        <h1>To do List</h1>
        {/* <br /> - remove this, use CSS for spacing */}
        <TodoList tasks={tasks} handleTaskCompletion={handleTaskCompletion} />
    </div>
</div>
  );
};

export default Main;
