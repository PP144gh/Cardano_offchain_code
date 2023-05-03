import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme, Box } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import client from '../apollo-client'
import { WalletProvider } from '../contexts/wallet';

import '@fontsource/comfortaa'
import '@fontsource/work-sans'


import Nav from '../components/nav'
import Footer from '../components/footer'

const theme = extendTheme({
  colors: {

  },
  fonts: {
    heading: "Work Sans",
    body: "Comfortaa"
  },
  components: {
    Heading: {
      baseStyle: {
        color: "purple.800"
      },
      variants: {
        'page-heading': {
          color: "red.900",
          py: "4"
        }
      }
    },
    Link: {
      baseStyle: {
        color: "orange.700"
      }
    },
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <WalletProvider>
          <Nav />
          <Box w='85%' mx='auto' p='5' mb='24'>
            <Component {...pageProps} />
          </Box>
          <Footer />
        </WalletProvider>
      </ChakraProvider>
    </ApolloProvider>
  )

}

export default MyApp
