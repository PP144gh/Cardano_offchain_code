import { gql } from "@apollo/client";
import client from "../../apollo-client";

import {
    Box, Heading, Text,
} from '@chakra-ui/react'
import type { NextPage } from "next";

const SSR: NextPage = ({addressListFromTx}: any) => {

    return (
        <Box>
            <Heading>
                Hello On Chain Data!
            </Heading>
            <Text py='3'>{JSON.stringify(addressListFromTx)}</Text>
        </Box>
    )
}

export default SSR

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
            query AddressFromUtxo {
                transactions(where: { hash: { _eq: "ac90e28c7f3a10e6c24641fbe0d74c02bcd00008a350abf2a27f15d2f5d4a8e0" } }) {
                    outputs {
                        address
                    }
                }
            }
        `,
    });
    return {
        props: {
            addressListFromTx: data.transactions,
        },
    };
}


