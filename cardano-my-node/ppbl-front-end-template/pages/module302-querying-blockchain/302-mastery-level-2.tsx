import { Box, Heading, Text, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import type { NextPage } from "next";
import HoldersByAssetID from '../../components/queryResults/holdersByAssetID';
import HoldersByTx from '../../components/queryResults/holdersByTx';

const Module302MasteryLevel2: NextPage = () => {
    return (
        <Box>
            <Heading>Module 302: Mastery Level 2</Heading>
            {/* ----------------------------------------------------------------------
                Module 302, Mastery Assignment #2
                To get started, open /components/queryResults/holdersByAssetID.tsx
            -----------------------------------------------------------------------*/}
            <HoldersByAssetID />
            <HoldersByTx />
        </Box>

    )
}

export default Module302MasteryLevel2