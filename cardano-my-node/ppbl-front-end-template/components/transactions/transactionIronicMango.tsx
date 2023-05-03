// Imports:
// You may not use all of these, and you may need to add a few!
import { useState } from "react";
import {
    Box, Heading, Text, Input, FormControl, Button, Center, Spinner, Link, Select,
} from "@chakra-ui/react"
import { useFormik } from "formik";
import useWallet from "../../contexts/wallet";
import type { UTxO } from "@martifylabs/mesh";
import { Transaction, ForgeScript } from '@martifylabs/mesh';
import type { Mint, AssetMetadata } from '@martifylabs/mesh';
import { empty } from "@apollo/client";


type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

function useCopyToClipboard(): [CopiedValue, CopyFn] {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null)

    const copy: CopyFn = async text => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported')
            return false
        }

        // Try to save to clipboard then save it in the state if worked
        try {
            await navigator.clipboard.writeText(text)
            setCopiedText(text)
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            setCopiedText(null)
            return false
        }
    }

    return [copiedText, copy]
}


export default function TransactionIronicMango() {
    // These will come in handy:
    const { walletConnected, wallet } = useWallet();
    const [successfulTxHash, setSuccessfulTxHash] = useState<string | null>(null)
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            NFTName: '',
            imageURL: '',
            NFTDescription: '',
            QTY: '',
            imageType: '',
        },
        onSubmit: values => {
            alert("Success!");
        },
    });

    const mintNFTTestnet = async () => {
        if (walletConnected) {
            const network = await wallet.getNetworkId()
            setLoading(true)
            if (network == 1) {
                alert("This dapp only works on Cardano Pre-Production Network")
            }
            else if (formik.values.NFTName == "") {
                alert("Please fill out all fields")
            }else if (formik.values.NFTDescription == "") {
                alert("Please fill out all fields")
            }else if (formik.values.NFTName == "") {
                alert("Please fill out all fields")
            }else if (parseInt(formik.values.QTY) < 1 || formik.values.QTY == "") {
                alert("Enter a positive integer for quantity")
            }else if (formik.values.imageType != "image/jpg" && formik.values.imageType != "image/png") {
                alert("Please select an image type")
            }else if (formik.values.imageURL == "" || formik.values.imageURL.substring(0,7) != "ipfs://") {
                alert("Ensure image URL is filled out, beginning with ipfs://")
            }else {
                const usedAddress = await wallet.getUsedAddresses();
                const address = usedAddress[0];
                const forgingScript: string = ForgeScript.withOneSignature(address);

                // For handling IPFS links longer than 64 chars
                const urlArr: string[] = []
                let q = 0                
                if (formik.values.imageURL.length > 64) {
                    while (formik.values.imageURL.substring(q).length > 64) {
                        urlArr.push(formik.values.imageURL.substring(q, 64));
                        q = q + 64;
                    }
                }
                urlArr.push(formik.values.imageURL.substring(q));

                const assetMetadata1: AssetMetadata = {
                    "name": formik.values.NFTName,
                    "image": urlArr,
                    "mediaType": formik.values.imageType,
                    "description": formik.values.NFTDescription
                };
                const asset1: Mint = {
                    assetName: formik.values.NFTName,
                    assetQuantity: formik.values.QTY,
                    metadata: assetMetadata1,
                    label: '721',
                    recipient: {
                        address: address,
                    },
                };
                console.log("asset1 : ", asset1)
                const tx = new Transaction({ initiator: wallet }).mintAsset(
                    forgingScript,
                    asset1,
                );
                try {
                    const unsignedTx = await tx.build();
                    console.log("built tx")
                    const signedTx = await wallet.signTx(unsignedTx);
                    var txHash = await wallet.submitTx(signedTx);
                    console.log("Message", txHash)
                    setSuccessfulTxHash(txHash)
                } catch (error: any) {
                    if (error.info) {
                        alert(error.info)
                    } else {
                        console.log(error)
                    }
                }

            }
            setLoading(false)
        }
        else {
            alert("please connect a wallet")
        }
    }

    const [value, copy] = useCopyToClipboard()

    if (walletConnected) {
        return (
            <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
                <Heading size='xl' textAlign='center'>
                    Mint an NFT
                </Heading>
                <FormControl my='3'>
                    <Input mb='3' bg='white' id="NFTName" name="NFTName" onChange={formik.handleChange} value={formik.values.NFTName} placeholder="The name of your NFT" />
                    <Input mb='3' bg='white' id="imageURL" name="imageURL" onChange={formik.handleChange} value={formik.values.imageURL} placeholder="Enter an IPFS hash ipfs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                    <Input mb='3' bg='white' id="NFTDescription" name="NFTDescription" onChange={formik.handleChange} value={formik.values.NFTDescription} placeholder="The description of your NFT" />
                    <Input mb='3' bg='white' id="QTY" name="QTY" onChange={formik.handleChange} value={formik.values.QTY} placeholder="How many do you want to mint?" />
                    <Select placeholder='Image Type' isRequired bg='white' mb='3' onChange={formik.handleChange} id='imageType' name='imageType' value={formik.values.imageType}>
                        <option value="image/jpg">
                            JPEG
                        </option>
                        <option value="image/png">
                            PNG
                        </option>
                    </Select>
                    <Button colorScheme='purple' onClick={mintNFTTestnet}>Mint!</Button>
                </FormControl>
                <Box mt='2' p='2' bg='blue.100'>
                    <Heading size='sm' py='1'>Status</Heading>
                    {successfulTxHash ? (
                        <><Text>Successful transaction!!</Text><Button colorScheme='purple' onClick={() => copy(successfulTxHash)}>Copy tx hash</Button></>
                    ) : (
                        <Text>Ready to test a transaction!</Text>
                    )}
                </Box>
            </Box>
        );
    } else {
        return (
            <Box p='5' bg='orange.100' border='1px' borderRadius='xl' fontSize='lg'>
                <Heading size='xl' textAlign='center'>
                    Mint an NFT
                </Heading>
                <Text py='3' fontSize='25'>
                    You must connect a Wallet first...
                </Text>
            </Box>
        );
    }
}