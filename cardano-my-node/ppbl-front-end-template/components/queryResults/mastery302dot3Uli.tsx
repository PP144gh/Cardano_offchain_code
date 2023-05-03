import { useQuery, gql } from "@apollo/client";

import {
     Center, Heading, Text, Box, Link, SimpleGrid
} from "@chakra-ui/react";

const QUERY = gql`
query ProtocolParameters {
  epochs(order_by: {number: desc} limit: 1){
    number
    protocolParams{
      a0
      coinsPerUtxoByte
      collateralPercent
      decentralisationParam
      eMax
      extraEntropy
      keyDeposit
      maxBlockBodySize
      maxBlockExMem
      maxBlockExSteps
      maxBlockHeaderSize
      maxCollateralInputs
      maxTxExMem
      maxTxExSteps
      maxTxSize
      maxValSize
      minFeeA
      minFeeB
      minPoolCost
      minUTxOValue
      nOpt
      poolDeposit
      priceMem
      priceStep
      protocolVersion
      rho
      tau
    }
  }
}
`;

export default function Mastery302dot3Uli() {

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY);

    // EXAMPLE WITHOUT VARIABLE
    // const { data, loading, error } = useQuery(QUERY);

    if (loading) {
        return (
            <Heading size="lg">Loading data...</Heading>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data...</Heading>
        );
    };

    // ------------------------------------------------------------------------
    // Module 302, Mastery Assignment #3
    //
    // STEP 2: Style your query results here.
    //
    // This template is designed be a simple example - add as much custom
    // styling as you want!
    // ------------------------------------------------------------------------

    return (
        <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
            <Heading py='2' size='md'>Latest Protocol Parameters</Heading>
            <SimpleGrid columns={2} spacing={2}>
                <Text p='1'>a0: {data.epochs[0].protocolParams.a0}</Text>
                <Text p='1'>coinsPerUtxoByte: {data.epochs[0].protocolParams.coinsPerUtxoByte}</Text>
                <Text p='1'>collateralPercent: {data.epochs[0].protocolParams.collateralPercent}</Text>
                <Text p='1'>decentralisationParam: {data.epochs[0].protocolParams.decentralisationParam}</Text>
                <Text p='1'>eMax: {data.epochs[0].protocolParams.eMax}</Text>
                <Text p='1'>extraEntropy: {JSON.stringify(data.epochs[0].protocolParams.extraEntropy)}</Text>
                <Text p='1'>keyDeposit: {data.epochs[0].protocolParams.keyDeposit}</Text>
                <Text p='1'>maxBlockBodySize: {data.epochs[0].protocolParams.maxBlockBodySize}</Text>
                <Text p='1'>maxBlockExMem: {data.epochs[0].protocolParams.maxBlockExMem}</Text>
                <Text p='1'>maxBlockExSteps: {data.epochs[0].protocolParams.maxBlockExSteps}</Text>
                <Text p='1'>maxBlockHeaderSize: {data.epochs[0].protocolParams.maxBlockHeaderSize}</Text>
                <Text p='1'>maxCollateralInputs: {data.epochs[0].protocolParams.maxCollateralInputs}</Text>
                <Text p='1'>maxTxExMem: {data.epochs[0].protocolParams.maxTxExMem}</Text>
                <Text p='1'>maxTxExSteps: {data.epochs[0].protocolParams.maxTxExSteps}</Text>
                <Text p='1'>maxTxSize: {data.epochs[0].protocolParams.maxTxSize}</Text>
                <Text p='1'>maxValSize: {data.epochs[0].protocolParams.maxValSize}</Text>
                <Text p='1'>minFeeA: {data.epochs[0].protocolParams.minFeeA}</Text>
                <Text p='1'>minFeeB: {data.epochs[0].protocolParams.minFeeB}</Text>
                <Text p='1'>minPoolCost: {data.epochs[0].protocolParams.minPoolCost}</Text>
                <Text p='1'>minUTxOValue: {data.epochs[0].protocolParams.minUTxOValue}</Text>
                <Text p='1'>nOpt: {data.epochs[0].protocolParams.nOpt}</Text>
                <Text p='1'>poolDeposit: {data.epochs[0].protocolParams.poolDeposit}</Text>
                <Text p='1'>priceMem: {data.epochs[0].protocolParams.priceMem}</Text>
                <Text p='1'>priceStep: {data.epochs[0].protocolParams.priceStep}</Text>
                <Text p='1'>protocolVersion: {JSON.stringify(data.epochs[0].protocolParams.protocolVersion)}</Text>
                <Text p='1'>rho: {data.epochs[0].protocolParams.rho}</Text>
                <Text p='1'>tau: {data.epochs[0].protocolParams.tau}</Text>
            </SimpleGrid>
        </Box>
    )
}
