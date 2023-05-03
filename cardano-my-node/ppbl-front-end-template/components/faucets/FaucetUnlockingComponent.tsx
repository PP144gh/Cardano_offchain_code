import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
    Box, Button, Center, Heading, Spinner, Text, Link
} from "@chakra-ui/react"
import useWallet from "../../contexts/wallet";
import { Transaction, resolveDataHash, resolvePaymentKeyHash } from '@martifylabs/mesh'
import type { UTxO, Asset, Data, Action } from '@martifylabs/mesh'
// Show how to use these type to check against 3rd party query
// Suggested Exploration + Doc-Writing: Review other Types
import { tgimbal } from "../../cardano/plutus/pre-prod-faucet-tgimbal"

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

export default function FaucetUnlockingComponent() {

    const contractAddress = tgimbal.address
    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [faucetBalance, setFaucetBalance] = useState<number | null>(null)
    const [tokensBackToFaucet, setTokensBackToFaucet] = useState<number>(0)
    const [txLoading, setTxLoading] = useState<boolean>(false)
    const [connectedPkh, setConnectedPkh] = useState<string>("")

    // Check against registered metadata for the following:
    const datum = 1618;
    const datumHash = resolveDataHash(datum);
    const faucetAsset = "fb45417ab92a155da3b31a8928c873eb9fd36c62184c736f189d334c7467696d62616c";
    const faucetTokenName = "tgimbal";
    const withdrawalAmount = 3000;

    let _contract_utxo: UTxO[] = []

    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            contractAddress: tgimbal.address
        }
    });

    useEffect(() => {
        if (_contract_utxo.length > 0) {
            const _faucetAsset = _contract_utxo[0].output.amount.filter(asset => asset.unit === faucetAsset)
            const _faucetBalance = parseInt(_faucetAsset[0].quantity)
            setFaucetBalance(_faucetBalance)
        }
    }, [_contract_utxo])

    useEffect(() => {
        if (faucetBalance) {
            setTokensBackToFaucet(faucetBalance - withdrawalAmount)
        }
    }, [faucetBalance])

    useEffect(() => {
        if (walletConnected) {
            const result = resolvePaymentKeyHash(connectedAddress)
            setConnectedPkh(result)
        }
    }, [walletConnected])


    // Todo: Check against registered metadata to get quantity
    const assetsToSender: Asset[] = [
        {
            unit: "lovelace",
            quantity: "2000000"
        },
        {
            unit: faucetAsset,
            quantity: withdrawalAmount.toString()
        }
    ]

    const accessTokenToSender: Asset[] = [
        {
            unit: "lovelace",
            quantity: "2000000"
        },
        {
            unit: '748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c605050424c53756d6d657232303232',
            quantity: '1'
        }
    ]

    // Todo: this quantity will also a require a dynamic query
    const assetsToContract: Asset[] = [
        {
            unit: "lovelace",
            quantity: "2000000"
        },
        {
            unit: faucetAsset,
            quantity: tokensBackToFaucet.toString()
        }
    ]

    const pkhRedeemer: Partial<Action> = {
        data: [connectedPkh],
        index: 0
    }

    const handleUnLockTokens = async () => {

        if (walletConnected) {
            setTxLoading(true)
            const network = await wallet.getNetworkId()
            if (network == 1) {
                alert("This example works with Preproduction Testnet only.")
            } else {
                try {
                    console.log("Build a transaction.")
                    console.log("Connected", connectedAddress)
                    console.log("Contract", contractAddress)
                    const tx = new Transaction({
                        initiator: wallet
                    })
                        .redeemValue(
                            tgimbal.script,
                            _contract_utxo[0],
                            {
                                datum,
                                redeemer: pkhRedeemer
                            },
                        ).sendAssets(
                            connectedAddress,
                            assetsToSender
                        ).sendAssets(
                            connectedAddress,
                            accessTokenToSender
                        ).sendAssets(
                            contractAddress,
                            assetsToContract,
                            { datum: datum }
                        );
                    console.log("so far so good!")
                    const unsignedTx = await tx.build();

                    // required-signer is taken care of by Mesh
                    // try this without PartialSigned true to see what happens.
                    const signedTx = await wallet.signTx(unsignedTx, true);
                    // error reporting?
                    const txHash = await wallet.submitTx(signedTx);
                    setSuccessfulTxHash(txHash)
                } catch (error: any) {
                    if (error.info) {
                        alert(error.info)
                        console.log(error)
                    }
                    else {
                        alert(error)
                        console.log(error)
                    }
                }
            }
            setTxLoading(false)
        }
        else {
            alert("please connect a wallet")
        }
    }

    if (loading) return (
        <Text>{JSON.stringify(loading)}</Text>
    )

    if (error) return (
        <Text>{JSON.stringify(error)}</Text>
    )


    if (data) {
        const _asset_list: Asset[] = [
            {
                unit: "lovelace",
                quantity: data.utxos[0].value
            },
            {
                unit: faucetAsset,
                quantity: data.utxos[0].tokens[0].quantity
            }
        ]
        _contract_utxo = [{
            input: {
                outputIndex: data.utxos[0].index,
                txHash: data.utxos[0].txHash
            },
            output: {
                address: tgimbal.address,
                amount: _asset_list,
                dataHash: datumHash
            }
        }]
    }

    return (
        <Box my='5' p='5' bg='purple.50' border='1px' borderRadius='lg' fontSize='lg'>
            <Heading size='3xl' py='2'>
                Example Faucet Unlocking Transaction
            </Heading>
            <Box w='60%' mx='auto' py='5'>
                <Heading size='md'>
                    What this Component does:
                </Heading>
                <Text py='2'>
                    If the connected wallet holds at least one PPBLSummer2022 token, this Component will build, sign, and submit a Transaction that Unlocks {withdrawalAmount} {faucetTokenName} Tokens from the PPBL Faucet at Contract Address {contractAddress}
                </Text>
                <Text py='2'>
                    What you are looking at now is a demo-version of the Faucet Component (/components/faucets/FaucetUnlockingComponent.tsx). This version has hard-coded parameters, a lot of extra explanations, and limited styling. There is another version called FaucetUnlockingComponentWithMetadata.tsx that pulls parameters dynamically from the blockchain, and is a bit more stream-lined.
                </Text>
            </Box>
            <Box p='5' bg='white'>
                <Heading size='md' py='2'>
                    Here is an array of UTxOs at the Contract Address:
                </Heading>
                <pre>
                    <code className="language-js">{JSON.stringify(_contract_utxo, null, 2)}</code>
                </pre>
                <Text py='2'>
                    Two steps take place in <strong>/src/components/faucets/FaucetLockingComponent.tsx</strong>. First a GraphQL query is used to get data from the Contract Address. Then, that data is used to populate a <strong>UTxO</strong> object, <Link href="https://github.com/MartifyLabs/mesh/blob/main/packages/module/src/types/index.ts">as defined in Mesh</Link>.
                </Text>
                <Heading size='md'>
                    About Contract UTxOs:
                </Heading>
                <Text py='2'>
                    If we are managing UTxOs correctly, then there should be just one listed here. (Length of this array: {_contract_utxo.length})
                </Text>
            </Box>
            <Box w='60%' mx='auto' py='5'>
                <Heading size='md'>
                    Note that in a DApp for a mainstream audience, we will want to use the raw data above in the UI. For example, we could display the number of tokens in a Box:
                </Heading>
                <Box my='5' p='5' bg='green.100' border='1px' borderRadius='xl'>
                    <Text py='2'>
                        Current Faucet Balance: {faucetBalance} (The Tx should return {tokensBackToFaucet} tgimbals to the faucet.)
                    </Text>
                </Box>
                <Heading size='md' py='2'>
                    Other Helpful Stuff:
                </Heading>
                <Text py='2'>
                    Datum Hash to be used in the unlocking transaction: {datumHash} - does this match what you expect?
                </Text>
                <Text py='2'>
                    Your Public Key Hash (PKH): {connectedPkh}
                </Text>
                <Button my='2' colorScheme='purple' onClick={handleUnLockTokens}>Unlock {withdrawalAmount} {faucetTokenName} Tokens!</Button>
                {txLoading ? (
                    <Center>
                        <Spinner />
                    </Center>
                ) : (
                    <Box mt='2' p='2' bg='purple.200' color='black'>
                        {successfulTxHash ? (
                            <Text>
                                Transaction Status: Submitted! TxHash: {successfulTxHash}
                            </Text>
                        ) : (
                            <Text>
                                Transaction Status: Not Started
                            </Text>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}