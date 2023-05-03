import { useQuery, gql } from "@apollo/client";

import {
    Flex, Center, Heading, Text, Box
} from "@chakra-ui/react";


const QUERY = gql`
    query AssetQuery($tokenPolicyId: Hash28Hex!) {
        transactions(where : { outputs : {tokens : { asset : { policyId : { _eq : $tokenPolicyId }}}} }) {
            includedAt
            outputs {
                address
                tokens {
                    asset {
                        policyId
                        assetName
                    }
                    quantity
                }
            }
        }
    }
`;


export default function HoldersByTx() {
    const policyId = "7b25f909c1d206fafb111c32816e89aeafd92cf830eb8d3423eee8ed"

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            tokenPolicyId: policyId
        }
    });

    // EXAMPLE WITHOUT VARIABLE
    // const { data, loading, error } = useQuery(QUERY);

    if (loading) {
        return (
            <Heading size="lg">Loading data...</Heading>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data...</Heading>
        );
    };

    return (
        <Box m="5" p="5" bg="green.100" border='1px' borderRadius='lg'>
            <Heading size='2xl' py='2'>Speaking of Not So Pretty...</Heading>
            <Text fontSize='xl' py='2'>We would not want to use a layout like this in production. But maybe there is some kind of hint here?</Text>

            <Text p='2'>Made with a <a href="https://graphql-api-iohk-preprod.gimbalabs.io/">GraphQL query, hosted by Dandelion</a>.</Text>
            {data.transactions.map((tx: any) => (<Box m='5' p='5' bg='purple.900' color='white'>{JSON.stringify(tx)}</Box>))}
        </Box>
    )
}
