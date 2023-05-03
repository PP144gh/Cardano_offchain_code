#!/usr/bin/env bash

# GBTE Transaction #3
# Issuer Unlocks a Bounty

# Usage:
#. 03-contributor-commits-to-bounty (ISSUER Address) (Path to ISSUER Signing Key) (CONTRIBUTOR Address)

# Arguments
export ISSUER=$1
export ISSUERKEY=$2
export CONTRIBUTOR=$3

BOUNTY_ADDR=addr_test1wzyvjgjxy5mr88ny3sm96qatd90fazsj625gxjr8hhrklqsf6ftxl
BOUNTY_PLUTUS_SCRIPT="<YOUR PATH TO>/ppbl-course-02/project-303/bounty-treasury-escrow/output/example-bounty-escrow-new-preprod.plutus"
BOUNTY_ASSET="fb45417ab92a155da3b31a8928c873eb9fd36c62184c736f189d334c.7447696d62616c"
BOUNTY_DATUM="<YOUR PATH TO>/ppbl-course-02/project-303/bounty-treasury-escrow/datum-and-redeemers/BountyEscrowDatumExample01.json"
ACTION_JSON_FILE="<YOUR PATH TO>/ppbl-course-02/project-303/bounty-treasury-escrow/datum-and-redeemers/Distribute.json"

export CARDANO_NODE_SOCKET_PATH=<YOUR PATH TO>/db/node.socket

cardano-cli query tip --testnet-magic 1
cardano-cli query protocol-parameters --testnet-magic 1 --out-file protocol.json

# This selection should match what is specified in your ACTION_JSON_FILE
echo "What escrow action will you perform? (1=Cancel 2=Update 3=Distribute, default 3)"
read ESCROW_ACTION

cardano-cli query utxo --testnet-magic 1 --address $BOUNTY_ADDR
echo "Which bounty utxo will you consume?"
read CONTRACT_TXIN
echo "How many lovelace are in this bounty?"
read LOVELACE_IN_BOUNTY
echo "How many tgimbals are in this bounty?"
read BOUNTY_TOKENS_IN_BOUNTY
echo "What is the Asset ID of the Contributor Token in this bounty?"
read CONTRIBUTOR_ASSET

cardano-cli query utxo --testnet-magic 1 --address $ISSUER
echo "Specify a Collateral UTxO:"
read COLLATERAL
echo "Specify UTxO with Issuer Token:"
read ISSUER_TOKEN_UTXO
echo "What is the Asset ID of Issuer Token?"
read ISSUER_ASSET
echo "Specify a TXIN for fees:"
read TXIN1

#This block builds a transaction based on your selected action
if [ $ESCROW_ACTION == 1 ]; then
    echo "Will the contributor token be returned (yes/no, default no)"
    read RETURN_CONTRIB
    if [ $RETURN_CONTRIB == "yes" ]; then
        export REMAINING_LOVELACE=$(expr $LOVELACE_IN_BOUNTY - 2000000)
        # export OUTPUTS="--tx-out $ISSUER+$REMAINING_LOVELACE + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET --tx-out $CONTRIBUTOR+2000000 + 1 $CONTRIBUTOR_ASSET"
        cardano-cli transaction build \
        --babbage-era \
        --tx-in $CONTRACT_TXIN \
        --tx-in-script-file $BOUNTY_PLUTUS_SCRIPT \
        --tx-in-datum-file $BOUNTY_DATUM \
        --tx-in-redeemer-file $ACTION_JSON_FILE \
        --tx-in $TXIN1 \
        --tx-in $ISSUER_TOKEN_UTXO \
        --tx-in-collateral $COLLATERAL \
        --tx-out $ISSUER+"$REMAINING_LOVELACE + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET" --tx-out $CONTRIBUTOR+"2000000 + 1 $CONTRIBUTOR_ASSET" \
        --tx-out $ISSUER+"1500000 + 1 $ISSUER_ASSET" \
        --change-address $ISSUER \
        --protocol-params-file protocol.json \
        --testnet-magic 1 \
        --out-file distribute-bounty-tx.draft
    else
        # export OUTPUTS="--tx-out $ISSUER+\"$LOVELACE_IN_BOUNTY + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET\""
        cardano-cli transaction build \
        --babbage-era \
        --tx-in $CONTRACT_TXIN \
        --tx-in-script-file $BOUNTY_PLUTUS_SCRIPT \
        --tx-in-datum-file $BOUNTY_DATUM \
        --tx-in-redeemer-file $ACTION_JSON_FILE \
        --tx-in $TXIN1 \
        --tx-in $ISSUER_TOKEN_UTXO \
        --tx-in-collateral $COLLATERAL \
        --tx-out $ISSUER+"$LOVELACE_IN_BOUNTY + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET" \
        --tx-out $ISSUER+"1500000 + 1 $ISSUER_ASSET" \
        --change-address $ISSUER \
        --protocol-params-file protocol.json \
        --testnet-magic 1 \
        --out-file distribute-bounty-tx.draft
    fi
