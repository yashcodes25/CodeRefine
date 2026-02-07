import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  "https://automatic-space-acorn-x47wwrwq5xphv47-8080.app.github.dev/analyze";

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const analyzeCode = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        score: 0,
        issues: [{ severity: "high", message: "Backend error" }],
        optimized_code: "",
      });
    }

    setLoading(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">CodeRefine AI</div>
          <div className="nav">
            <button className="ghost" onClick={() => setShowAuth(true)}>
              Login / Signup
            </button>
            <a href="#contact" className="ghost">
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* HERO WITH BALL */}
      <section className="hero">
        <div
          className="ball"
          style={{
            transform: `scale(${1 + scrollY / 120})`,
            opacity: scrollY > 1000 ? 0 : 1,
          }}
        />
        <div className="hero-content">
          {scrollY > 120 && <h1 className="title">CodeRefine AI</h1>}
          {scrollY > 220 && (
            <p className="subtitle">
              AI-powered code analysis for developers and businesses
            </p>
          )}
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <h2>Impact</h2>
        <p>
          CodeRefine reduces production bugs, improves reliability, and saves
          engineering time using AI-powered insights.
        </p>
        <p>
          It empowers developers, students, and startups to write clean, safe,
          and optimized code.
        </p>
      </section>

      {/* ANALYZER */}
      <section className="platform">
        <h2>AI Code Analyzer</h2>

        <div className="code-grid">
          <div className="code-box">
            <h4>Your Code</h4>
            <textarea
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="code-box">
            <h4>Optimized Code</h4>
            <pre className="output">
              {result?.optimized_code || "// Optimized code appears here"}
            </pre>
          </div>
        </div>

        <div className="controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button onClick={analyzeCode}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {result && (
          <div className="result">
            <h3>Score: {result.score}</h3>
            <ul>
              {result.issues?.map((i, idx) => (
                <li key={idx} className={i.severity}>
                  {i.severity.toUpperCase()} – {i.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <h2>Contact</h2>
        <p>Email: support@coderefine.ai</p>
        <p>Phone: +91 98765 43210</p>
      </section>

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="modal">
          <div className="modal-box">
            <h2>Login / Signup</h2>
            <input placeholder="Email" />
            <input placeholder="Password" type="password" />
            <button className="primary">Continue</button>
            <button className="ghost" onClick={() => setShowAuth(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
