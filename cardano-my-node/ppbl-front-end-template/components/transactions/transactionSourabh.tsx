// Imports:
// You may not use all of these, and you may need to add a few!
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner, Link, Select
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { Transaction } from '@martifylabs/mesh'
import { stringToHex } from "../../cardano/utils";

const QUERY = gql`
    query TransactionsWithMetadataKey($metadatakey: String!) {
        transactions(
            where: { metadata: { key: {_eq: $metadatakey} } }
            order_by: { includedAt: desc }
        ) {
            hash
            includedAt
            metadata {
                key
                value
            }
        }
    }
`;



export default function TransactionSourabh() {
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const { walletConnected, wallet } = useWallet();

    const formik = useFormik({
        initialValues: {
            recipientAddress: '',
            tokenName: '',
            tokenAmount: ''
        },
        onSubmit: _ => {
            alert("Success!");
        },
    });

    const handleTransaction = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            let tokenAmount = Number(formik.values.tokenAmount)
            if (network == 1) {
                alert("For now, this dapp only works on Cardano Testnet")
            }
            else if (Number.isNaN(tokenAmount) || tokenAmount < 0 || !Number.isInteger(tokenAmount)) {
                alert("Token amount must be a positive integer")
            }
            else {
                const tx = new Transaction({ initiator: wallet }).sendAssets(
                    formik.values.recipientAddress,
                    [{
                        unit: formik.values.tokenName,
                        quantity: formik.values.tokenAmount
                    }]
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

    // Getting registered faucet tokens.
    const queryThisMetadataKey: string = "1618033988"
    let registeredFaucetTokens: any[] = []

    const { data, loading: qLoading, error } = useQuery(QUERY, {
        variables: {
            metadatakey: queryThisMetadataKey
        }
    });

    if (qLoading) {
        return (
            <Center p='10'>
                <Spinner size='xl' speed="1.0s" />
            </Center>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data registered faucet tokens.</Heading>
        );
    };

    // TODO: add a guard for incorrect metadata
    if (data) {
        data.transactions.forEach((tx: any) => {
            registeredFaucetTokens.push({
                policyId: tx.metadata[0].value.policyId,
                tokenName: tx.metadata[0].value.tokenName,
            })
        })
    }

    return (
        <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
            <Heading size='xl' display={'inline'}>
                Fau
            </Heading>
            <Heading size='xl' display={'inline'} fontStyle={'italic'}>
                cent
            </Heading>
            <Text py='3'>
                So you got some tokens from <Link href="/module301-faucets/registered-faucets">faucet</Link> eh? Why don't you spread em' to others!
            </Text>
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box mt='2'>
                    <FormControl my='3'>
                        <Input mb='3' bg='white' id="recipientAddress" name="recipientAddress" onChange={formik.handleChange} value={formik.values.recipientAddress} placeholder="Enter recipient address" isRequired/>
                        <Select placeholder='Select token' isRequired bg='white' mb='3' onChange={formik.handleChange} id='tokenName' name='tokenName' value={formik.values.tokenName}>
                            {registeredFaucetTokens.map(registeredfaucetToken => (
                                <option value={registeredfaucetToken.policyId + stringToHex(registeredfaucetToken.tokenName)}>
                                    {registeredfaucetToken.tokenName} with PolicyId: ...{registeredfaucetToken.policyId.substring(registeredfaucetToken.policyId.length - 3)}
                                </option>
                            ))}
                        </Select>
                        <Input mb='3' bg='white' id="tokenAmount" name="tokenAmount" onChange={formik.handleChange} value={formik.values.tokenAmount} placeholder="Enter token amount" isRequired/>
                        <Button colorScheme='purple' onClick={handleTransaction}>Send! 🚀</Button>
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