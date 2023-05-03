import {
    Box, Heading, Text, Link as ChakraLink, Spinner, Center, Flex, Spacer, Grid, GridItem
  } from '@chakra-ui/react'
  import { useEffect, useState } from "react";
  import type { NextPage } from "next";
import { resolvePaymentKeyHash } from "@martifylabs/mesh"


  const WorkingWithPubKeyHashPage: NextPage = () => {
    const someAddress = "addr_test1qqn8rtkpj9659w06vxwp20syw4jr38r9hwzz9p2rgwudjfv4cxj9qnxul9xv3rgytj6ln8zcruak8rj6uryfdpy2nnzs2wr0ha"
    const pubKeyHashFromAddress = resolvePaymentKeyHash(someAddress)

    return (
      <Box mt='5'>
        <Heading>
            Working with PubKeyHashes
        </Heading>
        <Text py='2'>For certain transactions, we must derive the PubKeyHash of one or more parties to a transaction. Fortunately, Mesh makes this easy!</Text>
        <Text py='2'>Here is an Address: {someAddress}</Text>
        <Text py='2'>Here is the PKH of that address: {pubKeyHashFromAddress}</Text>
        <Text py='2'>The address is hardcoded into <ChakraLink href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-front-end-template/-/blob/main/pages/utilities/working-with-pubkeyhash/index.tsx">/pages/utilities/working-with-pubkeyhash/index.tsx</ChakraLink></Text>
        <Heading py='5' size='md'>
            Why Does this Matter?
        </Heading>
        <Text py='2'><ChakraLink href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/gbte-front-end">Gimbal Bounty Treasury and Escrow</ChakraLink> provides a good example. The PubKeyHash of a Contributor is required to build the Datum that will be used to unlock a UTxO at the Bounty Escrow Contract.  In the ideal case, we would not need to record this PKH anywhere on chain, because the Commitment Transaction provides that record. We would just need to be able to get the Address of the Contributor, and then derive a PubKeyHash from there.</Text>
        <Text py='2'>The problem is, that give the way GBTE is currently set up, we have not quite acheived the ideal case. This is something we will work on as PPBL participants move from Specializing to Contributing.</Text>
      </Box>


    )
  }

  export default WorkingWithPubKeyHashPage
