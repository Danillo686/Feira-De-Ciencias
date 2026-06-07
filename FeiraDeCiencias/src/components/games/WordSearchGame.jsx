import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { playClickSound, playSuccessSound } from "../../utils/sounds";

const WORDS_SEARCH = {
  easy: ["IA", "ROBO", "DADO"],
  medium: ["NEURAL", "SENSOR", "CODIGO", "NUVEM"],
  hard: ["ALGORITMO", "DEEPFAKE", "AUTOMACAO", "VIES", "DILEMA"]
};

const WordSearchGame = ({ onComplete, onBack, difficulty = "easy" }) => {
  const [grid, setGrid] = useState([]);
  const [targetWords, setTargetWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]); // Array of { r, c }
  const [startTime, setStartTime] = useState(null);
  const [size, setSize] = useState(8);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const words = WORDS_SEARCH[difficulty] || WORDS_SEARCH.easy;
    setTargetWords(words);
    setFoundWords([]);
    setSelectedCells([]);
    setStartTime(Date.now());

    const gridSize = difficulty === "easy" ? 6 : difficulty === "medium" ? 8 : 10;
    setSize(gridSize);

    // Generate grid
    let newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));

    // Helper to place a word
    const placeWord = (word) => {
      let placed = false;
      let attempts = 0;
      
      // Directions: 
      // 0: Horizontal forward, 1: Vertical forward
      // 2: Diagonal forward-down, 3: Diagonal forward-up
      // On hard, we allow reversed versions of these!
      const maxDir = difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 8;

      while (!placed && attempts < 200) {
        attempts++;
        const dir = Math.floor(Math.random() * maxDir);
        let dRow = 0;
        let dCol = 0;
        let wordStr = word;

        // check if reversed
        if (dir >= 4) {
          wordStr = word.split("").reverse().join("");
        }

        const activeDir = dir % 4;
        if (activeDir === 0) { // Horizontal
          dCol = 1;
        } else if (activeDir === 1) { // Vertical
          dRow = 1;
        } else if (activeDir === 2) { // Diagonal down
          dRow = 1;
          dCol = 1;
        } else if (activeDir === 3) { // Diagonal up
          dRow = -1;
          dCol = 1;
        }

        // Random starting point
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        // Check boundary
        const endRow = startRow + dRow * (wordStr.length - 1);
        const endCol = startCol + dCol * (wordStr.length - 1);

        if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
          continue;
        }

        // Check overlap
        let fits = true;
        for (let i = 0; i < wordStr.length; i++) {
          const r = startRow + dRow * i;
          const c = startCol + dCol * i;
          if (newGrid[r][c] !== "" && newGrid[r][c] !== wordStr[i]) {
            fits = false;
            break;
          }
        }

        if (fits) {
          for (let i = 0; i < wordStr.length; i++) {
            const r = startRow + dRow * i;
            const c = startCol + dCol * i;
            newGrid[r][c] = wordStr[i];
          }
          placed = true;
        }
      }
    };

    // Place all target words
    words.forEach(word => placeWord(word.toUpperCase()));

    // Fill empty cells with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c] === "") {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
  };

  const handleCellClick = (r, c) => {
    playClickSound();

    // Check if cell is already selected
    const isAlreadySelected = selectedCells.some(cell => cell.r === r && cell.c === c);

    let newSelected;
    if (isAlreadySelected) {
      newSelected = selectedCells.filter(cell => !(cell.r === r && cell.c === c));
    } else {
      newSelected = [...selectedCells, { r, c }];
    }

    setSelectedCells(newSelected);

    // Verify if newSelected forms any of the target words
    const selectedString = newSelected.map(cell => grid[cell.r][cell.c]).join("");
    const reversedString = selectedString.split("").reverse().join("");

    const matchedWord = targetWords.find(word => {
      const upperWord = word.toUpperCase();
      return (upperWord === selectedString || upperWord === reversedString) && !foundWords.includes(word);
    });

    if (matchedWord) {
      // Check if cells form a valid alignment:
      // (Row matches, Column matches, or equal absolute differences in row and col for diagonal)
      const isHorizontal = newSelected.every(cell => cell.r === newSelected[0].r);
      const isVertical = newSelected.every(cell => cell.c === newSelected[0].c);
      
      // Diagonal check
      let isDiagonal = false;
      if (newSelected.length > 1) {
        const rowDiff = Math.abs(newSelected[1].r - newSelected[0].r);
        const colDiff = Math.abs(newSelected[1].c - newSelected[0].c);
        if (rowDiff === colDiff && rowDiff > 0) {
          isDiagonal = newSelected.every((cell, idx) => {
            if (idx === 0) return true;
            return Math.abs(cell.r - newSelected[idx-1].r) === Math.abs(cell.c - newSelected[idx-1].c);
          });
        }
      }

      if (isHorizontal || isVertical || isDiagonal) {
        playSuccessSound();
        const nextFound = [...foundWords, matchedWord];
        setFoundWords(nextFound);
        setSelectedCells([]);

        if (nextFound.length === targetWords.length) {
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          const baseScore = difficulty === "easy" ? 30 : difficulty === "medium" ? 60 : 100;
          const finalScore = Math.max(10, baseScore - Math.floor(timeSpent * 0.4));
          setTimeout(() => {
            onComplete({ score: finalScore, timeSpent });
          }, 1500);
        }
      }
    }
  };

  const isCellSelected = (r, c) => selectedCells.some(cell => cell.r === r && cell.c === c);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden font-sans"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans">
          Caça-Palavras • {difficulty === "easy" ? "🟢 Fácil" : difficulty === "hard" ? "🔴 Difícil" : "🟡 Médio"}
        </span>
      </div>

      <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Left: Target word list */}
        <div className="w-full md:w-48 flex flex-col gap-3">
          <h3 className="font-display font-black text-slate-700 dark:text-slate-300 text-sm border-b pb-2">Palavras Ocultas:</h3>
          <div className="flex md:flex-col gap-2 flex-wrap font-serif italic">
            {targetWords.map(word => {
              const isFound = foundWords.includes(word);
              return (
                <div
                  key={word}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-bold text-center md:text-left transition-all ${
                    isFound
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 line-through"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Grid */}
        <div className="flex-1 flex flex-col items-center">
          <div
            className="grid gap-1.5 p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              width: "100%",
              maxWidth: difficulty === "easy" ? "300px" : difficulty === "medium" ? "380px" : "460px"
            }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const isSelected = isCellSelected(r, c);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square rounded-lg font-bold font-mono text-sm sm:text-base flex items-center justify-center shadow-sm transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-2 border-blue-400 scale-105"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>

          {foundWords.length === targetWords.length && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mt-4 font-sans">
              <CheckCircle size={20} /> Todas as palavras foram localizadas!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WordSearchGame;
