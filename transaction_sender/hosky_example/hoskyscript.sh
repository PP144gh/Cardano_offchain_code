#!/bin/bash

while :
do

cardano-cli query protocol-parameters \
    --mainnet \
    --out-file protocol.json

if [ 1 -eq 0 ]; then
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
fi

tosend=2000000

result=$(python3 test.py $tosend)
echo $result
IFS=',' read -ra marray <<< "$result"
#Print the split string
for i in "${marray[@]}";
do
    echo $i
done

utxo=$marray
total=$i
#echo utxo
#echo $utxo
#echo $total

cardano-cli transaction build-raw \
    --tx-in $utxo \
    --tx-out $(cat hosky.addr)+0 \
    --tx-out $(cat payment.addr)+0 \
    --invalid-hereafter 0 \
    --fee 0 \
    --out-file tx.draft

feeraw=$(cardano-cli transaction calculate-min-fee     --tx-body-file tx.draft     --tx-in-count 1     --tx-out-count 2     --witness-count 1     --byron-witness-count 0     --mainnet     --protocol-params-file protocol.json)

fee=$(echo $feeraw | egrep -o '[0-9.]+')


change=$( expr $total - $fee - $tosend)

slotraw=$(cardano-cli query tip --mainnet | grep slot)

slot=$(echo $slotraw | egrep -o '[0-9.]+')

ttl=$(expr $slot + 200)


cardano-cli transaction build-raw \
    --tx-in $utxo \
    --tx-out $(cat hosky.addr)+$tosend \
    --tx-out $(cat payment.addr)+$change \
    --invalid-hereafter $ttl \
    --fee $fee \
    --out-file tx.raw


cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --mainnet \
    --out-file tx.signed


cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet

rm *.draft *.raw *.signed

sleeper=$((5 + $RANDOM % 10))
sleep $sleeper
done

