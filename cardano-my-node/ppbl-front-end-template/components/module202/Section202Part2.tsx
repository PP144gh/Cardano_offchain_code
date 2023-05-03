import {
  Box, Heading, Text, Link, Button, Spinner, Center
} from '@chakra-ui/react'
import { useState, useEffect } from "react";
import useWallet from '../../contexts/wallet';

// You can change this policyId to match any token.
// 1. Try changing it to match a token that you minting in Module 201
// 2. Can you get this page to work with a token on Cardano mainnet?

// ----------------------------------------------------------------
// PolicyIds for PPBLSummer2022 Token:
// Pre-Production

const policyId = "748ee66265a1853c6f068f86622e36b0dda8edfa69c689a7dd232c60"
// ----------------------------------------------------------------


export default function Section202Part1() {

  const { connecting, walletNameConnected, connectWallet, walletConnected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any[]>(null);
  const [numberPPBLTokens, setNumberPPBLTokens] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false);

  // Whenever the state of walletConnected changes, this useEffect hook will run
  // Retrieves a list of all assets in a connected wallet.
  useEffect(() => {

    const fetchAssets = async () => {
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }

    if (walletConnected) {
      setLoading(true)
      fetchAssets();
    }
  }, [walletConnected])

  // Whenever the list of assets changes, this useEffect hook will run
  // Looks for any assets matching the policyId variable specified at the top of this file
  useEffect(() => {
    if (assets) {
      let value = 0;
      const result = assets.find((elem: { policyId: string; }) => elem.policyId === policyId);
      if (result) {
        value = result.quantity
      }
      setNumberPPBLTokens(value)
    }
  }, [assets])

  return (
    <Box p='5' mt='5' bg='blue.100' border='1px' borderRadius='lg'>
      <Heading>
        Section 202.2 (<Link href="https://gimbalabs.instructure.com/courses/26/pages/202-dot-2-conditionally-render-a-web-page-with-a-cardano-token">View on Canvas</Link>)
      </Heading>
      <Heading size='lg' pt='3'>
        Do you have the PPBLSummer2022 Token?
      </Heading>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          {numberPPBLTokens > 0 ? (
            <Box my='5' p='5' bg='green.900' color='white'>
              <Text fontSize='xl'>Congratulations! You have {numberPPBLTokens} PPBLSummer2022 Token(s)!</Text>
            </Box>
          ) : (
            <Box my='5' p='5' bg='red.900' color='white'>
              <Text fontSize='xl'>This dapp cannot find a PPBLSummer2022 token. Make sure that your wallet is connected to Testnet and that it contains at least one asset with the Policy ID: {policyId}.</Text>
            </Box>
          )}
        </>
      )}
      <Heading size='md' py='3'>
        Note: this example is built for a Cardano Pre-Production Testnet token, so make sure that your wallet is connected to Pre-Production Testnet.
      </Heading>
    </Box>
  )
}

