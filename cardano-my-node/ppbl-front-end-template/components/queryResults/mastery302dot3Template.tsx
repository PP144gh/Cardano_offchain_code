import { useQuery, gql } from "@apollo/client";

import {
    Flex, Center, Heading, Text, Box, Link
} from "@chakra-ui/react";

// ------------------------------------------------------------------------
// Module 302, Mastery Assignment #3
//
// STEP 1: Replace this GraphQL query with a new one that you write.
//
// Need some ideas? We will brainstorm at Live Coding.
// ------------------------------------------------------------------------
const QUERY = gql`
    query LastTxAtAddress($address: String){
        transactions(where : {outputs : {address : {_eq : $address}}}, order_by : {includedAt : desc}, limit: 1){
                includedAt
                hash
                inputs {
                    address
                }
                outputs {
                    address
                }
            }
        }
`;

export default function Mastery302dot3Template() {

    const queryAddress = "addr_test1wpenjjl2ea22r0vlcm9m3hy9heafwpt3grmty0qfx4r0nrglkg0pk"

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            address: queryAddress
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

    // ------------------------------------------------------------------------
    // Module 302, Mastery Assignment #3
    //
    // STEP 2: Style your query results here.
    //
    // This template is designed be a simple example - add as much custom
    // styling as you want!
    // ------------------------------------------------------------------------

    return (
        <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
            <Heading py='2' size='md'>This is a Template for Mastery Assignment 302.3</Heading>
            <Text p='1' fontWeight='bold'>What was the transaction with output(s) to {queryAddress}?</Text>
            <Text p='1'>It was Tx: {data.transactions[0].hash}</Text>
            <Text p='1'>Date: {data.transactions[0].includedAt}</Text>
            <Text p='1'>Number Inputs: {data.transactions[0].inputs.length} -- Number Outputs: {data.transactions[0].outputs.length}</Text>
        </Box>
    )
}
