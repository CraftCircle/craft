"use client";

export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
        padding: "1rem",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)", 
          marginBottom: "1rem",
        }}
      >
        Welcome to CraftCircle
      </h1>
      <p
        style={{
          fontSize: "clamp(1rem, 3vw, 1.5rem)", 
          marginBottom: "2rem",
          maxWidth: "600px",
          lineHeight: "1.5",
        }}
      >
        Your platform for crafting amazing experiences. Connect, create, and
        share like never before.
      </p>
      <button
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onClick={() => alert("You clicked the button!")}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#005bb5")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#0070f3")
        }
      >
        Get Started
      </button>
    </main>
  );
}
