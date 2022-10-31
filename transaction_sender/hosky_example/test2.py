import os
import subprocess
import sys

# Path to the cardano-cli binary or use the global one
CARDANO_CLI_PATH = "cardano-cli"
# The directory where we store our payment keys
# assuming our current directory context is $HOME/receive-ada-sample
CARDANO_KEYS_DIR = "."
#tosend=int(sys.argv[1])
#limitsend=tosend+int(1000000)
#limitsend=tosend

# Read wallet address value from payment.addr file
with open(os.path.join(CARDANO_KEYS_DIR, "payment.addr"), 'r') as file:
    walletAddress = file.read()


# We tell python to execute cardano-cli shell command to query the UTXO and read the output data
rawUtxoTable = subprocess.check_output([
    CARDANO_CLI_PATH,
    'query', 'utxo',
    '--mainnet', 
    '--address', walletAddress])


# Calculate total lovelace of the UTXO(s) inside the wallet address
utxoTableRows = rawUtxoTable.strip().splitlines()
totalLovelaceRecv = 0
isPaymentComplete = False
i=0
'''
for x in range(2, len(utxoTableRows)):
    cells = utxoTableRows[x].split()
    totalLovelaceRecv +=  int(cells[2])


print(totalLovelaceRecv)
'''
totalutxos=len(utxoTableRows)
nrutxos=totalutxos
#nrutxos=150
for x in range(2, nrutxos):
    cells = utxoTableRows[x].split()
    utxo=cells[0].decode("utf-8")
    utxo2=cells[1].decode("utf-8")
    utxo3=utxo+'#'+utxo2
    if(i==0):
        utxos=utxo3
    else:
        utxos=utxos+","+utxo3
    i=i+1

print(utxos)

