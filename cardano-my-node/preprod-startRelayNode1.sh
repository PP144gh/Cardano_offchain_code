#!/bin/bash
DIRECTORY=/home/pp/cardano-my-node
PORT=6001
HOSTADDR=0.0.0.0
TOPOLOGY=${DIRECTORY}/preprod-topology.json
DB_PATH=${DIRECTORY}/preprod-db
SOCKET_PATH=${DIRECTORY}/preprod-db/socket
CONFIG=${DIRECTORY}/preprod-config.json
cardano-node run --topology ${TOPOLOGY} --database-path ${DB_PATH} --socket-path ${SOCKET_PATH} --host-addr ${HOSTADDR} --port ${PORT} --config ${CONFIG}
