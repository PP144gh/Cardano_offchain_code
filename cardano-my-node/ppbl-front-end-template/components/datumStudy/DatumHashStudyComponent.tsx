import { useEffect, useState } from "react";
import {
    Box, Button, Center, Flex, Heading, Spacer, Spinner, Text,
} from "@chakra-ui/react"
import useWallet from "../../contexts/wallet";
import { Transaction, resolveDataHash, resolveKeyHash } from '@martifylabs/mesh'
import type { UTxO, Asset, Data, Action } from '@martifylabs/mesh'
import { stringToHex } from "../../cardano/utils";

export default function DatumHashStudyComponent() {

    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [faucetBalance, setFaucetBalance] = useState<number>(0)
    const [tokensBackToFaucet, setTokensBackToFaucet] = useState<number>(0)
    const [txLoading, setTxLoading] = useState<boolean>(false)
    const [connectedPkh, setConnectedPkh] = useState<string>("")

    // String
    // must be converted to bytestring on ccli.
    const datumString: Data = "welcome to ppbl"
    const datumStringHash = resolveDataHash(datumString)

    // Number
    const datumNumber: Data = 1618
    const datumNumberHash = resolveDataHash(datumNumber)

    // Array
    const datumList: Data = [1618, 101];
    const datumListContstructor: Data = {
        alternative: 0,
        fields: [1618, 101]
    }
    const datumListHash = resolveDataHash(datumList);
    const datumListConstructorHash = resolveDataHash(datumList);


    // Map

    // GBTE
    // If I just add 5 fields, do I get the datumHash from ccli?
    // If it doesn't work, make it more like Redeemer in FaucetUnlockingComponentWithMetadata.
    const bountyDatum: Data = {
        alternative: 0,
        fields: [
            "65295d6feacfc33fe029f51785770d92373e82cde28c3cd8c55a3cd1",
            "c1d812436253485ac6226a55e93903e85f64c613b9e83602f9ca3d56",
            4000000,
            200,
            1666472190776
        ]
    }
    const  bountyDatumHash = resolveDataHash(bountyDatum);

    const treasuryDatum: Data = {
        alternative: 0,
        fields: [
            1,
            "65295d6feacfc33fe029f51785770d92373e82cde28c3cd8c55a3cd1"
        ]
    }

    const treasuryDatumHash = resolveDataHash(treasuryDatum)


    return (
        <Box m='5' p='5' bg='white' color='black' border='1px' borderRadius='lg'>
            <Heading size='lg' py='2'>
                Datum Study
            </Heading>
            <Box m='2' p='5' bg='gray.300'>
                <Heading size='lg'>String</Heading>
                <Heading size='md' py='2'>If our datum is a simple string:</Heading>
                <Text py='1'>{datumString}</Text>
                <Heading size='md' py='2'>Mesh Result:</Heading>
                <Text py='1'>Using:</Text>
                <pre>
                    const datumString: Data = "welcome to ppbl"
                </pre>
                <pre>
                    const datumStringHash = resolveDataHash(datumString)
                </pre>
                <Text py='1'>Results in the datum hash:</Text>
                <pre>{datumStringHash}</pre>
                <Heading size='md' py='2'>cardano-cli Result:</Heading>
                <Text py='1'>Input:</Text>
                <pre>cardano-cli transaction hash-script-data --script-data-value "\"welcome to ppbl\""</pre>
                <Text py='1'>Output:</Text>
                <pre>e583b381e5bb5e64a411ad3318c5fcca9519541847d19eb0eaaf9f4db9d50aca</pre>
            </Box>
            <Box m='2' p='5' bg='gray.300'>
                <Heading size='lg'>Number</Heading>
                <Heading size='md' py='2'>If our datum is a simple number:</Heading>
                <Text py='1'>{datumNumber}</Text>
                <Heading size='md' py='2'>Mesh Result:</Heading>
                <Text py='1'>Using:</Text>
                <pre>
                    const datumNumber: Data = 1618
                </pre>
                <pre>
                    const datumNumberHash = resolveDataHash(datumNumber)
                </pre>
                <Text py='1'>Results in the datum hash:</Text>
                <pre>{datumNumberHash}</pre>
                <Heading size='md' py='2'>cardano-cli Result:</Heading>
                <Text py='1'>Input:</Text>
                <pre>cardano-cli transaction hash-script-data --script-data-value 1618</pre>
                <Text py='1'>Output:</Text>
                <pre>2da1c63e7646ce8cc514113c66e9cefb79e482210ad1dadb51c2a17ab14cf114</pre>
            </Box>
            <Box m='2' p='5' bg='gray.300'>
                <Heading size='lg'>Array</Heading>
                <Heading size='md' py='2'>If our datum is an Array like this:</Heading>
                <Text py='1'>{JSON.stringify(datumList)}</Text>
                <Heading size='md' py='2'>Mesh Result:</Heading>
                <Text py='1'>Using:</Text>
                <pre>
                    const datumList: Data = [1618, 101];
                </pre>
                <pre>
                    const datumListHash = resolveDataHash(datumList);
                </pre>

                <Text py='1'>Results in the datum hash:</Text>
                <pre>{datumListHash}</pre>
                <Text py='1'>Results in the datum constructor hash:</Text>
                <pre>{datumListConstructorHash}</pre>
                <Heading size='md' py='2'>cardano-cli Result:</Heading>
                <Text py='1'>Input:</Text>
                <pre>cardano-cli transaction hash-script-data --script-data-value "[1618, 101]"</pre>
                <Text py='1'>Output:</Text>
                <pre>c1d6c9f4ac35bf1245da5b554a7832fe02c9ee5603aecfd1eaacd57d7fe967e0</pre>
                <Heading size='md' py='2'>Or Using script-data-file:</Heading>
                <Text py='1'>Input:</Text>
                <pre>cardano-cli transaction hash-script-data --script-data-file</pre>
                <Text py='1'>Output:</Text>
                <pre></pre>
            </Box>
            <Box m='2' p='5' bg='gray.300'>
                <Heading size='lg'>Map</Heading>
                <Heading size='md' py='2'>Mesh Result:</Heading>
                <Heading size='md' py='2'>cardano-cli Result:</Heading>
            </Box>
            <Box m='2' p='5' bg='gray.300'>
                <Heading size='lg'>GBTE Bounty Datum</Heading>
                <Heading size='md' py='2'>Mesh Result:</Heading>
                <pre>Bounty Datum Hash: {bountyDatumHash}</pre>
                <pre>Treasury Datum Hash: {treasuryDatumHash}</pre>
                <Heading size='md' py='2'>cardano-cli Result:</Heading>
            </Box>
        </Box>
    );
}
