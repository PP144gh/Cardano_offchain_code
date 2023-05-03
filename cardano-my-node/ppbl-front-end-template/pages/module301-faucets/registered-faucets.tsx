import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
    Box, Heading, Text, Spinner, Center, Flex, Spacer, Link
} from '@chakra-ui/react'

import { FaucetMetadataResult } from "../../cardano/Types";
import FaucetUnlockingComponentWithMetadata from "../../components/faucets/FaucetUnlockingComponentWithMetadata";
import FaucetLockingComponentWithMetadata from "../../components/faucets/FaucetLockingComponentWithMetadata";

// 1. Consume data from metadata query
// 2. Use that data to populate placeholder component
// 3. Create a TS type (?) so that we can effectively pass it to Unlocking Component
// 4. Pass info to Unlocking Component

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

// We can add the Tx Hash for any Faucet registration that is wrong (for whatever reason!)
// For example usage, see how metadataResults is filtered below.
const REVOCATIONLIST = [
    "612771643ecc0ef5c71f1ef3679829b35b000134166c0a3da20b826f4fbb797a",
    "c97c94b8e0431b2c0eb46e3fd2e178811359a8d4505b5b2dcb517aa118b90ddf",
    "942f70be8b7c3ec98e76899cf5aef73972b76f082730724fa56b505d25486194",
    "b5497cd76dd965371a8a1f4fcc74b40a79bc9b938a6d3b84e286a398f2b0f2e8",
    "38a7f4e84585038a2d640fc89043a2be2b720d9439056a5ce845e61e80d027ae"
]

export default function RegisteredFaucets() {
    const queryThisMetadataKey: string = "1618033988"
    let metadataResults: FaucetMetadataResult[] = []

    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            metadatakey: queryThisMetadataKey
        }
    });

    if (loading) {
        return (
            <Center p='10'>
                <Spinner size='xl' speed="1.0s" />
            </Center>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data...</Heading>
        );
    };

    // TODO: add a guard for incorrect metadata
    if (data) {
        data.transactions.forEach((tx: any) => {
            const result: FaucetMetadataResult = {
                datumInt: tx.metadata[0].value.datumInt,
                policyId: tx.metadata[0].value.policyId,
                tokenName: tx.metadata[0].value.tokenName,
                contractAddress: tx.metadata[0].value.contractAddress,
                withdrawalAmount: tx.metadata[0].value.withdrawalAmount,
                registrationHash: tx.hash
            }
            metadataResults.push(result)
        })
    }

    return (
        <Box>
            <Heading size='3xl' py='3'>
                List of PPBL Faucets
            </Heading>
            <Heading size='md' py='1'>
                Add Yours! <Link href="https://gimbalabs.instructure.com/courses/26/pages/301-project-overview">Check out Module 301 on Canvas</Link>.
            </Heading>

            {metadataResults.length > 0 ? (
                <Flex direction='column'>
                    {metadataResults.filter(tx => !REVOCATIONLIST.includes(tx.registrationHash)).map((faucetDetails: FaucetMetadataResult, index) =>
                        <Box key={index} my='5' bgGradient='linear(to-tr, blue.400, orange.100)' border='1px' borderRadius='lg'>
                            <Heading pt='4' pr='4' textAlign='right'>{faucetDetails.tokenName} tokens</Heading>
                            <Text pt='4' pr='4' textAlign='right'>Registration Tx: <Link href={`https://preprod.cardanoscan.io/transaction/${faucetDetails.registrationHash}`} target='_blank'>{faucetDetails.registrationHash}</Link></Text>
                            <Flex direction='row' my='2'>
                                <FaucetUnlockingComponentWithMetadata faucetInstance={faucetDetails} />
                                <Spacer />
                                <FaucetLockingComponentWithMetadata faucetInstance={faucetDetails} />
                            </Flex>
                        </Box>
                    )}
                </Flex>
            ) : (
                <Text>
                    No Data!
                </Text>
            )}
        </Box>
    );

}
