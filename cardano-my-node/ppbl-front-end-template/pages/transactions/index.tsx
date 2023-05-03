import {
    Box, Heading, Text, Center, Spinner, Grid, Spacer, GridItem
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import useWallet from '../../contexts/wallet';

import ConnectWallet from '../../components/wallet/connectWallet';
import DonateButton from '../../components/transactions/donateButton';
import DonateForm from '../../components/transactions/donateForm';
import TransactionTemplate from '../../components/transactions/transactionTemplate';
import QuickSendToken from '../../components/transactions/quickSendToken';
import StudentContributions from '../../components/transactions/StudentContributions';

const TransactionsPage: NextPage = () => {
    const { connecting, walletNameConnected, connectWallet, walletConnected, wallet, connectedAddress } = useWallet();
    const [assets, setAssets] = useState({})
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            const _assets = await wallet.getAssets();
            setAssets(_assets);
        }

        if (walletConnected) {
            fetchAssets();
            setLoading(false);
        }
    }, [walletConnected])


    return (
        <Box>
            <Heading variant='page-heading'>
                Basic Transactions
            </Heading>
            <Heading size='lg' py='3'>
                Each example is a unique Component, imported from <pre>/src/components/transactions</pre>
            </Heading>

            {(loading || connecting || connectedAddress.length === 0) ? (
                <Box w="50%" mx="auto" p='4' bg='purple.200'>
                    <Center>
                        <Spacer />
                        <Text>Waiting to Connect Wallet</Text>
                        <Spacer />
                        <Spinner />
                        <Spacer />
                    </Center>
                </Box>
            ) : (
                <Box p='4' bg='purple.200'>
                    <Text>
                        Connected to {connectedAddress} with {walletNameConnected}.
                    </Text>
                </Box>
            )}

            <Grid templateColumns='repeat(4, 1fr)' gap='5' mt='10'>
                <GridItem colSpan={4}>
                    <DonateButton />
                </GridItem>
                <GridItem colSpan={2}>
                    <DonateForm />
                </GridItem>
                <GridItem colSpan={2}>
                    <QuickSendToken />
                </GridItem>
            </Grid>
            <Box my='5' border='1px' bg='black' />
            <StudentContributions />
        </Box>
    )
}

export default TransactionsPage
