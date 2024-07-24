import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react'
import { FilterAltOutlined } from '@mui/icons-material';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const FilterProducts:React.FC = () => {
  return (
    <Box >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
            <Box display="flex" gap="10px">
                <FilterAltOutlined />
                <Typography>Filter</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
                <Item>xs=2</Item>
            </Grid>
            ))}
            </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default FilterProducts
