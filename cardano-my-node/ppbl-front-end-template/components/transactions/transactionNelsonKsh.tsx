import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner, Link, Select
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { hexToString } from "../../cardano/utils";
import { Transaction, ForgeScript } from '@martifylabs/mesh';

const QUERY = gql`
    query assetsAndUtxos($address: String!) {
        assets (where: {tokenMints: {transaction: {inputs: {address: {_eq: $address}}}}}) {
        assetName
        policyId
        }
        utxos (where: {address: {_eq: $address}}) {
        tokens {
            asset {
            assetName
            policyId
            }
            quantity
        }
        }
    }
`;



export default function TransactionNelsonKsh() {
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const { walletConnected, wallet, connectedAddress } = useWallet();
    

    const formik = useFormik({
        initialValues: {
            tokenName: '',
            tokenAmount: ''
        },
        onSubmit: _ => {
            alert("Success!");
        },
    });
    
    const { data, loading: qLoading, error } = useQuery(QUERY, {
        variables: {
            address: connectedAddress
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
            <Heading size="lg">Error fetching tokens data.</Heading>
        );
    };

    let walletTokens: any[] = []

    if (data) {
        data.utxos.forEach((utxo: any) => {
            utxo.tokens.forEach((token: any) => {
                walletTokens.push({
                    quantity: token.quantity,
                    tokenName: token.asset.assetName,
                    policyId: token.asset.policyId
                })
            })
        })
    }





    const handleTransaction = async () => {

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
            const usedAddress = await wallet.getUsedAddresses();
            const address = usedAddress[0];
            const forgingScript = ForgeScript.withOneSignature(address);
            const tx = new Transaction({ initiator: wallet }).burnAsset(
                forgingScript,
                {
                    unit: formik.values.tokenName,
                    quantity: formik.values.tokenAmount
                }
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
                    alert(error)
                }
            }
        }
        setLoading(false)
    }




    if (walletConnected) {

        
       console.log(walletTokens)
        
        return (
            <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
                <Heading size='xl'>
                    Burn!!!
                </Heading>
                <Text py='3'>
                    Got some tokens that you minted but now you are having second thoughts about? Burn them!
                </Text>
                {loading ? (
                    <Center>
                        <Spinner />
                    </Center>
                ) : (
                    <FormControl my='3'>
                        <Select placeholder='Select token' isRequired bg='white' mb='3' onChange={formik.handleChange} id='tokenName' name='tokenName' value={formik.values.tokenName}>
                            {walletTokens.map(walletToken => (
                                <option value={walletToken.policyId + walletToken.tokenName}>
                                    {hexToString(walletToken.tokenName)} - ({walletToken.quantity})
                                </option>
                            ))}
                        </Select>
                        <Text>Note: Only assets minted by this address can be burned.</Text>
                        <Input mb='3' bg='white' id="tokenAmount" name="tokenAmount" onChange={formik.handleChange} value={formik.values.tokenAmount} placeholder="Enter token amount" isRequired/>
                        <Text>Warning for Now: You might need to burn all the amount you have otherwise an error 'Not enough ADA leftover to include non-ADA assets in a change address' might occur.</Text>
                        <Button colorScheme='purple' onClick={handleTransaction}>Burn 🔥</Button>
                    </FormControl>
                    )}
                <Box mt='2' p='2' bg='blue.100'>
                    <Heading size='sm' py='1'>Status</Heading>
                    {successfulTxHash ? (
                        <Text>Successful tx: {successfulTxHash}</Text>
                    ) : (
                        <Text>Ready to burn some tokens!</Text>
                    )}
                </Box>
                
            </Box>
        );
    } else {
        return (
            <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
                <Heading size='xl'>
                    Burn!!!
                </Heading>
                <Text py='3'>
                    Got some tokens that you minted but now you are having second thoughts about? Burn them!
                </Text>
                <Center>
                    <Text py='3' color="red">
                        ! Connect your wallet !
                    </Text>
                </Center>
            </Box>
        );
    }
}