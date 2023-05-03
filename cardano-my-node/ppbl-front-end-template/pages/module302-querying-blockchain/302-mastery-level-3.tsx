import { Box, Heading, Text, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import type { NextPage } from "next";
import Mastery302dot3Template from '../../components/queryResults/mastery302dot3Template';
import Mastery302dot3Sourabh from '../../components/queryResults/mastery302dot3Sourabh';
import Mastery302dot3IronicMango from '../../components/queryResults/mastery302dot3IronicMango';
import Mastery302dot3Uli from '../../components/queryResults/mastery302dot3Uli';
import Mastery302dot3nelsonksh from '../../components/queryResults/mastery302dot3nelsonksh';
import Mastery302dot3HugoOjeda from '../../components/queryResults/mastery302dot3HugoOjeda';
import Mastery302dot3Hari from '../../components/queryResults/mastery302dot3Hari';

const Module302MasteryLevel3: NextPage = () => {
    return (
        <Box>
            <Heading>Module 302: Mastery Level 3 - Contribute to Component Library</Heading>
            <Text pt='5'>Now that you have tried a few things, it is time to get creative.</Text>
            <Text pt='5'>Your Assignment is to contribute a Passive query component to the collection of Components below.</Text>
            <Heading pt='5'>PPBL Summer 2022 Component Library</Heading>
            <Text pt='5'>To help you get the idea for where we are going, the same Component is repeated four times below. When PPBL students start to contribute new Components, this page will be updated to show one of each.</Text>
            <Grid pt='5' templateColumns='repeat(2, 1fr)' gap='5'>
                <Mastery302dot3Template />
                <Mastery302dot3Sourabh />
                <Mastery302dot3IronicMango />
                <Mastery302dot3Uli />
                <Mastery302dot3nelsonksh />
                <Mastery302dot3HugoOjeda />
                <Mastery302dot3Hari />
            </Grid>

        </Box>

    )
}

export default Module302MasteryLevel3