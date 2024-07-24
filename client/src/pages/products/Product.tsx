import React, { useState } from 'react'
import { ProductState } from '../../slices/productSlice'
import { Box, Button, Card, CardActions, CardContent, Collapse, Typography, useTheme } from '@mui/material';
import getImageType from '../../utils/getImageType';

const Product:React.FC<ProductState> = ({
    _id,
    productName,
    description,
    carat,
    weight,
    productPhoto,
    purchasePrice,
    unitPrice,
    stockQuantity,
    category,
    subCategory,
    
  }) => {

  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        
        <Typography variant="h5" component="div">
          {productName}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[200]}>
        {`$${(unitPrice * weight).toFixed(2)}`}
        </Typography>
        
        <Box display="flex" justifyContent="center" alignItems="center">
            <img src={getImageType(productPhoto.data)}  alt='Product Photo' />
        </Box>
        <Box display="flex" gap="10px">
            <Typography color={theme.palette.secondary[100]}>Category:</Typography>
            <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[300]}
            gutterBottom
            >
            {category}
            </Typography>
        </Box>
        <Box display="flex" gap="10px">
            <Typography color={theme.palette.secondary[400]}>Sub-Category:</Typography>
            <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[700]}
            gutterBottom
            >
            {subCategory}
            </Typography>
        </Box>
        
        <Typography variant="body2">{description}</Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.primary[200],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Carat: {carat}</Typography>
          <Typography>
            Weight: {weight}
          </Typography>
          <Typography>
            Stock: {stockQuantity}
          </Typography>
          <Typography>
           Purchase Price: {purchasePrice}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default Product
