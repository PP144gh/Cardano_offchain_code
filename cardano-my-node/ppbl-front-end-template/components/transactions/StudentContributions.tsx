// Imports:
// You may not use all of these, and you may need to add a few!
import {
    Box, Heading, Text, Grid, GridItem
} from "@chakra-ui/react"
import TransactionIronicMango from "./transactionIronicMango";
import TransactionNelsonKsh from "./transactionNelsonKsh";
import TransactionSourabh from "./transactionSourabh";
import TransactionTemplate from "./transactionTemplate";
import Transaction_IngHugo from "./transaction_IngHugo";



export default function StudentContributions() {

    return (
        <Grid templateColumns='repeat(4, 1fr)' gap='5' mt='10'>
            <GridItem colSpan={4} py='5'>
                <Heading>
                    PPBL Student Contributions
                </Heading>
            </GridItem>
            <GridItem>
                <TransactionTemplate />
            </GridItem>
            <GridItem>
                <TransactionSourabh />
            </GridItem>
            <GridItem>
                <TransactionIronicMango />
            </GridItem>
            <GridItem>
                <Transaction_IngHugo />
            </GridItem>
            <GridItem>
                <TransactionNelsonKsh />
            </GridItem>
        </Grid>
    );
}
