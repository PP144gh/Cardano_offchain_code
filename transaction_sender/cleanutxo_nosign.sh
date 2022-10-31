#!/bin/bash

cardano-cli query protocol-parameters \
    --mainnet \
    --out-file protocol.json

if [ 1 -eq 0 ]; then
cardano-cli query utxo \
    --address $(cat payment.addr) \
    --mainnet
fi


result1=$(python3 test3.py)
#echo $result1
IFS=',' read -ra marray1 <<< "$result1"
#Print the split string
for i in "${marray1[@]}";
do
    echo $i
done

total=$marray1
totalhosky=$i
policy=a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235.HOSKY

tokenstosend="$totalhosky $policy"

#echo $total
#echo $totalhosky
#echo $tokenstosend


result=$(python3 test2.py)
#echo $result

IFS=',' read -ra marray <<< "$result"
#Print the split string
touch add.txt
> add.txt
touch draftinput.sh
> draftinput.sh
echo "#!/bin/bash" >> draftinput.sh
echo "cardano-cli transaction build-raw \\" >> draftinput.sh
echo "    --tx-out $(cat ledger.addr)+0 \\" >> draftinput.sh
echo "    --invalid-hereafter 0 \\" >> draftinput.txt
echo "    --fee 0 \\" >> draftinput.sh
echo "    --out-file tx.draft" >> draftinput.sh

for i in "${marray[@]}";
do
   echo "    --tx-in $i \\" >> add.txt
done

#sed -i -e 's/^/    /' add.txt

sed -i '/cardano-cli transaction build-raw \\/r add.txt' draftinput.sh

chmod u+x draftinput.sh
./draftinput.sh

#echo ola
#fixed fee 1 ada
fee=200000

adatosend=$( expr $total - $fee )
#echo $adatosend
slotraw=$(cardano-cli query tip --mainnet | grep slot)

slot=$(echo $slotraw | egrep -o '[0-9.]+')

ttl=$(expr $slot + 200)


touch rawinput.sh
> rawinput.sh
echo "#!/bin/bash" >> rawinput.sh
echo "cardano-cli transaction build-raw \\" >> rawinput.sh
echo "    --tx-out $(cat ledger.addr)+$adatosend \\" >> rawinput.sh
echo "    --invalid-hereafter $ttl \\" >> rawinput.txt
echo "    --fee $fee \\" >> rawinput.sh
echo "    --out-file tx.raw" >> rawinput.sh


sed -i '/cardano-cli transaction build-raw \\/r add.txt' rawinput.sh

chmod u+x rawinput.sh
./rawinput.sh

if [ 1 -eq 0 ]; then
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file payment.skey \
    --mainnet \
    --out-file tx.signed


cardano-cli transaction submit \
    --tx-file tx.signed \
    --mainnet

rm *.draft *.raw *.signed rawinput.txt draftinput.txt rawinput.sh draftinput.sh *.out
fi

