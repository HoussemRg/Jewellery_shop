import { Box } from '@mui/material'
import React from 'react'
import Product from './Product'
import { ProductType } from '../../slices/productSlice'

interface FilteredProductGridProps{
    isNonMobile:boolean,
    filteredProducts:ProductType[],
    deleteProductFunction:(id:string)=> void
}

const ProductsFiltred:React.FC<FilteredProductGridProps> = ({isNonMobile,filteredProducts,deleteProductFunction}) => {
  return (
    <Box
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
          
                </Box>
  )
}

export default ProductsFiltred
