import { useState } from "react";
import {
    Box, Heading, Text, Button, Center, Spinner, Link
} from "@chakra-ui/react"
import useWallet from "../../contexts/wallet";

import { Transaction } from '@martifylabs/mesh'

const donationAddress = "addr_test1qrqasyjrvff5skkxyf49t6feq0597exxzwu7sdszl89r64nsuygajm0vp4m29g85nr86sedq6rg4kmzt9c2ghmqld4ask5tdam"

export default function DonateButton() {
    const { walletConnected, wallet } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDonate = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("this dapp only works on Cardano Testnet")
            }
            else {
                const tx = new Transaction({ initiator: wallet }).sendLovelace(
                    donationAddress,
                    "5000000"
                );
                try {
                    const unsignedTx = await tx.build();
                    const signedTx = await wallet.signTx(unsignedTx);
                    const txHash = await wallet.submitTx(signedTx);
                    setSuccessfulTxHash(txHash)
                } catch (error: any) {
                    if (error.info) {
                        alert(error.info)
                    }
                    else {
                        console.log(error)
                    }
                }
            }
            setLoading(false)
        }
        else {
            alert("please connect a wallet")
        }
    }

    return (
        <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
            <Heading size='xl'>
                Donate Button
            </Heading>
            <Text py='3'>
                One of the simplest transactions we can create is a "donate" button. Anyone who clicks it will send 5 tAda to a hard-coded address.
            </Text>
            <Button onClick={handleDonate} colorScheme='green' my='3'>Donate Button</Button>
            <Box p='5' bg='blue.100'>
                <Text py='2'>Tx Status</Text>
                {loading ? (
                    <Center>
                        <Spinner />
                    </Center>
                ) : (
                    <>
                        <Text pt='3'>
                            You'll know the transaction was successful if you see a TxHash here: {successfulTxHash}
                        </Text>
                        <Text pt='3'>
                            Go find your transaction on <Link href='https://testnet.cardanoscan.io/'>https://testnet.cardanoscan.io/</Link>. It may take a few moments to show up. Why do you think it is possible to see a TxHash before it is visible a blockchain explorer?
                        </Text>
                    </>
                )}
            </Box>
        </Box>
    );
}
