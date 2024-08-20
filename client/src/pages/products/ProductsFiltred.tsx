import { Box, LinearProgress, Typography } from '@mui/material'
import React from 'react'
import Product from './Product'
import { ProductType } from '../../slices/productSlice'

interface FilteredProductGridProps{
    isNonMobile:boolean,
    filteredProducts:ProductType[],
    deleteProductFunction:(id:string)=> void,
    isLoading:boolean
}

const ProductsFiltred:React.FC<FilteredProductGridProps> = ({isNonMobile,filteredProducts,deleteProductFunction,isLoading}) => {
  return (
    <>
    {  !isLoading   ? filteredProducts.length>0 ? (<Box
                    mt="20px"
                    display="grid"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    justifyContent="space-between"
                    rowGap="20px"
                    columnGap="1.33%"
                    sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                    }}
                >
                    
         { filteredProducts.map(product => (
            <Product
              key={product._id}
              product={product}
              delete={deleteProductFunction}
            />
          ))}
          
                </Box>) : (<Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt="100px"
          >
            <Typography>No Products Found</Typography>
          </Box>)     :   <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>}</>
  )
}

export default ProductsFiltred
