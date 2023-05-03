import {
  Box, Heading, Text, Spinner, Center, Link as ChakraLink, Grid, GridItem
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import Link from 'next/link';
import type { NextPage } from "next";
import useWallet from '../../contexts/wallet';
import FaucetUnlockingComponent from '../../components/faucets/FaucetUnlockingComponent';
import FaucetMetadataRegistration from '../../components/faucets/FaucetMetadataRegistration';

const Faucets: NextPage = () => {
  const { walletNameConnected, walletConnected, wallet, connectedAddress } = useWallet();

  const [currentNetwork, setCurrentNetwork] = useState<"Testnet" | "Mainnet" | "Not Connected">("Not Connected");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    const fetchNetwork = async () => {
      const _network = await wallet.getNetworkId();
      if (_network === 0) {
        setCurrentNetwork("Testnet")
      }
      else if (_network === 1) {
        setCurrentNetwork("Mainnet")
      }
      setLoading(false);
    }

    if (walletConnected) {
      setLoading(true);
      fetchNetwork();
    }

  }, [walletConnected])

  return (
    <Box>
      <Heading variant='page-heading'>
        Module 301 - PPBL Faucets Mini-Project
      </Heading>
      <Grid templateColumns='repeat(3, 1fr)' gap='1'>
        <GridItem bg='purple.100' p='5' _hover={{bg: 'green.100'}}>
          <Center>
            <Heading size='sm'>
              <ChakraLink href="https://gimbalabs.instructure.com/courses/26/pages/301-project-overview">View this project on Canvas</ChakraLink>
            </Heading>
          </Center>
        </GridItem>
        <GridItem bg='purple.100' p='5' _hover={{bg: 'green.100'}}>
          <Center>
            <Heading size='sm'>
              <ChakraLink href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-course-02/-/tree/master/project-301-faucet">View this Project on GitLab</ChakraLink>
            </Heading>
          </Center>
        </GridItem>
        <GridItem bg='purple.100' p='5' _hover={{bg: 'green.100'}}>
          <Center>
            <Heading size='sm'>
              <Link href="/module301-faucets/registered-faucets"><ChakraLink>Check out the current list of all PPBL Student Faucets!</ChakraLink></Link>
            </Heading>
          </Center>
        </GridItem>
      </Grid>
      {loading ? (
        <Box my='5' p='5' bg='yellow.100' color='black'>
          <Center>
            <Spinner />
          </Center>
        </Box>
      ) : (
        <>
          {walletConnected ?
            (
              <Box my='5' p='5' bg='green.100' color='black'>
                <Text fontSize='xl'>You are connected to {walletNameConnected} wallet on {currentNetwork} at address: {connectedAddress}</Text>
              </Box>
            ) : (
              <Box my='5' p='5' bg='red.100' color='black'>
                <Text fontSize='xl'>No wallet is connected yet. Make sure to connect by clicking the button in the Footer.</Text>
              </Box>
            )
          }
        </>
      )}
      <FaucetUnlockingComponent />
      <FaucetMetadataRegistration />
    </Box>
  )
}

export default Faucets
