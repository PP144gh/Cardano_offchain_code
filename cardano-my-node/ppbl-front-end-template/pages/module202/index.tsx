import {
    Box, Heading, Text, Link, Spinner, Center
  } from '@chakra-ui/react'
  import { useEffect, useState } from "react";
  import type { NextPage } from "next";
  import useWallet from '../../contexts/wallet';
  import Section202Part1 from '../../components/module202/Section202Part1';
  import Section202Part2 from '../../components/module202/Section202Part2';
import ViewAllWalletAssets from '../../components/module202/ViewWalletAssets';
  
  const Module202: NextPage = () => {
  
  
    return (
      <Box>
        <Heading variant='page-heading'>PPBL Module 202</Heading>
        <Section202Part1 />
        <Box my='5'>
          <Text fontSize='lg'>
            Note: Above and below are examples of Components. Look at the code for this page in <Link href="">index.tsx</Link>.
          </Text>
        </Box>
        <Section202Part2 />
        <Box my='5'>
          <Text fontSize='lg'>
            Here is an example Component:
          </Text>
        </Box>
        <ViewAllWalletAssets />
      </Box>
  
    )
  }
  
  export default Module202
  