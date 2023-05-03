import { useEffect, useState } from "react";
import {
    Box, Heading, Text, Link, Center, Spinner,
    Table, Thead, Tbody, Tr, Th, Td, TableContainer, TableCaption
} from "@chakra-ui/react"

export default function HoldersByAssetID() {

    const [addressList, setAddressList] = useState(null)
    const [isLoading, setLoading] = useState(false)

    // ------------------------------------------------------------------------
    // Module 302, Mastery Assignment #2
    //
    // Instructions:
    // Below, see how the Koios API is used to get a list of all Addresses
    // that hold PPBLSummer2022 tokens. All it takes is a single URL --
    // this is really helpful!
    //
    // Our problem is that Koios is not yet available on Pre-Production.
    // Your Assignment is to write a GraphQL Query that achieves the same
    // result as this Koios Query.
    // ------------------------------------------------------------------------

    useEffect(() => {
        setLoading(true)
        fetch('https://testnet.koios.rest/api/v0/asset_address_list?_asset_policy=1309921891e459c7e9acb338d5dae18f98d1c2f55c1852cd5cf341f9&_asset_name=5050424c53756d6d657232303232')
            .then((res) => res.json())
            .then((data) => {
                setAddressList(data)
                setLoading(false)
            })
    }, [])

    return (
        <Box m='5' p='5' bg='purple.50' border='1px' borderRadius='lg'>
            <Heading size='lg'>
                Retrieve a list of addresses with a Koios Query (Old Testnet)
            </Heading>
            <Box width='50%' mx='auto' mb='5'>
                <Text py='2' fontSize='lg'>
                    Koios makes it really easy to get a list of addresses that hold a token. There is really no reason not to use it!
                </Text>
                <Text py='2' fontSize='lg'>
                    However, there is not yet a public instance of Koios running for Pre-Production (unless you create your own with Dandelion - which is a great idea - but we will save that exploration for sometime soon!).
                </Text>
                <Text py='2' fontSize='lg'>
                    So here is your challenge. Can you re-create the data shown in this component using GraphQL instead of Koios? This is the Level 2 Mastery Assignmnet for <Link href="https://gimbalabs.instructure.com/courses/26/assignments/466" color="orange.700">Module 302 - Querying the Blockchain</Link>
                </Text>
            </Box>
            <Text p='2'>
                Made with <a href="https://testnet.koios.rest/#get-/asset_address_list">https://testnet.koios.rest/#get-/asset_address_list</a>
            </Text>
            {isLoading ? (
                <Center p='10'>
                    <Spinner />
                </Center>
            ) : (
                <TableContainer bg='blue.800' color='white'>
                    <Table variant='simple' fontSize='md'>
                        <Thead>
                            <Tr bg='blue.200'>
                                <Th>Address</Th>
                                <Th isNumeric># PPBLSummer2022</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {addressList?.map((addr: any) => (
                                <Tr>
                                    <Td><pre>{addr?.payment_address}</pre></Td>
                                    <Td isNumeric>{addr?.quantity}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
