# Artsy Tic Tac Toe game with AI opponent
A unique Tic-Tac-Toe experience that pairs a recursive Minimax AI with a warm, "sketchbook" interface. This project explores how high-level game theory can be presented through an organic, hand-drawn UI.

# Link to play
Play it youself at the following address: [https://jovial-druid-ecdc72.netlify.app]
Have fun!

# Visual gallery 
<img width="240" height="63" alt="image" src="https://github.com/user-attachments/assets/ecbb1193-e3e5-4e8b-a5fe-caab59723b47" />
<img width="1887" height="981" alt="Screenshot 2026-03-13 200829" src="https://github.com/user-attachments/assets/990c1b2a-ea1a-4fa8-93dc-42ebacbc619c" />
<img width="1885" height="979" alt="Screenshot 2026-03-13 200847" src="https://github.com/user-attachments/assets/4ad328e6-1e47-4072-9a98-0282fd2401df" />

# The Algorithm - Minimax with Alpha-Beta Pruning 
The AI is built to be unbeatable. It doesn't just look for a move; it simulates every possible future of the game to ensure it never loses.
How it Thinks

- The algorithm treats the board as a state tree. For every turn, it recursively explores all branches until it hits a terminal state (Win, Loss, or Draw).
- Minimaxing: The AI (Minimizer) tries to reach a score of -1, while the Player (Maximizer) is assumed to be playing optimally to reach +1.
- Alpha-Beta Pruning: To keep the Python server from timing out or crashing, we use pruning. If the algorithm finds a branch that is guaranteed to be worse than a previously examined one, it "prunes" it, skipping thousands of unnecessary calculations.

 $$\alpha \geq \beta \rightarrow \text{Prune Branch}$$

 
# The UI Design
While the backend is rigid and mathematical, the frontend is designed to feel human.
- Custom Assets: Every component—the grid, the background, and the icons—was hand-drawn as high-resolution PNGs ($1024 \times 1024$) to preserve "pencil" textures.
- Tactile Feedback: Icons don't just appear; they use a cubic-bezier bounce animation to mimic a pen hitting paper.
- State-Aware Icons: The React frontend logic swaps the normal_o.png for a special O.png specifically for the three winning coordinates identified by the Python backend.

# Installation & Usage
## 1.The Backend (The AI)
The AI is a Flask-based microservice.
```
cd backend
python app.py
```
The AI listens for POST requests containing the board state and returns the optimal row/column coordinates.
## 2. The Frontend (The Art)
```
cd frontend
npm install
npm start
```

# Project Sctructure
- app.py: The Python logic containing the alfa_beta_minimax function.
- App.js: The React controller that manages the board state and "Thinking" delays.
- App.css: Custom "Artsy" styling, including image-rendering: pixelated and custom font-face integration.
- assets/: Hand-drawn PNG assets and textures.
