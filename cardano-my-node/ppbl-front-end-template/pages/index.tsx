import {
  Box, Heading, Text, Link, Spinner, Center, Flex, Spacer, Grid, GridItem
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import ResourceList from '../components/course/ResourceList';
import WelcomeComponent from '../components/course/WelcomeComponent';
import CanvasLinks from '../components/course/CanvasLinks';
import SiteContents from '../components/course/SiteContents';

const Home: NextPage = () => {


  return (
    <Grid templateColumns='repeat(5, 1fr)' gap='10'>
      <GridItem colSpan={3}><WelcomeComponent /></GridItem>
      <GridItem colSpan={2}><CanvasLinks /></GridItem>
      <GridItem colSpan={3}><SiteContents /></GridItem>
      <GridItem colSpan={2}><ResourceList /></GridItem>
    </Grid>


  )
}

export default Home
