import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCode = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "https://automatic-space-acorn-x47wwrwq5xphv47-8080.app.github.dev/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);
      setResult(data);
    } catch (err) {
      console.error("Frontend error:", err);
      setError("Failed to analyze code. Check backend or console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>CodeRefine</h1>
      <span className="badge">🤖 AI Powered by Gemini</span>

      <textarea
        rows="10"
        style={{ width: "100%", marginTop: "1rem" }}
        placeholder={`Paste your ${language.toUpperCase()} code here...`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
        <option value="csharp">C#</option>
        <option value="kotlin">Kotlin</option>
        <option value="swift">Swift</option>
        <option value="php">PHP</option>
        <option value="ruby">Ruby</option>
        <option value="bash">Bash</option>
        <option value="sql">SQL</option>
      </select>

      <br /><br />

      <button onClick={analyzeCode} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>

      {loading && (
        <p style={{ marginTop: "1rem" }}>🔍 Analyzing your code…</p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
      )}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Score: {result.score}</h3>

          {result.issues && result.issues.length > 0 && (
            <>
              <h4>Issues</h4>
              <ul>
                {result.issues.map((issue, index) => (
                  <li
                    key={index}
                    className={`severity ${issue.severity}`}
                  >
                    <strong>{issue.severity.toUpperCase()}</strong> –{" "}
                    {issue.message}
                  </li>
                ))}
              </ul>
            </>
          )}

          <h4>Optimized Code</h4>
          <pre>{result.optimized_code}</pre>

          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
