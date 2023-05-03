import { useQuery, gql } from "@apollo/client";

import {
    Center, Heading, Text, Box, Button, Spinner, OrderedList, ListItem, Link
} from "@chakra-ui/react";
import { useState } from "react";
import useWallet from "../../contexts/wallet";

// ------------------------------------------------------------------------
// Module 302, Mastery Assignment #3
//
// STEP 1: Replace this GraphQL query with a new one that you write.
//
// Need some ideas? We will brainstorm at Live Coding.
// ------------------------------------------------------------------------
const QUERY = gql`
query userExpense ($address: String) {
    transactions(where :  {inputs : {address : {_eq : $address}}}){
        includedAt
        outputs{
        address
        value
        tokens{
            asset{
                policyId
                }
            }
        }
    
    }		
}
`;

export default function Mastery302dot3Hari() {

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
    const queryAddress = userAddress

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            address: queryAddress
        }
    });

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
            <Heading py='2' size='md'>Hari Krishna Mastery Assignment 302.3</Heading>
            <Button colorScheme={'purple'} onClick={handleLastTransactions} py='2' size='lg' mb='5px' width={'full'}>See Expenses 🧾</Button>
            <OrderedList fontSize={'lg'}>
                {userAddress !== '' && data && data.transactions.map((tx: any) => (

                    <ListItem>
                        
                        {  tx.outputs.map((ot: any) =>(
                            (ot.address != userAddress)? <Text fontWeight='bold' display='inline'> address: {ot.address} value: {Number(ot.value) / 1000000}t₳</Text> : <></>
                        

                        ))}
                        <Text fontWeight='bold' display='inline'> Date : {tx.includedAt}</Text>
                    
                    </ListItem>


                ))}
            </OrderedList>
            
        </Box>
    )
}
