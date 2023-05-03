import Link from 'next/link'
import { Flex, Spacer, Text } from '@chakra-ui/react'
import { ImBooks } from 'react-icons/im'

export default function Nav() {
  return (
    <Flex direction="row" w="100%" p="5" bg="gray.900" color='white'>
      <Text fontWeight='900' fontSize='xl'>
        <Link href="/">
          <ImBooks />
        </Link>
      </Text>
      <Spacer />
      <Text fontWeight='900'>
        <Link href="/module202">Module 202: Introduction</Link>
      </Text>
      <Spacer />
      <Text fontWeight='900'>
        <Link href="/module301-faucets">Module 301: PPBL Faucet Mini-Project</Link>
      </Text>
      <Spacer />
      <Text fontWeight='900'>
        <Link href="/transactions">Module 301/302: Basic Transactions</Link>
      </Text>
      <Spacer />
      <Text fontWeight='900'>
        <Link href="/module302-querying-blockchain">Module 302: Blockchain Queries</Link>
      </Text>
    </Flex>
  )
}