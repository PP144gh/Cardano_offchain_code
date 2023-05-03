import {
    Box, Heading, Text, Link, Spinner, Center, Flex, Spacer, Grid, GridItem
  } from '@chakra-ui/react'
  import { useEffect, useState } from "react";
  import type { NextPage } from "next";
import DatumHashStudyComponent from '../../../components/datumStudy/DatumHashStudyComponent';

  const WorkingWithDatumPage: NextPage = () => {


    return (
      <Box>
        <Heading>
            Working with Datum
        </Heading>
        <DatumHashStudyComponent />
      </Box>


    )
  }

  export default WorkingWithDatumPage
