import Link from 'next/link'
import { Box, Heading, Flex, Spacer, Text, List, ListItem, ListIcon, UnorderedList, Link as ChakraLink } from '@chakra-ui/react'

export default function WelcomeComponent() {
    return (
        <Box>
            <Heading variant='my-variant' size='2xl'>Plutus PBL Front-End Template</Heading>
            <Heading py='3' size='lg'>A companion repo to the Plutus Project-Based Learning course from Gimbalabs</Heading>
            <Text py='2' fontSize='lg'>
                <ChakraLink href="https://gimbalabs.instructure.com/enroll/3CFNFB">You can sign up for the course on Canvas</ChakraLink>, or if you are already enrolled, <ChakraLink href="https://gimbalabs.instructure.com/courses/26">view the course here</ChakraLink>.
            </Text>
            <Heading py='3' size='lg'>Works with Cardano Pre-Production Testnet</Heading>
            <Text py='2' fontSize='lg'>
                This project works with Pre-Production out of the box, and it only takes a few steps to re-configure it for other Cardano networks, like Preview or Mainnet.
            </Text>
            <Heading py='3' size='lg'>Recommended: Eternl Wallet on Pre-Production</Heading>
            <Text py='2' fontSize='lg'>
                As of September 12, 2022, we are using Pre-Production Testnet in the PPBL course. This might change in the future, and this project will be updated. <ChakraLink href="https://ccvault.io/app/preprod/welcome">Create a Preduction wallet with Eternl</ChakraLink>, and review <ChakraLink href="https://youtu.be/-1cHXM97N48">our update on Cardano networks</ChakraLink> to learn more.
            </Text>
        </Box>
    )
}