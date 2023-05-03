import { useQuery, gql } from "@apollo/client";

import {
    Flex, Center, Heading, Text, Box, Link
} from "@chakra-ui/react";

const QUERY = gql`
    query MintingTx($policyId: Hash28Hex!){
        transactions(where : {mint : { asset : { policyId : {_eq : $policyId}}}}) {
            includedAt
            mint {
                asset {
                    policyId
                    assetName
                    name
                }
                quantity
            }
            outputs {
                txHash
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
    }
`;

export default function Mastery302dot1Template() {
    // ------------------------------------------------------------------------
    // Module 302, Mastery Assignment #1
    // STEP 1: Change this policyId to match a token that you minted:
    // Note: This Query will work only with tokens minted on Pre-Production.
    // ------------------------------------------------------------------------
    const policyId = "748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c60"

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            policyId: policyId
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
            <Heading py='2'>This is a Template for Mastery Assignment 302.1</Heading>
            <Heading size='md' py='5'>Here are the raw results of a GraphQL Query. What story does this data tell?</Heading>
            {/* ------------------------------------------------------------------------
                Module 302, Mastery Assignment #1
                STEP 2: Replace pre-formatted JSON data with a component that
                uses the data.
            ------------------------------------------------------------------------ */}
            <Box bg='white' p='5'>
                <pre>
                    <code className="language-js">{JSON.stringify(data, null, 2)}</code>
                </pre>
            </Box>
            {/* Feel free to delete this Text as well: */}
            <Text px='10' pt='5' fontSize='xl'>
                Do you think that these results are user friendly? Yeah, neither do we! So this is your assignment: take this raw data and use the <Link href="https://chakra-ui.com/docs/components/box/usage">Box</Link>, <Link href="https://chakra-ui.com/docs/components/heading/usage">Heading</Link>, and <Link href="https://chakra-ui.com/docs/components/text/usage">Text</Link> components from <Link href="https://chakra-ui.com/">ChakraUI</Link> to make it look better.
            </Text>
            <Text px='10' pt='5' fontSize='xl'>
                You do not have to use all of the data returned by the query. Just pick the parts you think are interesting, and redesign this Component for a more mainstream audience.
            </Text>
            <Text px='10' pt='5' fontSize='xl'>
                You can also go as deep into the Chakra documentation as you choose. If there are other components besides Box, Heading, and Text that are helpful to you - try using them! If you have been wondering about how colors and fonts work in ChakraUI, this is a great chance to study those. If you are wondering where to start, read up on <Link href="https://chakra-ui.com/docs/styled-system/style-props">Style Props</Link>.
            </Text>
        </Box>
    )
}
