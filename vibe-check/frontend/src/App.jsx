import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import Dashboard from "./Dashboard";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>The Vibe Check Dashboard</h1>
      <FeedbackForm refresh={refresh} />
      <Dashboard key={refreshKey} />
    </div>
  );
}

export default App;
