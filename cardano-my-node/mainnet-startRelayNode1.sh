#!/bin/bash
DIRECTORY=/home/pp/cardano-my-node
PORT=6000
HOSTADDR=0.0.0.0
TOPOLOGY=${DIRECTORY}/mainnet-topology.json
DB_PATH=${DIRECTORY}/mainnet-db
SOCKET_PATH=${DIRECTORY}/mainnet-db/socket
CONFIG=${DIRECTORY}/mainnet-config.json
cardano-node run +RTS -N -A16m -qg -qb -RTS --topology ${TOPOLOGY} --database-path ${DB_PATH} --socket-path ${SOCKET_PATH} --host-addr ${HOSTADDR} --port ${PORT} --config ${CONFIG}
