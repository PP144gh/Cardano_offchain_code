import { useQuery, gql } from "@apollo/client";

import {
     Center, Heading, Text, Box, Table, Tbody, Tr, Td
} from "@chakra-ui/react";

const QUERY = gql`
    query tokens($policyId: Hash28Hex!) {
        tokenMints (where: {asset: {policyId: {_eq: $policyId}}}) {
            asset {
                assetName
            }
        }
    }
`;


function hex_to_ascii(str1: String) {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

function listHex2lString(listHex: []) {
    const listString: String[] = []
    listHex.map((item:any) => 
        listString.push(hex_to_ascii(item.asset.assetName))
    )
    return listString
}

export default function Mastery302dot3nelsonksh() {
    const policyId = "738ec2c17e3319fa3e3721dbd99f0b31fce1b8006bb57fbd635e3784"

    // EXAMPLE WITH VARIABLE
    const { data, loading, error } = useQuery(QUERY, {
        variables: {
            policyId: policyId
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


    return (
        <Box p="3" bg="orange.100" border='1px' borderRadius='lg'>
            <Heading py='2' size='md'>nelsonksh component</Heading>
            <Heading py='2'><Center>contrib-tokens in circulation</Center></Heading>
            <Center>
                <Table>
                    <Tbody>
                        {listHex2lString(data.tokenMints).map((item:String, i) => (
                                item === "" ?
                                <Tr>
                                    <Td><Text>{i+1}. <b>NO NAME</b></Text></Td>
                                </Tr> :
                                <Tr>
                                    <Td><Text>{i+1}. {item}</Text></Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </Center>
        </Box>
    )
}