elif [ ESCROW_ACTION == 2 ]; then
    echo "Specify a TXIN with additional bounty tokens and/or ada:"
    read TXIN2
    echo "Enter new lovelace value in bounty"
    read NEW_LOVELACE
    echo "Enter new bounty token value in bounty"
    read NEW_TOKENS
    # export OUTPUTS="--tx-out $BOUNTY_ADDR+\"$NEW_LOVELACE + $NEW_TOKENS $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET\" --tx-out-datum-embed-file $BOUNTY_DATUM"
    cardano-cli transaction build \
    --babbage-era \
    --tx-in $CONTRACT_TXIN \
    --tx-in-script-file $BOUNTY_PLUTUS_SCRIPT \
    --tx-in-datum-file $BOUNTY_DATUM \
    --tx-in-redeemer-file $ACTION_JSON_FILE \
    --tx-in $TXIN1 \
    --tx-in $ISSUER_TOKEN_UTXO \
    --tx-in-collateral $COLLATERAL \
    --tx-out $BOUNTY_ADDR+"$NEW_LOVELACE + $NEW_TOKENS $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET" --tx-out-datum-embed-file $BOUNTY_DATUM \
    --tx-out $ISSUER+"1500000 + 1 $ISSUER_ASSET" \
    --change-address $ISSUER \
    --protocol-params-file protocol.json \
    --testnet-magic 1 \
    --out-file distribute-bounty-tx.draft
else
    # export OUTPUTS="--tx-out $CONTRIBUTOR+\"$LOVELACE_IN_BOUNTY + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET\""
    cardano-cli transaction build \
    --babbage-era \
    --tx-in $CONTRACT_TXIN \
    --tx-in-script-file $BOUNTY_PLUTUS_SCRIPT \
    --tx-in-datum-file $BOUNTY_DATUM \
    --tx-in-redeemer-file $ACTION_JSON_FILE \
    --tx-in $TXIN1 \
    --tx-in $ISSUER_TOKEN_UTXO \
    --tx-in-collateral $COLLATERAL \
    --tx-out $CONTRIBUTOR+"$LOVELACE_IN_BOUNTY + $BOUNTY_TOKENS_IN_BOUNTY $BOUNTY_ASSET + 1 $CONTRIBUTOR_ASSET" \
    --tx-out $ISSUER+"1500000 + 1 $ISSUER_ASSET" \
    --change-address $ISSUER \
    --protocol-params-file protocol.json \
    --testnet-magic 1 \
    --out-file distribute-bounty-tx.draft
fi


cardano-cli transaction sign \
--signing-key-file $ISSUERKEY \
--testnet-magic 1 \
--tx-body-file distribute-bounty-tx.draft \
--out-file distribute-bounty-tx.signed

cardano-cli transaction submit \
--tx-file distribute-bounty-tx.signed \
--testnet-magic 1
-embed-file $BOUNTY_DATUM
