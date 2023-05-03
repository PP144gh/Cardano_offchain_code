import { gql } from "@apollo/client";
import client from "../../apollo-client";

import {
    Box, Heading, Text,
} from '@chakra-ui/react'
import type { NextPage } from "next";

const SSG: NextPage = ({addressListFromTx}: any) => {

    return (
        <Box>
            <Heading>
                Hello On Chain Data!
            </Heading>
            <Text py='3'>{JSON.stringify(addressListFromTx)}</Text>
        </Box>
    )
}

export default SSG

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
            query AddressFromUtxo {
                transactions(where: { hash: { _eq: "418b694962a0d32d294ad23d8d7dd421e2c7985d9c1129ceaf9afa5064449090" } }) {
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
