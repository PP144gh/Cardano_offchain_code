import { Box, Heading, Text, Grid, GridItem, Link as ChakraLink } from '@chakra-ui/react'
import type { NextPage } from "next";
import Head from 'next/head'
import Link from 'next/link'
import HoldersByAssetID from '../../components/queryResults/holdersByAssetID';
import HoldersByTx from '../../components/queryResults/holdersByTx';
import MetadataExampleQuery from '../../components/queryResults/metadataExampleQuery';

const Module302: NextPage = () => {
    return (
        <Box>
            <Heading py='3'>Module 302: Querying the Blockchain</Heading>
            <Text py='3' fontSize='xl'>
                This Module is all about writing queries to get information from the Cardano blockchain. Because data is only useful if we DO something with it, it will also be necessary to investigate Javascript and front-end design to help us use the data.
            </Text>
            <Text p='3' fontSize='xl'>
                <Link href="/module302-querying-blockchain/302-mastery-level-1">
                    <ChakraLink>
                        Mastery Level 1: Customize and Style a Query
                    </ChakraLink>
                </Link>
                &nbsp;
                <Link href="https://gimbalabs.instructure.com/courses/26/assignments/465">
                    <ChakraLink color='purple.700'>
                        (View on Canvas)
                    </ChakraLink>
                </Link>
            </Text>
            <Text p='3' fontSize='xl'>
                <Link href="/module302-querying-blockchain/302-mastery-level-2">
                    <ChakraLink>
                        Mastery Level 2: Rewrite a Koios Query with GraphQL
                    </ChakraLink>
                </Link>
                &nbsp;
                <Link href="https://gimbalabs.instructure.com/courses/26/assignments/466">
                    <ChakraLink color='purple.700'>
                        (View on Canvas)
                    </ChakraLink>
                </Link>
            </Text>
            <Text p='3' fontSize='xl'>
                <Link href="/module302-querying-blockchain/302-mastery-level-3">
                    <ChakraLink>
                        Mastery Level 3: Create a Passive Component
                    </ChakraLink>
                </Link>
                &nbsp;
                <Link href="https://gimbalabs.instructure.com/courses/26/assignments/467">
                    <ChakraLink color='purple.700'>
                        (View on Canvas)
                    </ChakraLink>
                </Link>
            </Text>
            <Text p='3' fontSize='xl'>
                <Link href="/module302-querying-blockchain/302-mastery-level-4">
                    <ChakraLink>
                        Mastery Level 4: Create a Transaction Component
                    </ChakraLink>
                </Link>
                &nbsp;
                <Link href="https://gimbalabs.instructure.com/courses/26/assignments/468">
                    <ChakraLink color='purple.700'>
                        (View on Canvas)
                    </ChakraLink>
                </Link>
            </Text>

            <Heading py='5'>Some (Not-So-Pretty) Examples</Heading>
            <MetadataExampleQuery />
            {/* <HoldersByAssetID /> */}
            <HoldersByTx />
        </Box>

    )
}

export default Module302