#!/bin/sh
WORKING_DIR=$(dirname $(readlink -f "$0"))
command0="cd ${WORKING_DIR} && pwd" 
tmux new-session -A -d -s development
tmux send-keys -t "development:.1" "cd ${WORKING_DIR} && docker compose up" C-m
tmux split-window -v -t 'development:.1'
tmux send-keys -t "development:.2" "cd ${WORKING_DIR}/huutokauppa && npm run dev" C-m
tmux split-window -v -t 'development:.2'
tmux send-keys -t "development:.3" "tmux select-layout even-vertical && cd ${WORKING_DIR}/backend && nodemon server.js" C-m
tmux attach-session -t 'development'
