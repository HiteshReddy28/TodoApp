import { useState } from "react";
import "./Todobot.css"; // Assuming you have a CSS file for styling

const Aitodo = ({ onApproveAITasks }) => {
  const [aiInput, setAiInput] = useState("");
  const [aiSuggestedTasks, setAiSuggestedTasks] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const sendData = async () => {
    if (!aiInput.trim()) {
      setError("Please type something for AI suggestions.");
      setAiSuggestedTasks(null); 
      return;
    }

    setIsLoading(true);
    setAiSuggestedTasks(null); // Clear previous suggestions when requesting new ones
    setError(null); // Clear any previous errors

    try {
      const response = await fetch('http://localhost:8000/todo/aisuggestions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // It's good practice to send a descriptive key like 'ai_prompt'
        body: JSON.stringify({ ai_prompt: aiInput })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch AI suggestions');
      }

      const data = await response.json();
      if (data.suggested_tasks && Array.isArray(data.suggested_tasks) && data.suggested_tasks.length > 0) {
        setAiSuggestedTasks(data.suggested_tasks);
      } else {
        setAiSuggestedTasks([]);
        setError("AI did not suggest any tasks for that input.");
      }
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError(`Failed to get AI suggestions: ${err.message}`);
      setAiSuggestedTasks(null); // Clear suggestions on severe error
    } finally {
      setIsLoading(false); // Always stop loading
    }
  };

  const handleApprove = () => {
    if (aiSuggestedTasks && onApproveAITasks) {
      onApproveAITasks(aiSuggestedTasks); // Pass tasks to parent
      setAiSuggestedTasks(null); // Clear suggestions after approval
      setAiInput("");

    }
  };

  const handleDiscard = () => {
    setAiSuggestedTasks(null); // Just clear the suggestions
    setAiInput(""); // Clear the input field
  };

  return (
    <div className="ai-todo">
      <h2>Topic You want to learn & AI Todo Suggestions</h2>
      <input
        type="text"
        placeholder={isLoading ? "Generating..." : "Type what you want to do (e.g., 'learn React', 'plan a trip')"}
        className="Botinput"
        value={aiInput}
        onChange={(e) => setAiInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendData();
          }
        }}
        disabled={isLoading} // Disable input while loading
      />
      <button
        className="ai-suggest-button"
        onClick={sendData}
        disabled={isLoading || !aiInput.trim()} // Disable if loading or input is empty
      >
        {isLoading ? "Generating..." : "Get AI Suggestions"}
      </button>

      {/* Display error message */}
      {error && <p className="ai-error-message">{error}</p>}

      {/* Display AI suggested tasks if available */}
      {aiSuggestedTasks && aiSuggestedTasks.length > 0 && (
        <div className="ai-suggestions-preview">
          <h3>AI Suggested List:</h3>
          <ul>
            {aiSuggestedTasks.map((task, index) => (
              <li key={index}>
                <strong>{task.title}:</strong> {task.description}
              </li>
            ))}
          </ul>
          <div className="ai-suggestion-actions">
            <button className="approve-button" onClick={handleApprove}>
              Approve & Add to List
            </button>
            <button className="discard-button" onClick={handleDiscard}>
              Discard
            </button>
          </div>
        </div>
      )}

      {aiSuggestedTasks && aiSuggestedTasks.length === 0 && !error && (
        <p className="ai-no-suggestions">AI did not suggest any tasks. Try rephrasing your request.</p>
      )}
    </div>
  );
};

export default Aitodo;




