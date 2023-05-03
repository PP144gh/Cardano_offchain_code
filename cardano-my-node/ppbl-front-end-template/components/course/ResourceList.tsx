import Link from 'next/link'
import { Box, Heading, Flex, Spacer, Text, List, ListItem, ListIcon, UnorderedList, Link as ChakraLink } from '@chakra-ui/react'

export default function ResourceList() {
    return (
        <Box bg="blue.50" p='5' border='1px' borderRadius='lg'>
            <Heading py='2'>Resources</Heading>
            <Heading pt='5' size='md'>Packages Used</Heading>
            <Text py='3'>You will notice these packages in use throughtout the template:</Text>
            <UnorderedList px='2'>
                <ListItem><ChakraLink href="https://mesh.martify.io/">Mesh</ChakraLink> for interacting with Cardano</ListItem>
                <ListItem><ChakraLink href="https://www.apollographql.com/docs/react/">Apollo GraphQL</ChakraLink> for using GraphQL queries</ListItem>
                <ListItem><ChakraLink href="https://chakra-ui.com/">Chakra UI</ChakraLink> for styling (e.g. fonts, and this blue box)</ListItem>
                <ListItem><ChakraLink href="https://formik.org/">Formik</ChakraLink> for making forms</ListItem>
                <ListItem><ChakraLink href="https://fontsource.org/">Fontsource</ChakraLink> to grab custom fonts</ListItem>
            </UnorderedList>
            <Text pt='3'>There is a lot more to learn about each of these!</Text>
            <Text py='1'>If you have questions, bring them to live coding.</Text>
            <Heading pt='5' size='md'>Querying Data with NextJS</Heading>
            <Text pt='3'>NextJS can handle data and page rendering in four different ways.</Text>
            <Text pt='3'>Templates are provided to help you get started. To learn more:</Text>
            <UnorderedList pt='3' px='2'>
                <ListItem><Link href="/templates"><ChakraLink>View templates in this project.</ChakraLink></Link></ListItem>
                <ListItem><ChakraLink href="https://nextjs.org/docs/basic-features/data-fetching/overview">Data-Fetching with NextJS</ChakraLink></ListItem>
                <ListItem><ChakraLink href="https://blog.logrocket.com/why-use-next-js-apollo/">Helpful Tutorial</ChakraLink></ListItem>
            </UnorderedList>

        </Box>
    )
}