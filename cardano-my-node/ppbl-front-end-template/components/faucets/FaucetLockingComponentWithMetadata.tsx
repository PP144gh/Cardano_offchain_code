import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
    Box, Button, Center, Heading, Spinner, Text, Link, FormControl, Input
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { Transaction, resolveDataHash, resolvePaymentKeyHash} from '@martifylabs/mesh'
import type { UTxO, Asset, Data, Action } from '@martifylabs/mesh'
import { faucetList } from "../../cardano/plutus/ppbl-preprod-faucet-list"
import { FaucetMetadata } from "../../cardano/Types";
import { stringToHex } from "../../cardano/utils";

const QUERY = gql`
    query UtxosAtAddress($contractAddress: String!) {
        utxos(where : {address : { _eq : $contractAddress }}){
            txHash
            index
            value
            tokens {
                asset {
                    policyId
                    assetName
                }
                quantity
            }
        }
    }
`;

type Props = {
    faucetInstance: FaucetMetadata
}

const FaucetLockingComponentWithMetadata: React.FC<Props> = ({ faucetInstance }) => {

    // 1. Consume Metadata
    // 2. Populate instance of this Component
    // 3. Create a form to take number of tokens
    // 3. Build the Tx

    const contractAddress = faucetInstance.contractAddress;
    const datum = parseInt(faucetInstance.datumInt);
    const datumHash = resolveDataHash(datum);
    const faucetAssetPolicyId: string = faucetInstance.policyId;
    const faucetTokenName = faucetInstance.tokenName;
    const tokenHex: string = stringToHex(faucetTokenName);
    const faucetAsset: string = faucetAssetPolicyId + tokenHex;

    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            numTokensToLock: '',
        },
        onSubmit: values => {
            alert("Success!");
        },
    });

    const tokensToLock = [
        {
            unit: faucetAsset,
            quantity: formik.values.numTokensToLock
        }
    ]

    const handleLockTokens = async () => {
        if (walletConnected) {
            setLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("For now, this dapp only works on Cardano Testnet")
            } else {
                try {
                    const tx = new Transaction({
                        initiator: wallet, parameters: {
                            epoch: 0,
                            coinsPerUTxOSize: '34482',
                            priceMem: 0.0577,
                            priceStep: 0.0000721,
                            minFeeA: 44,
                            minFeeB: 155381,
                            keyDeposit: '2000000',
                            maxTxSize: 16384,
                            maxValSize: '5000',
                            poolDeposit: '500000000',
                            maxCollateralInputs: 3,
                            maxBlockSize: 65536,
                            collateralPercent: 150,
                            maxBlockHeaderSize: 1100,
                            minPoolCost: '0',
                            maxTxExMem: '10000000',
                            maxTxExSteps: '10000000000',
                            maxBlockExMem: '50000000',
                            maxBlockExSteps: '40000000000',
                        }, era: "ALONZO"
                    })
                        .sendAssets(
                            contractAddress,
                            tokensToLock,
                            { datum: datum }
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
        <Box width="50%" m='5' p='5' bg='white' color='black' border='1px' borderRadius='lg'>
            <Heading size='lg'>
                Token Locking Component
            </Heading>
            <Text py='2' fontSize='md'>
                This Component is made with Metadata!
            </Text>
            <Text py='2' fontSize='md'>
                We probably do not want to allow just anyone to deposit tokens at this Contract Address. Think about what logic we could implement here. For example, the locking component should only appear if the Contract Address has no UTxOs.
            </Text>
            <Text py='2'>
                Deposit at Contract: {contractAddress}
            </Text>
            <FormControl my='3'>
                <Input mb='3' bg='white' id="numTokensToLock" name="numTokensToLock" onChange={formik.handleChange} value={formik.values.numTokensToLock} placeholder="Enter number of tokens" />
                <Button colorScheme='purple' onClick={handleLockTokens}>Lock {formik.values.numTokensToLock} {faucetTokenName}</Button>
            </FormControl>

            {loading ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box mt='2' p='2' bg='purple.200' color='black'>
                    {successfulTxHash ? (
                        <Text>
                            {successfulTxHash}
                        </Text>
                    ) : (
                        <Text>
                            Try it!
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default FaucetLockingComponentWithMetadata
