import { useQuery, gql } from "@apollo/client";

import {
    Flex, Center, Heading, Text, Box, Link
} from "@chakra-ui/react";
import { mkdirSync } from "fs";



// ------------------------------------------------------------------------
// Module 302, Mastery Assignment #3
//
// STEP 1: Replace this GraphQL query with a new one that you write.
//
// Need some ideas? We will brainstorm at Live Coding.
// ------------------------------------------------------------------------
const QUERY = gql`
    query BlockInfo {
        epochs(order_by: { number: desc }, limit: 1) {
            number
            transactionsCount
            startedAt
            fees
            blocksCount
            blocks(
                order_by: { slotNo: desc }
            ) {
                slotNo
                slotInEpoch
            }
        }
    }
`;

export default function Mastery302dot3IronicMango() {

    var epochNum = ""
    var totalTXNum = ""
    var totalFees = ""
    const totalSlots = 432000
    var currentSlot = 0
    var remainingTime = 0
    var days = 0
    var hours = 0
    var minutes = 0
    var smartDay = ""
    var smartHour = ""
    var smartMinute = ""

    const { data, loading, error } = useQuery(QUERY);

    if (loading) {
        return (
            <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
                <Heading py='2' size='md'>Ironic Mango Mastery Assignment 302.3</Heading>
                <Text p='1' fontWeight='bold'>Loading Data...</Text>
            </Box>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
                <Heading py='2' size='md'>Ironic Mango Mastery Assignment 302.3</Heading>
                <Text p='1' fontWeight='bold'>Error Loading Data...</Text>
            </Box>
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

    if (data) {
        epochNum = data.epochs[0].number
        totalTXNum = data.epochs[0].transactionsCount
        totalFees = data.epochs[0].fees
        currentSlot = parseInt(data.epochs[0].blocks[0].slotInEpoch)
        remainingTime = totalSlots - currentSlot
        days = Math.floor(remainingTime / 86400)
        hours = Math.floor((remainingTime - (days * 86400)) / 3600)
        minutes = Math.floor(((remainingTime - (days * 86400) - (hours * 3600)) / 60))
        if (days == 1) {
            smartDay = "Day"
        } else {
            smartDay = "Days"
        }
        if (hours == 1) {
            smartHour = "Hour"
        } else {
            smartHour = "Hours"
        }
        if (minutes == 1) {
            smartMinute = "Minute"
        } else {
            smartMinute = "Minutes"
        }


    }
    return (
        <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
            <Heading py='2' size='md'>Ironic Mango Mastery Assignment 302.3</Heading>
            <Text p='1' fontWeight='bold'>Current Epoch: {epochNum}</Text>
            <Text p='1'>There have been {totalTXNum} transactions, generating {totalFees} lovelace of fees.</Text>
            <Box p="3" bg="purple.500" border='1px' borderRadius
                ='lg' >
                <Text p='1' color='white' fontWeight={'bold'} align='center'>{days} {smartDay}, {hours} {smartHour}, and {minutes} {smartMinute} remaining </Text>
            </Box>
        </Box>
    )

}
