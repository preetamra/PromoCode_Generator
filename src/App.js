import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.blockerplus.blockerplus";

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
      <h1 style={styles.title}>BlockerPlus Promo Code Generator</h1>

      <div style={styles.description}>
        <p>
          Get your exclusive promo code for BlockerPlus Premium! 🎉
          <br />
          Limited availability - first come, first served.
        </p>
      </div>

      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.playStoreLink}
      >
        📱 Get it on Play Store
      </a>

      <button onClick={generateCode} style={styles.generateButton}>
        Generate Code
      </button>

      {selectedCode && (
        <>
          <div style={styles.codeContainer}>
            <div style={styles.codeDisplay}>{selectedCode}</div>
            <button onClick={copyToClipboard} style={styles.copyButton}>
              {copySuccess ? "Copied! ✅" : "Copy Code 📋"}
            </button>
          </div>

          <div style={styles.instructionsContainer}>
            <h2 style={styles.instructionsTitle}>📱 How to Redeem Your Code:</h2>
            <ol style={styles.instructionsList}>
              <li>Open the Google Play app</li>
              <li>Tap your profile icon → Payments & subscriptions</li>
              <li>Select "Redeem code"</li>
              <li>Enter the code above</li>
              <li>Open BlockerPlus app</li>
            </ol>
            <div style={styles.note}>
              ⚠️ Note: If premium features don't activate immediately, try clearing
              the app cache and restarting the app.
            </div>
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial",
  },
  title: {
    color: "#1a1a1a",
    marginBottom: "1rem",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#444",
    fontSize: "1.1rem",
    lineHeight: "1.5",
  },
  playStoreLink: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#0079d3",
    textDecoration: "none",
    borderRadius: "25px",
    border: "2px solid #0079d3",
    fontWeight: "bold",
    transition: "all 0.2s",
    fontSize: "1rem",
    marginBottom: "2rem",
    ":hover": {
      backgroundColor: "#0079d3",
      color: "#ffffff",
    },
  },
  generateButton: {
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    backgroundColor: "#0079d3",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    marginBottom: "2rem",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#005fa3",
    },
  },
  codeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    width: "100%",
    maxWidth: "400px",
  },
  codeDisplay: {
    padding: "1rem 2rem",
    backgroundColor: "white",
    border: "2px dashed #0079d3",
    borderRadius: "8px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },
  copyButton: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#218838",
    },
  },
  instructionsContainer: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  instructionsTitle: {
    color: "#1a1a1a",
    fontSize: "1.3rem",
    marginBottom: "1rem",
  },
  instructionsList: {
    paddingLeft: "1.5rem",
    lineHeight: "1.8",
    color: "#444",
    marginBottom: "1.5rem",
  },
  note: {
    backgroundColor: "#fff3cd",
    padding: "1rem",
    borderRadius: "8px",
    color: "#856404",
    fontSize: "0.9rem",
  },
};

export default App;
