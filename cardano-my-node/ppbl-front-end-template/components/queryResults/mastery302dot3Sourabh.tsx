import { useQuery, gql } from "@apollo/client";

import {
    Center, Heading, Text, Box, Button, Spinner, OrderedList, ListItem, Link
} from "@chakra-ui/react";
import { useState } from "react";
import useWallet from "../../contexts/wallet";

const QUERY = gql`
    query LastTxAtAddress($address: String){
        transactions(where : {inputs : {address : {_eq : $address}}}, order_by : {includedAt : desc}, limit: 20) {
                includedAt
                hash
                fee
            }
        }
`;

export default function Mastery302dot3Sourabh() {
    
    const { walletConnected, wallet } = useWallet();
    const [userAddress, setUserAddress] = useState<string>("")

    const handleLastTransactions = async () => {
        if (walletConnected) {
            setUserAddress((await wallet.getUsedAddresses())[0])
        }
        else {
            alert("please connect a wallet")
        }
    }

    const { data, loading: qLoading, error } = useQuery(QUERY, {
        variables: {
            address: userAddress
        }
    });

    if (qLoading) {
        return (
            <Center p='10'>
                <Spinner size='xl' speed="1.0s" />
            </Center>
        );
    };

    if (error) {
        console.error(error);
        return (
            <Heading size="lg">Error loading data...</Heading>
        );
    };

    
    return (
        <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
            <Button colorScheme={'purple'} onClick={handleLastTransactions} py='2' size='lg' mb='5px' width={'full'}>See fees of your recent transactions 🧾</Button>
            <OrderedList fontSize={'lg'}>
                {userAddress !== '' && data && data.transactions.map((tx: any) => (
                    <ListItem>
                        <Text display={'inline'}>
                            Date: {tx.includedAt.substring(0, 10)}, transaction hash: <Link href={`https://testnet.cardanoscan.io/transaction/${tx.hash}`}>{tx.hash.substring(0, 3)}...{tx.hash.substring(tx.hash.length - 3)}</Link>, 
                        </Text>
                        <Text fontWeight='bold' display='inline'> Fees: {Number(tx.fee) / 1000000} t₳</Text>
                    
                    </ListItem>


                ))}
            </OrderedList>
            
        </Box>
    )
}
