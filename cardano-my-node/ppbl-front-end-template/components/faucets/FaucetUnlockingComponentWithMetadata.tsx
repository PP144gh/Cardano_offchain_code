import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
    Box, Button, Center, Flex, Heading, Spacer, Spinner, Text,
} from "@chakra-ui/react"
import useWallet from "../../contexts/wallet";
import { Transaction, resolveDataHash, resolvePaymentKeyHash } from '@martifylabs/mesh'
import type { UTxO, Asset, Data, Action } from '@martifylabs/mesh'
// Show how to use these type to check against 3rd party query
// Suggested Exploration + Doc-Writing: Review other Types
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


const FaucetUnlockingComponentWithMetadata: React.FC<Props> = ({ faucetInstance }) => {

    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [faucetBalance, setFaucetBalance] = useState<number>(0)
    const [tokensBackToFaucet, setTokensBackToFaucet] = useState<number>(0)
    const [txLoading, setTxLoading] = useState<boolean>(false)
    const [connectedPkh, setConnectedPkh] = useState<string>("")

    // All of the following data is pulled from on-chain metadata:
    const contractAddress = faucetInstance.contractAddress;
    const datum = parseInt(faucetInstance.datumInt);
    const datumHash = resolveDataHash(datum);
    const faucetAssetPolicyId: string = faucetInstance.policyId;
    const faucetTokenName = faucetInstance.tokenName;
    const tokenHex: string = stringToHex(faucetTokenName);
    const faucetAsset: string = faucetAssetPolicyId + tokenHex;
    const withdrawalAmount = faucetInstance.withdrawalAmount;
    // const plutusScript: string = faucetList.filter(asset => asset.address == contractAddress)[0].script;
    // from @IronicMango
    const [plutusScript, setPlutusScript] = useState<string>("")

    let _contract_utxo: UTxO[] = []

    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            contractAddress: contractAddress
        }
    });

    useEffect(() => {
        if (_contract_utxo.length > 0) {
            const _faucetAsset = _contract_utxo[0].output.amount.filter(asset => asset.unit === faucetAsset)
            if (_faucetAsset.length > 0) {
                const _faucetBalance = parseInt(_faucetAsset[0].quantity)
                setFaucetBalance(_faucetBalance)
            }
        }
    }, [_contract_utxo])

    useEffect(() => {
        if (faucetBalance) {
            const withdrawalNumber = parseInt(withdrawalAmount)
            setTokensBackToFaucet(faucetBalance - withdrawalNumber)
        }
    }, [faucetBalance])

    useEffect(() => {
        if (walletConnected) {
            const result = resolvePaymentKeyHash(connectedAddress)
            setConnectedPkh(result)
        }
    }, [walletConnected])

    // from @IronicMango
    useEffect(() => {
        if (faucetList.filter(asset => asset.address == contractAddress)[0] != undefined) {
            const result = faucetList.filter(asset => asset.address == contractAddress)[0].script
            setPlutusScript(result)
        }
    })


    // Todo: Check against registered metadata to get quantity
    const assetsToSender: Asset[] = [
        {
            unit: faucetAsset,
            quantity: withdrawalAmount.toString()
        }
    ]

    const accessTokenToSender: Asset[] = [
        {
            unit: '748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c605050424c53756d6d657232303232',
            quantity: '1'
        }
    ]

    // Todo: this quantity will also a require a dynamic query
    const assetsToContract: Asset[] = [
        {
            unit: faucetAsset,
            quantity: tokensBackToFaucet.toString()
        }
    ]

    // This does not work:
    // const pkhRedeemer: Partial<Action> = {
    //     data: [connectedPkh]
    // }

    // This works:
    // We must include constructor or alternative, because there may be many Redeemers
    const pkhRedeemer: Partial<Action> = {
        data: {
            alternative: 0,
            fields: [connectedPkh]
        }
    }

    const handleUnLockTokens = async () => {

        if (walletConnected) {
            console.log("Redeemer", pkhRedeemer)
            const policyIds = await wallet.getPolicyIds();
            if (policyIds.includes("748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c60")) {
                setTxLoading(true)
                const network = await wallet.getNetworkId()
                if (network == 1) {
                    alert("This example works with Preproduction Testnet only.")
                } else {
                    try {
                        console.log("Build a transaction.")
                        console.log("Connected", connectedAddress)
                        console.log("Contract", contractAddress)
                        console.log("Using Plutus Script", plutusScript)
                        console.log("And Contract UTXO:", _contract_utxo)
                        const tx = new Transaction({ initiator: wallet })
                            .redeemValue(
                                plutusScript,
                                _contract_utxo[0],
                                {
                                    datum: datum,
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
                            ).setRequiredSigners([connectedAddress]);
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
            } else {
                alert("Wallet must contain PPBLSummer2022 token")
            }
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

    // To Do: Change this to handle multi utxos - error does not appear. (Can you see why?)

    if (data) {
        if(data.utxos[0]){
            if (data.utxos[0].tokens[0]) {
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
                        address: contractAddress,
                        amount: _asset_list,
                        dataHash: datumHash
                    }
                }]
            } else {
                const _asset_list: Asset[] = [
                    {
                        unit: "lovelace",
                        quantity: data.utxos[0].value
                    }
                ]
                _contract_utxo = [{
                    input: {
                        outputIndex: data.utxos[0].index,
                        txHash: data.utxos[0].txHash
                    },
                    output: {
                        address: contractAddress,
                        amount: _asset_list,
                        dataHash: datumHash
                    }
                }]
            }
        } else {
            _contract_utxo = []
        }
    }

    return (
        <Box width="50%" m='5' p='5' bg='white' color='black' border='1px' borderRadius='lg'>
            <Heading size='lg' py='2'>
                Unlock {withdrawalAmount} {faucetTokenName} tokens
            </Heading>
            <Heading size='sm'>Your PKH: {connectedPkh}</Heading>
            <Heading size='sm'>UTxOs: {data.utxos.length}</Heading>
            {data.utxos.length == 1 ? (
                <Center my='3' p='2' bg='green.200' color='black'>
                    <Text fontSize='sm'>
                        This is a well-managed Contract Address, with exactly 1 UTxO
                    </Text>
                </Center>
            ) : (
                <Center my='3' p='2' bg='red.200' color='black'>
                    <Text fontSize='sm'>
                        Whoops! This Contract Address has {data.utxos.length} UTxOs, which may lead to some unexpected behavior.
                    </Text>
                </Center>
            )}
            {faucetBalance > 0 ? (
                <Box>
                    <Text py='2'>
                        Contract Address: {contractAddress}
                    </Text>
                    <Text py='2'>
                        Datum Value: {datum}
                    </Text>
                    <Text py='2'>
                        Datum Hash: {datumHash}
                    </Text>
                    <Center my='2' p='2' bg='green.200' color='black'>
                        Current Faucet Balance: {faucetBalance}
                    </Center>
                    <Center my='2' p='2' bg='green.200' color='black'>
                        This Tx will return {tokensBackToFaucet} {faucetTokenName} to the faucet.
                    </Center>
                    <Button my='2' colorScheme='purple' onClick={handleUnLockTokens}>Unlock {withdrawalAmount} {faucetTokenName} Tokens!</Button>
                    {txLoading ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : (
                        <Center m='2' p='2' bg='purple.200' color='black'>
                            {successfulTxHash ? (
                                <Text fontSize='sm'>
                                    Withdrawal Tx Submitted! TxHash: {successfulTxHash}
                                </Text>
                            ) : (
                                <Text fontSize='sm'>
                                    Press the button to build and submit an unlocking transaction.
                                </Text>
                            )}
                        </Center>
                    )}
                </Box>

            ) : (
                <Box>
                    <Text>There are currently no {faucetTokenName} tokens locked at {contractAddress}</Text>
                </Box>
            )}


        </Box>
    );
}

export default FaucetUnlockingComponentWithMetadata