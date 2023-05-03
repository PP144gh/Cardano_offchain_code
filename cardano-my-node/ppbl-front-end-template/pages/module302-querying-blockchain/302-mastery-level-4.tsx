import { Box, Heading, Text, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import type { NextPage } from "next";
import StudentContributions from '../../components/transactions/StudentContributions';

const Module302MasteryLevel4: NextPage = () => {
    return (
        <Box>
            <Heading>Module 302: Mastery Level 4</Heading>
            <Text pt='5'>In the previous Mastery Assignment (302.3), you created a Passive Blockchain Query Component. The Component was Passive because it only renders blockchain data to the web page - there is no user interaction.</Text>
            <Text pt='5'>Now your Assignment is to build an interactive Component that builds, signs, and submits a transaction.</Text>
            <StudentContributions />
        </Box>

    )
}

export default Module302MasteryLevel4