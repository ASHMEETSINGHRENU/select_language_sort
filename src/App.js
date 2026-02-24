import React, { useState, useEffect } from "react";

const categories = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Tailwind CSS",
    "Vue.js",
    "Angular",
    "Bootstrap",
    "SASS"
  ],
  Backend: [
    "Node.js",
    "PHP",
    "Python",
    "Java",
    "C#",
    "Ruby",
    "Go",
    "Express.js"
  ],
  Database: [
    "MySQL",
    "MongoDB",
    "PostgreSQL",
    "SQLite",
    "Firebase",
    "Oracle DB",
    "Redis",
    "MariaDB"
  ]
};

const allLanguages = Object.values(categories).flat();

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function App() {
  const TOTAL = allLanguages.length;

  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(
    localStorage.getItem("highScore") || 0
  );

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    let interval;
    if (started && !completed) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, completed]);

  useEffect(() => {
    if (score === TOTAL) {
      setCompleted(true);
      if (timer < highScore || highScore === 0) {
        localStorage.setItem("highScore", timer);
        setHighScore(timer);
      }
    }
  }, [score]);

  const resetGame = () => {
    const shuffled = shuffle(allLanguages).map((lang) => ({
      name: lang,
      placed: false,
      category: null,
    }));
    setItems(shuffled);
    setScore(0);
    setCompleted(false);
    setTimer(0);
    setStarted(false);
    setMessage("");
  };

  const handleDrop = (e, category) => {
    const name = e.dataTransfer.getData("text");
    const item = items.find((i) => i.name === name);

    if (!started) setStarted(true);

    if (categories[category].includes(name)) {
      setItems((prev) =>
        prev.map((i) =>
          i.name === name ? { ...i, placed: true, category } : i
        )
      );
      setScore((prev) => prev + 1);
      setMessage("✅ Correct!");
      setTimeout(() => setMessage(""), 1000);
    } else {
      setMessage("❌ Incorrect! Try again.");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-4">
        Programming Language Sorting Challenge
      </h1>

      <div className="flex justify-center gap-8 mb-4 text-lg font-semibold">
        <p>Score: {score}/{TOTAL}</p>
        <p>Time: {timer}s</p>
        <p>Best Time: {highScore || "--"}s</p>
      </div>

      {message && (
        <div className="text-center text-xl font-bold mb-4 animate-pulse">
          {message}
        </div>
      )}

      {/* Home Bucket */}
      <div className="bg-white text-black rounded-xl p-4 shadow-xl mb-6">
        <h2 className="text-xl font-bold mb-2 text-center">Home Bucket</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {items
            .filter((item) => !item.placed)
            .map((item) => (
              <div
                key={item.name}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text", item.name)
                }
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg cursor-grab hover:scale-110 transition transform duration-200 active:scale-95"
              >
                {item.name}
              </div>
            ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.keys(categories).map((cat) => (
          <div
            key={cat}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, cat)}
            className="bg-white text-black rounded-xl p-4 shadow-xl min-h-[250px] transition-all duration-300 hover:scale-105"
          >
            <h2 className="text-xl font-bold text-center mb-3">{cat}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {items
                .filter((item) => item.category === cat)
                .map((item) => (
                  <div
                    key={item.name}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg animate-bounce"
                  >
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Celebration */}
      {completed && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white text-black p-8 rounded-xl shadow-2xl text-center animate-pulse">
            <h2 className="text-2xl font-bold mb-4">
              🎉 Congratulations!
            </h2>
            <p className="mb-4">
              You sorted all {TOTAL} languages in {timer} seconds!
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-800 transition"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}