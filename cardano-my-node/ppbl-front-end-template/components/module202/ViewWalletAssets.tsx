import {
    Box, Heading, Text,
    Center, Spinner
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import useWallet from '../../contexts/wallet';

export default function ViewAllWalletAssets() {
    const { walletConnected, wallet } = useWallet();
    const [loading, setLoading] = useState<boolean>(true);
    const [currentNetwork, setCurrentNetwork] = useState<"Not Connected" | "Mainnet" | "Testnet">("Not Connected")
    const [assets, setAssets] = useState<null | any>(null);

    useEffect(() => {

        const fetchAssets = async () => {
            setLoading(true);
            const _assets = await wallet.getAssets();
            setAssets(_assets);
            setLoading(false);
        }

        const fetchNetwork = async () => {
            const _network = await wallet.getNetworkId();
            if (_network === 0) {
                setCurrentNetwork("Testnet")
            }
            else if (_network === 1) {
                setCurrentNetwork("Mainnet")
            }
        }

        if (walletConnected) {
            fetchAssets();
            fetchNetwork();
        }

    }, [walletConnected])

    return (
        <Box p='5' mt='5' bg='green.100' border='1px' borderRadius='lg'>
            <Heading>
                If Wallet is Connected, View a list of all Assets in the Wallet
            </Heading>
            <Heading py='2' size='sm'>
                On Cardano Network: {currentNetwork}
            </Heading>

            {loading ? (
                <Box my='5' p='5' bg='#435689' color='#ffffff'>
                    {walletConnected ? (
                        <Center>
                            <Text>Loading Assets...</Text>
                            <Spinner />
                        </Center>
                    ) : (
                        <Text>Please connect a Wallet</Text>
                    )}
                </Box>
            ) : (
                <Box m='5' p='5' bg='#435689' color='#ffffff'>
                    {/* As an exercise, use assets.map to create a dynamic list of components */}
                    <pre>
                        <code className="language-js">{JSON.stringify(assets, null, 2)}</code>
                    </pre>
                </Box>
            )}
            <Text py='2'>
                Note: Browser Wallets do not expose a way to distinguish between "Preview", "Pre-Production", and "Old Testnet". All are Testnets.
            </Text>
        </Box>
    )
}

