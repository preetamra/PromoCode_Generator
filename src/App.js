import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Load and parse CSV file
  useEffect(() => {
    const loadPromoCodes = async () => {
      try {
        const response = await fetch("/promocodes.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setPromoCodes(results.data.map((row) => row["Promotion code"]));
          },
        });
      } catch (error) {
        console.error("Error loading promo codes:", error);
      }
    };

    loadPromoCodes();
  }, []);

  // Generate random promo code
  const generateCode = () => {
    setCopySuccess(false);
    const randomIndex = Math.floor(Math.random() * promoCodes.length);
    setSelectedCode(promoCodes[randomIndex]);
  };

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="App" style={styles.container}>
      <h1 style={styles.title}>Promo Code Generator</h1>

      <button onClick={generateCode} style={styles.generateButton}>
        Generate Code
      </button>

      {selectedCode && (
        <>
          <div style={styles.codeContainer}>
            <div style={styles.codeDisplay}>{selectedCode}</div>
            <button onClick={copyToClipboard} style={styles.copyButton}>
              {copySuccess ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <div style={styles.instructionsContainer}>
            <h2 style={styles.instructionsTitle}>How to Redeem Your Code</h2>
            <ol style={styles.instructionsList}>
              <li>Open the BlockerPlus app on your device</li>
              <li>Navigate to Premium Purchase Page</li>
              <li>Select 12 months Plan</li>
              <li>Start the checkout process</li>
              <li>Look for the "Redeem" option</li>
              <li>Enter your promo code</li>
              <li>Complete the purchase process</li>
            </ol>
          </div>
        </>
      )}

      <Analytics />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  title: {
    color: "#333",
    marginBottom: "2rem",
  },
  generateButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "2rem",
  },
  codeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  codeDisplay: {
    padding: "1rem 2rem",
    backgroundColor: "white",
    border: "2px dashed #007bff",
    borderRadius: "5px",
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  copyButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  instructionsContainer: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  instructionsTitle: {
    color: "#333",
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  instructionsList: {
    paddingLeft: "1.5rem",
    lineHeight: "1.6",
    color: "#555",
  },
};

export default App;
