// Imports:
// You may not use all of these, and you may need to add a few!
import { useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner, Link
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { Transaction } from '@martifylabs/mesh'
import type { UTxO } from "@martifylabs/mesh";



export default function TransactionTemplate() {
    // These will come in handy:
    const { walletConnected, wallet } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    return (
        <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
            <Heading size='xl'>
                Tx Template
            </Heading>
            <Text py='3'>
                What transactions will you build?
            </Text>
            <Text py='3'>
                Look at how addresses are handled in the Transaction API at the <Link href="https://mesh.martify.io/apis/transaction">Mesh Playground</Link>
            </Text>
            <Text py='3'>
                Review other Transactions in this Front-End Template: see <Link href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-front-end-template/-/tree/main/components/transactions">/components/transactions/</Link> and <Link href="https://gitlab.com/gimbalabs/plutus-pbl-summer-2022/ppbl-front-end-template/-/tree/main/components/faucets">/components/faucets/</Link>.
            </Text>
            <Text py='3'>
                Then, use this template to complete <Link href="https://gimbalabs.instructure.com/courses/26/assignments/468">Mastery Assignment 302.4</Link>
            </Text>
        </Box>
    );
}