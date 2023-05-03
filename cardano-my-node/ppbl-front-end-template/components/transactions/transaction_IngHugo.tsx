// Imports:
// You may not use all of these, and you may need to add a few!
import { useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner, Link, Badge, Flex,Image
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import { ForgeScript, Transaction } from '@martifylabs/mesh'
import type { UTxO } from "@martifylabs/mesh";
import ConnectWallet from "../wallet/connectWallet";
//*********************** */

import type { Mint, AssetMetadata } from '@martifylabs/mesh';
//************************ */



export default function Transaction_IngHugo() {
    // These will come in handy:
    const {  wallet, walletConnected, connecting } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState<null | any>(null);

    

    async function getAssets() {
        if (wallet) {
          setLoading(true);
          const _assets = await wallet.getAssets();
          setAssets(_assets);
          setLoading(false);
        }
      }
      const formik = useFormik({
        initialValues: {
            TokenName: '',
            TokenDescription: '',
            QTY: '',
            imageType: '',
        },
        onSubmit: values => {
            alert("Success!");
        },
    });
   //******************************* */
   async function mintAssets() {
   
   // prepare forgingScript
   const usedAddress = await wallet.getUsedAddresses();
   const address = usedAddress[0];
   const forgingScript = ForgeScript.withOneSignature(address);
   
   const tx = new Transaction({ initiator: wallet });
   
   // define asset#1 metadata
   const assetMetadata1: AssetMetadata = {
     "name": formik.values.TokenName,
     "image": "",
     "mediaType": "image/jpg",
     "description": formik.values.TokenDescription
   };
   const asset1: Mint = {
     assetName: formik.values.TokenName,
     assetQuantity: formik.values.QTY,
     metadata: assetMetadata1,
     label: '20',
     recipient: {
       address: address,
     },
   };
   tx.mintAsset(
     forgingScript,
     asset1,
   );
   
   const unsignedTx = await tx.build();
   const signedTx = await wallet.signTx(unsignedTx);
   const txHash = await wallet.submitTx(signedTx);
   setSuccessfulTxHash(txHash);
  }
   //****************************** */ 
if (walletConnected) {
    return (
      <><Box p="5" bg="orange.100" maxW="620px" border='1px' borderWidth="1px">
      
         <Image borderRadius="md" src="https://ipfs.io/ipfs/bafybeihavfh642746oo7hhiklnldu2zv3agc5d7yax7pakxzoykew6kvme/cardano.png" />
        <Flex align="baseline" mt={2}>

          <Text
            ml={2}
            textTransform="uppercase"
            fontSize="sm"
            fontWeight="bold"
            color="pink.800"
          >
            <Badge colorScheme="pink">Cardano &bull; Mint Token transactions</Badge>

          </Text>
        </Flex>
        <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
          Mastering Assigment 302.4 by Hugo Ojeda #ingHugo
        </Text>

       


     
      
           {///*<Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>/
           }
          <Heading size='xl'>
          <Badge colorScheme="pink">Mint Token transactions</Badge>
            
          </Heading>
         
                <FormControl my='3'>
                    <Input mb='3' bg='white' id="TokenName" name="TokenName" onChange={formik.handleChange} value={formik.values.TokenName} placeholder="The name of your Token" />
                   
                    <Input mb='3' bg='white' id="TokenDescription" name="TokenDescription" onChange={formik.handleChange} value={formik.values.TokenDescription} placeholder="The description of your Token" />
                    <Input mb='3' bg='white' id="QTY" name="QTY" onChange={formik.handleChange} value={formik.values.QTY} placeholder="Quantity to mint!!!" />
                    
                    <Button colorScheme='purple' onClick={mintAssets}>Mint Token!</Button>
                </FormControl>
                <Box mt='2' p='2' bg='blue.100'>
                    <Heading size='sm' py='1'>Status</Heading>
                    {successfulTxHash ? (
                        <><Text>Successful transaction!! {successfulTxHash}</Text></>
                    ) : (
                        <Text>Ready to test a transaction!</Text>
                    )}
                </Box>


        </Box></>

    );
   } else{
    return(
      <><Box p="5" bg="orange.100" maxW="620px" border='1px' borderWidth="1px">
      
      <Image borderRadius="md" src="https://ipfs.io/ipfs/bafybeihavfh642746oo7hhiklnldu2zv3agc5d7yax7pakxzoykew6kvme/cardano.png" />
     <Flex align="baseline" mt={2}>

       <Text
         ml={2}
         textTransform="uppercase"
         fontSize="sm"
         fontWeight="bold"
         color="pink.800"
       >
         <Badge colorScheme="pink">Cardano &bull; Mint Token transactions</Badge>

       </Text>
     </Flex>
     <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
       Mastering Assigment 302.4 by Hugo Ojeda #ingHugo
     </Text>

       <Heading size='xl'>
       <Badge colorScheme="pink">Mint Token transactions</Badge>
         
       </Heading>
         <div>
          <h1>Connect your Wallet firts!!!!</h1>
          <ConnectWallet />
          {walletConnected && (
            <>
              <h1>Get Wallet Assets</h1>
              {assets ? (
                <pre>
                  <code className="language-js">
                    {JSON.stringify(assets, null, 2)}
                  </code>
                </pre>
              ) : (
                <button
                  type="button"
                  //* onClick={() => mintAssets()}
                  onClick={() => getAssets()}
                  disabled={connecting || loading}
                  style={{
                    margin: "8px",
                    backgroundColor: connecting || loading ? "orange" : "grey",
                  }}
                >
                  Get Wallet Assets
                </button>
              )}
            </>
          )}
        </div>

</Box></>

           )
       }
       
   }

  
