import { Box, Heading, Flex, Spacer, Text, List, ListItem, ListIcon, UnorderedList, Link } from '@chakra-ui/react'

export default function CanvasLinks() {
    return (
        <Box bg="green.100" p='5' border='1px' borderRadius='lg'>
            <Heading py='2'>Canvas Lessons</Heading>
            <Heading py='2' size='md'>Module 202: Intro to this Template</Heading>
            <UnorderedList>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/202-dot-1-run-plutus-pbl-front-end-template-locally">202.1 - Run this template</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/202-dot-2-conditionally-render-a-web-page-with-a-cardano-token">202.2 - Conditional Rendering with Tokens</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/202-dot-4-bbk-first-look-at-cardano-blockchain-queries">202.4 - First Look at Blockchain Queries</Link></ListItem>
            </UnorderedList>
            <Heading py='2' size='md'>Module 301: PPBL Faucet Mini-Project</Heading>
            <UnorderedList>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/301-project-overview">Project Overview</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/301-step-5-explore-simple-transactions-with-mesh">301.5 - Basic Transactions</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/pages/301-step-4-use-git-to-add-your-plutus-script-to-front-end-template">Register Your Faucet so it appears in this project</Link></ListItem>
            </UnorderedList>
            <Heading py='2' size='md'>Module 302: Querying the Blockchain</Heading>
            <UnorderedList>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/assignments/465">Level 1 - Customize and style a Query</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/assignments/466">Level 2 - Rewrite Koios Query with GraphQL</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/assignments/467">Level 3 - Create a Passive Component</Link></ListItem>
                <ListItem><Link href="https://gimbalabs.instructure.com/courses/26/assignments/468">Level 4 - Create a Transaction Component</Link></ListItem>
            </UnorderedList>
        </Box>
    )
}