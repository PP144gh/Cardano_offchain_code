import { useEffect, useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { Transaction } from '@martifylabs/mesh'


export default function DonateForm() {
    const donationAddress = "addr_test1qrqasyjrvff5skkxyf49t6feq0597exxzwu7sdszl89r64nsuygajm0vp4m29g85nr86sedq6rg4kmzt9c2ghmqld4ask5tdam"

    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);


    const formik = useFormik({
        initialValues: {
            lovelace: '',
        },
        onSubmit: values => {
            alert("Success!");
        },
    });

    // Ask Mesh team about Error reporting
    const handleDonate = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("For now, this dapp only works on Cardano Testnet")
            }
            else if (parseInt(formik.values.lovelace) < 1000000) {
                alert("You must send at least 1 ada.")
            }
            else {
                const tx = new Transaction({ initiator: wallet }).sendLovelace(
                    donationAddress,
                    formik.values.lovelace
                );
                try {
                    const unsignedTx = await tx.build();
                    const signedTx = await wallet.signTx(unsignedTx);
                    const txHash = await wallet.submitTx(signedTx);
                    console.log("Message", txHash)
                    setSuccessfulTxHash(txHash)
                } catch (error: any) {
                    if(error.info){
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
            <Heading size='lg'>
                Donate Form
            </Heading>
            <Text py='1'>
                This form will send any number of available lovelace specified to:
            </Text>
            <Text pb='2' fontSize="xs">
                {donationAddress}
            </Text>
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box mt='2'>
                    <FormControl my='3'>
                        <Input mb='3' bg='white' id="lovelace" name="lovelace" onChange={formik.handleChange} value={formik.values.lovelace} placeholder="Enter number of lovelace. (1 ADA = 1000000 Lovelace)" />
                        <Button colorScheme='purple' onClick={handleDonate}>Send this much lovelace</Button>
                    </FormControl>
                    <Box mt='2' p='2' bg='blue.100'>
                        <Heading size='sm' py='1'>Status</Heading>
                        {successfulTxHash ? (
                            <Text>Successful tx: {successfulTxHash}</Text>
                        ) : (
                            <Text>Ready to test a transaction!</Text>
                        )}
                    </Box>
                </Box>
            )}
        </Box>
    );
}