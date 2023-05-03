import { useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { Transaction } from '@martifylabs/mesh'
import type { UTxO } from "@martifylabs/mesh";

export default function QuickSendToken() {
    // PPBLSummer2022 token on Pre-Production
    const assetId = "748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c605050424c53756d6d657232303232"

    const { walletConnected, wallet } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            address: '',
        },
        onSubmit: values => {
            alert("Success!");
        },
    });

    const handleSend = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("For now, this dapp only works on Cardano Testnet")
            } else {
                try {
                    const tx = new Transaction({ initiator: wallet })
                        .sendValue(
                            formik.values.address,
                            {
                                output: {
                                    amount: [
                                        {
                                            unit: "lovelace",
                                            quantity: "5000000"
                                        },
                                        {
                                            unit: assetId,
                                            quantity: "1",
                                        }
                                    ]
                                }
                            },
                        );
                    const unsignedTx = await tx.build();
                    const signedTx = await wallet.signTx(unsignedTx);
                    const txHash = await wallet.submitTx(signedTx);
                    setSuccessfulTxHash(txHash)
                } catch (error: any) {
                    if (error.info) {
                        alert(error.info)
                    }
                    else {
                        alert(error)
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
                Quickly Send a PPBLSummer2022 Token
            </Heading>
            <Text py='1'>
                This form will send one PPBLSummer2022 token to the address specified.
            </Text>
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box mt='2'>
                    <FormControl>
                        <Input my='3' bg='white' id="address" name="address" onChange={formik.handleChange} value={formik.values.address} placeholder="Enter a Cardano Pre-Production address" />
                        <Button colorScheme='purple' onClick={handleSend}>Send to Address</Button>
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