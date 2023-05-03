import { useEffect, useState } from "react";
import {
    Box, Button, Center, Heading, Spinner, Text, Link, FormControl, Input, FormLabel, Flex, Spacer
} from "@chakra-ui/react"
import { useFormik } from "formik";
import { FaucetMetadata } from "../../cardano/Types";
import { Transaction, resolveDataHash, resolvePaymentKeyHash } from '@martifylabs/mesh'
import useWallet from "../../contexts/wallet";

export default function FaucetMetadataRegistration(props: any) {

    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [registrationMetadata, setRegistrationMetadata] = useState<FaucetMetadata>({
        policyId: '',
        tokenName: '',
        contractAddress: '',
        withdrawalAmount: '',
        datumInt: ''
    })

    const formik = useFormik({
        initialValues: {
            registrationMetadata
        },
        onSubmit: values => {
            alert("Success!");
        },
    });

    useEffect(() => {
        setRegistrationMetadata({
            policyId: formik.values.registrationMetadata.policyId,
            tokenName: formik.values.registrationMetadata.tokenName,
            contractAddress: formik.values.registrationMetadata.contractAddress,
            withdrawalAmount: formik.values.registrationMetadata.withdrawalAmount,
            datumInt: formik.values.registrationMetadata.datumInt
        })
    }, [formik.values])

    const handleSubmitMetadata = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("For now, this dapp only works on Cardano Testnet")
            }
            const tx = new Transaction({ initiator: wallet }).sendLovelace(
                connectedAddress,
                "1000000"
            )
                .setMetadata(
                    111111111,
                    JSON.stringify(registrationMetadata)
                )
            const unsignedTx = await tx.build();
            const signedTx = await wallet.signTx(unsignedTx);
            const txHash = await wallet.submitTx(signedTx);
            setSuccessfulTxHash(txHash)
            setLoading(false)
        }
        else {
            alert("please connect a wallet")
        }
    }

    return (
        <Box my='5' p='5' bg='purple.900' color='white' border='1px' borderRadius='lg'>
            <Heading size='xl' py='2' color='white'>
                Faucet Metadata Registration Form (Made Easy with Mesh!)
            </Heading>
            <Text py='2' fontSize='lg'>
                We recommend adding Faucet Metadata via cardano-cli. Please <Link href="https://gimbalabs.instructure.com/courses/26/assignments/456" color='yellow.100'>review the Assignment on Canvas</Link> and <Link href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-course-02/-/blob/master/project-301-faucet/register-your-faucet.md" color='yellow.100'>see full documentation on GitLab</Link>.
            </Text>
            <Text py='2' fontSize='lg'>
                If you do not have access to a Cardano Pre-Production node, you can use this handy form. You will send 1 ada to yourself and pay a tx fee. Fill out this form carefully - when you submit and sign the transaction, your responses will be written immutably on-chain.
            </Text>


            <Flex direction='row' mt='5'>
                <FormControl w='30%' my='3'>
                    <FormLabel>Token PolicyId</FormLabel>
                    <Input mb='3' bg='white' fontSize='sm' id="registrationMetadata.policyId" name="registrationMetadata.policyId" onChange={formik.handleChange} value={formik.values.registrationMetadata.policyId} placeholder="Enter the PolicyId of your token" />
                    <FormLabel>Token Name</FormLabel>
                    <Input mb='3' bg='white' fontSize='sm' id="registrationMetadata.tokenName" name="registrationMetadata.tokenName" onChange={formik.handleChange} value={formik.values.registrationMetadata.tokenName} placeholder="Enter the name of your token" />
                    <FormLabel>Contract Address</FormLabel>
                    <Input mb='3' bg='white' fontSize='sm' id="registrationMetadata.contractAddress" name="registrationMetadata.contractAddress" onChange={formik.handleChange} value={formik.values.registrationMetadata.contractAddress} placeholder="Enter the Contract Address" />
                    <FormLabel>Withdrawal Amount</FormLabel>
                    <Input mb='3' bg='white' fontSize='sm' id="registrationMetadata.withdrawalAmount" name="registrationMetadata.withdrawalAmount" onChange={formik.handleChange} value={formik.values.registrationMetadata.withdrawalAmount} placeholder="Enter the Withdrawal Amount" />
                    <FormLabel>Datum Int (as used in Locking Transaction)</FormLabel>
                    <Input mb='3' bg='white' fontSize='sm' id="registrationMetadata.datumInt" name="registrationMetadata.datumInt" onChange={formik.handleChange} value={formik.values.registrationMetadata.datumInt} placeholder="Enter a number for datum" />
                    <Button my='2' colorScheme='purple' onClick={handleSubmitMetadata}>Send a Tx to Register this Faucet Metadata</Button>
                </FormControl>
                <Spacer />
                <Box w='65%' p='5' border='1px' borderRadius='lg'>
                    <pre>
                        <code className="language-js">
                            {JSON.stringify(registrationMetadata, null, 2)}
                        </code>
                    </pre>
                </Box>

            </Flex>
            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box mt='2' p='2' bg='purple.100' color='black'>
                    {successfulTxHash ? (
                        <Text>
                            Status: Tx Complete! TxHash: {successfulTxHash}
                        </Text>
                    ) : (
                        <Text>
                            Status: Awaiting Metadata
                        </Text>
                    )}
                </Box>
            )}

        </Box>
    );
}