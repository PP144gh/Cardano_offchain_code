import Link from 'next/link'
import { Box, Heading, Flex, Spacer, Text, List, ListItem, ListIcon, UnorderedList, Link as ChakraLink } from '@chakra-ui/react'

export default function SiteContents() {
    return (
        <Box bg="orange.50" p='5' border='1px' borderRadius='lg' fontSize='xl'>
            <Heading py='2'>What you will find in this project:</Heading>
            <UnorderedList>
                <ListItem py='1'>Use the navigation bar (above) to access key lesson resources and examples.</ListItem>
                <ListItem py='1'>The footer (below) shows the status of your connected wallet.</ListItem>
                <ListItem py='1'>Here you can find some <Link href="/templates"><ChakraLink>helpful Templates for querying data with NextJS</ChakraLink></Link></ListItem>
                <ListItem py='1'><Link href="/module301-faucets/registered-faucets"><ChakraLink>A whole bunch of Faucets where you can get tokens</ChakraLink></Link> minted by other course participants!</ListItem>
                <ListItem py='1'>Coming Soon: Components from YOU!</ListItem>
                <ListItem py='1'>Examples of <Link href="/utilities/working-with-datum"><ChakraLink>working with Datum</ChakraLink></Link></ListItem>
                <ListItem py='1'>Examples of <Link href="/utilities/working-with-pubkeyhash"><ChakraLink>working with PubKeyHashes</ChakraLink></Link></ListItem>
            </UnorderedList>
        </Box>
    )
}