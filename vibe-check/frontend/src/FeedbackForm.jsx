import React, { useState } from "react";
import { submitFeedback } from "./api";

function FeedbackForm({ refresh }) {
  const [text, setText] = useState("");
  const [department, setDepartment] = useState("Hostel");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    if (!text) return alert("Enter feedback first");

    try {
      const res = await submitFeedback(text, department);
      setResult(res.data.category);
      setText("");
      refresh();
    } catch {
      alert("Error submitting feedback");
    }
  };

  return (
    <div style={styles.card}>
      <h2>Submit Campus Feedback</h2>

      <textarea
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter feedback..."
        style={styles.textarea}
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={styles.select}
      >
        <option>Hostel</option>
        <option>Library</option>
        <option>Cafeteria</option>
        <option>Academics</option>
      </select>

      <button onClick={handleSubmit} style={styles.button}>
        Submit
      </button>

      {result && <p><strong>Category:</strong> {result}</p>}
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    background: "#f4f6f8",
    borderRadius: "10px",
    marginBottom: "30px"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px"
  },
  select: {
    padding: "8px",
    marginBottom: "10px"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default FeedbackForm;
