import booksImage from "./assets/hero-books.png";
import thoughtImage from "./assets/thought.png";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
const [pdfCount, setPdfCount] = useState(0);
const [sources, setSources] = useState([]);
const [answer, setAnswer] = useState("");
const [summary, setSummary] = useState("");
const [question, setQuestion] = useState("");
const [showFullAnswer, setShowFullAnswer] = useState(false);
const [questionCount, setQuestionCount] = useState(0);
const [user, setUser] = useState(null);

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  setSelectedFile(file);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    console.log(text);
    alert("PDF uploaded successfully!");
    setPdfCount((prev) => prev + 1);
  } catch (error) {
  console.error("ERROR:", error);
  alert(error);
}
};
const handleAsk = async () => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/ask?question=${question}`
    );

    const data = await response.json();

    setAnswer(data.answer);
    setSources(data.sources);
    console.log(data.sources);
    setQuestionCount((prev) => prev + 1);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  fetch("http://127.0.0.1:8000/pdfs")
    .then((response) => response.json())
    .then((data) => {
      setPdfCount(data.uploaded_pdfs.length);
    });
   onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
}, []);
const handleSummary = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/summary");
    const data = await response.json();

    setSummary(data.summary);
    console.log(data.summary);
  } catch (error) {
    console.error(error);
  }
};
const handleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  } catch (error) {
    console.log(error);
  }
};


const handleLogout = async () => {
  await signOut(auth);
  setUser(null);
};
  return (
    <div className="container">

      {/* Sidebar */}
      <aside className="sidebar">

        <h2>🌿 ResearchMind AI</h2>
        <p>Your AI Research Assistant</p>

        <div className="menu">
          <button>🏠 Dashboard</button>
          <button>📄 My PDFs</button>
          <button>💬 Ask Question</button>
          <button>📝 Summary</button>
          <button>🔍 Search</button>
          <button>ℹ️ About</button>
        </div>

        {/* Thought Image */}
        <div className="thought-section">
          <img src={thoughtImage} alt="thought" />
        </div>

      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Profile */}
        <div className="top-right">

  {!user ? (
    <button className="green-btn" onClick={handleLogin}>
      Sign in with Google
    </button>
  ) : (
    <div onClick={handleLogout} style={{ cursor: "pointer" }}>
      <img
        src={user.photoURL}
        alt="profile"
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "50%"
        }}
      />
    </div>
  )}

</div>

        {/* Hero Section */}
        <div className="hero-card">

          <div className="hero-text">
            <h1>Welcome to ResearchMind AI 🌿</h1>

            <p>
              Upload research papers, ask questions,
              generate summaries and explore AI-powered insights.
            </p>
          </div>

          <div className="hero-image">
            <img src={booksImage} alt="books" />
          </div>

        </div>

        {/* Stats */}
        <div className="stats">

          <div className="card">
            <h2>📚</h2>
            <h3>PDFs Uploaded</h3>
            <p>{pdfCount} Papers</p>
          </div>

          <div className="card">
            <h2>🧩</h2>
            <h3>Total Chunks</h3>
            <p>52 Chunks</p>
          </div>

          <div className="card">
            <h2>🤖</h2>
            <h3>Questions Asked</h3>
            <p>{questionCount} Questions</p>
          </div>

        </div>

        {/* Upload + Summary */}
        <div className="actions">

          {/* Upload PDF */}
          <div className="action-card">

            <h2>📄 Upload PDF</h2>

            <p>
              Add research papers and build your knowledge library.
            </p>

            <input
              type="file"
              accept=".pdf"
              id="pdf-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <label htmlFor="pdf-upload" className="green-btn">
              Choose PDF
            </label>

            {selectedFile && (
              <p style={{ marginTop: "15px" }}>
                {selectedFile.name}
              </p>
            )}

          </div>

          {/* Generate Summary */}
          <div className="action-card">

            <h2>✨ Generate Summary</h2>

            <p>
              Generate abstract, methodology, results and key takeaways.
            </p>

            <button className="green-btn" onClick={handleSummary}>
  Generate Summary
</button>

          </div>

        </div>

        {/* Ask Question */}
        <div className="question-box">

          <h2>Ask a Question</h2>

          <p>Ask anything about your documents</p>

          <div className="question-input">

<input
  type="text"
  placeholder="Type your question here..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
/>

<button
  className="send-btn"
  onClick={handleAsk}
>
  Send
</button>

          </div>

        </div>

        {/* Example Questions */}
        <div className="examples">

          <button>What is the main focus of this paper?</button>

          <button>Explain the methodology used</button>

          <button>What are the key results?</button>

          <button>Summarize the abstract</button>

        </div>

        {/* Bottom Section */}
        <div className="bottom-section">

          {/* Recent Answer */}
          <div className="bottom-card">

            <h2>💬 Recent Answer</h2>

           <div style={{ fontSize: "17px", lineHeight: "1.8" }}>
  <ReactMarkdown>
    {showFullAnswer
      ? answer
      : answer.substring(0, 250) + "..."}
  </ReactMarkdown>
</div>

<button
  className="green-btn"
  onClick={() => setShowFullAnswer(!showFullAnswer)}
>
  {showFullAnswer ? "Show Less" : "View Full Answer →"}
</button>
     {summary && (
  <div className="summary-section">
     <h2 className="summary-title">✨ Summary</h2>

    <div className="summary-content">
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
  </div>
)}     

          </div>

          {/* Top Sources */}
          <div className="bottom-card">

  <h2>📄 Top Sources</h2>

  {sources.map((source, index) => (
    <div key={index} className="source-item">

      <span>{source.filename}</span>

      <small>
        Page {source.page_number} • Chunk {source.chunk_number}
      </small>

    </div>
  ))}

</div>

        </div>

      </main>

    </div>
  );
}

export default App;