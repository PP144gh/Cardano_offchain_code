import { useQuery, gql } from "@apollo/client";
import { Box, Heading, Text, Center, Spinner, Link } from "@chakra-ui/react"

// WITH VARIABLE:
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

export default function MetadataExampleQuery() {
    const queryThisMetadataKey: string = "1618033"

    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            metadatakey: queryThisMetadataKey
        }
    });

    if (loading) {
        return (
            <Center p='10'>
                <Spinner size='xl' speed="1.0s"/>
            </Center>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data...</Heading>
        );
    };

    return (
        <Box m='5' p='5' bg='purple.100' border='1px' borderRadius='lg'>
            <Heading size='lg' py='3'>
                Hello Testnet! Metadata Query Results
            </Heading>
            <Heading size='md' py='1'>
                This is an example response from querying key {queryThisMetadataKey} on Cardano Pre-Production Testnet
            </Heading>
            <Text py='2'>You may have completed <Link href="https://gimbalabs.instructure.com/courses/26/assignments/448">Assignment 203 - Hello Testnet!</Link> on the old Testnet. All GraphQL queries in this project are to Pre-Production, but all we need to change to query a different network is the uri in <Link href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-front-end-template/-/blob/main/apollo-client.ts">apollo-client.ts</Link></Text>
            {data.transactions.map((tx: any | null | undefined) => (
                <Box my='5' px='2' pt='3' pb='5' bg='white' color='black'>
                    <Text>Tx Hash: <a href={`https://testnet.cardanoscan.io/transaction/${tx.hash}`}>{tx.hash}</a></Text>
                    <Text>Tx Date: {tx.includedAt}</Text>
                    <Heading size='md' py='2'>Tx Metadata:</Heading>
                    <Box m='3' p='3' bg='gray.800' color='green.100'>
                        {tx.metadata.map((metadata: any) => (
                            <Text py='1'>
                                key: {JSON.stringify(metadata.key)} value: {JSON.stringify(metadata.value)}
                            </Text>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
