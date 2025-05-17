import React, { useState } from "react";
import "./TodoList.css";

const TodoList = ({ tasks, handleTaskCompletion }) => {
  const [activeTask, setActiveTask] = useState(null);

  return (
    <>
      <ul>
        {tasks.map((task, index) => (
          <li
            className="Todolist"
            key={index}
            onClick={() => setActiveTask(task)}
          >
             <input
    type="checkbox"
    checked={task.completed}
    onClick={(e) => e.stopPropagation()} // 👈 Prevents the popup
    onChange={() => handleTaskCompletion(task.id, !task.completed)}
  />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>

      {activeTask && (
        <div className="hover-overlay" onClick={() => setActiveTask(null)}>
          <div className="hover-popup" onClick={(e) => e.stopPropagation()}>
            <h2>{activeTask.title}</h2>
            <p>{activeTask.description}</p>
            <p>{new Date(activeTask.updated_at).toLocaleString()}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;
