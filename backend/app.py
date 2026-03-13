from flask import Flask, request, jsonify
from flask_cors import CORS
from random import choice
from math import inf

app = Flask(__name__)
CORS(app)

def winning_player(board,player):
    conditions = [[board[0][0], board[0][1], board[0][2]],
                  [board[1][0], board[1][1], board[1][2]],
                  [board[2][0], board[2][1], board[2][2]],
                  [board[0][0], board[1][0], board[2][0]],
                  [board[0][1], board[1][1], board[2][1]],
                  [board[0][2], board[1][2], board[2][2]],
                  [board[0][0], board[1][1], board[2][2]],
                  [board[0][2], board[1][1], board[2][0]]]
    return [player, player, player] in conditions

def game_is_won(board):
    return winning_player(board, 1) or winning_player(board, -1)

def blanks (board):
    blank=[]
    for x, row in enumerate(board):
        for y, col in enumerate(row):
            if board[x][y] == 0:
                blank.append([x, y])
    return blank

def set_move(board,x,y,player):
    board[x][y] = player

def evaluate(board, depth):
    if winning_player(board, 1):
        return 10 + depth
    elif winning_player(board, -1):
        return -10 - depth
    else:
        return 0



def alfa_beta_minimax(board, depth, a, b, player):
    row, col = -1, -1
    if depth == 0 or game_is_won(board):
        return [row, col, evaluate(board,depth)]
    if player == 1:
        bestScore = -inf
        for space in blanks(board):
            set_move(board, space[0], space[1], player)
            _, _, score = alfa_beta_minimax(board, depth-1, a, b, -player)
            set_move(board, space[0], space[1], 0)
            if score > bestScore:
                bestScore, row, col = score, space[0], space[1]
            a = max(a, bestScore)
            if a >= b: break
        return [row, col, bestScore]
    else:
        bestScore = inf
        for space in blanks(board):
            set_move(board, space[0], space[1], player)
            _, _, score = alfa_beta_minimax(board, depth-1, a, b, -player)
            set_move(board, space[0], space[1], 0)
            if score < bestScore:
                bestScore, row, col = score, space[0], space[1]
            b = min(b, bestScore)
            if a >= b: break
        return [row, col, bestScore]


@app.route('/ai-move', methods=['POST'])
def ai_move():
    incoming_board = request.json['board']
  
    if winning_player(incoming_board, 1):
        return jsonify({'status': 'You won!'})
    if not blanks(incoming_board):
        return jsonify({'status': 'Draw!'})

   
    if len(blanks(incoming_board)) == 9:
        x, y = choice([0,1,2]), choice([0,1,2])
    else:
        result = alfa_beta_minimax(incoming_board, len(blanks(incoming_board)), -inf, inf, -1)
        x, y = result[0], result[1]
    
  
    set_move(incoming_board, x, y, -1)
    
    
    status = "Your turn! (X)"
    if winning_player(incoming_board, -1):
        status = "AI has won!"
    elif not blanks(incoming_board):
        status = "Draw!"

    return jsonify({'row': x, 'col': y, 'status': status})

if __name__ == '__main__':
    app.run(port=5000, debug=True)