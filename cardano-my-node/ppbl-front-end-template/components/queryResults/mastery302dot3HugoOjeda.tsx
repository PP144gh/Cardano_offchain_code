import { useQuery, gql } from "@apollo/client";
import { MdCastForEducation, MdStar } from "react-icons/md";
import {
    Flex, Center, Heading, Text, Box, Link, Badge, Image
} from "@chakra-ui/react";

// ------------------------------------------------------------------------
// Module 302, Mastery Assignment #3
//
// STEP 1: Replace this GraphQL query with a new one that you write.
//
// Need some ideas? We will brainstorm at Live Coding.
// ------------------------------------------------------------------------
{/*const QUERY = gql`
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
    `;*/}
const QUERY = gql`
    query cardano{
        cardano{
                 currentEpoch{
                               nonce
                               fees
                               output
                               number
                               transactionsCount
                               startedAt
                               lastBlockTime
                           }

                 }

       }
    `;

export default function Mastery302dot3HugoOjeda() {

    //const queryAddress = "addr_test1wpenjjl2ea22r0vlcm9m3hy9heafwpt3grmty0qfx4r0nrglkg0pk"

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            //address: queryAddress
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
            <Heading size="lg"> Error loading data...</Heading>
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

        <><Box p="5" bg="orange.100" maxW="620px" border='1px' borderWidth="1px">
            <Image borderRadius="md" src="https://ipfs.io/ipfs/bafybeihavfh642746oo7hhiklnldu2zv3agc5d7yax7pakxzoykew6kvme/cardano.png" />
            <Flex align="baseline" mt={2}>

                <Text
                    ml={2}
                    textTransform="uppercase"
                    fontSize="sm"
                    fontWeight="bold"
                    color="pink.800"
                >
                    <Badge colorScheme="pink">Cardano &bull; Epoch Block transactions</Badge>

                </Text>
            </Flex>
            <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
                Mastering Assigment 302.3 by Hugo Ojeda #ingHugo
            </Text>

            {/*<Flex mt={2} align="center">*/}
            {/* <Box as={MdStar} color="orange.400" />*/}
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">Nonce: </Badge>
                <b>{data.cardano.currentEpoch.nonce}</b>
            </Text>
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">Fees: </Badge>
                <b> {data.cardano.currentEpoch.fees}</b>
            </Text>
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">Output: </Badge>
                <b>  {data.cardano.currentEpoch.output} </b>
            </Text>
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">TransactionsCount: </Badge>
                <b>{data.cardano.currentEpoch.transactionsCount}</b>
            </Text>
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">Started_At: </Badge>
                <b>  {data.cardano.currentEpoch.startedAt} </b>
            </Text>
            <Text px='1' pt='5' fontSize="sm">
                <Badge colorScheme="pink">LastBlockTime: </Badge>
                <b>{data.cardano.currentEpoch.lastBlockTime}</b>
            </Text>


            {/*</Flex>*/}
        </Box>
            {/*
            <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
                <Heading py='2' size='md'>This is a Template for Mastery Assignment 302.3</Heading>
                <Text p='1' fontWeight='bold'>What was the transaction with output(s) to ?</Text>
                <Text p='1'>It was Tx: {data.cardano.currentEpoch.nonce}</Text>
                <Text p='1'>Date: {data.transactions[0].includedAt}</Text>
                <Text p='1'>Number Inputs: {data.transactions[0].inputs.length} --Number Outputs: {data.transactions[0].outputs.length}</Text>
    </Box> */} </>
    )
}
