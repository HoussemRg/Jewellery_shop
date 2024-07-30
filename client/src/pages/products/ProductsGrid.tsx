import { Box } from '@mui/material'
import React from 'react'
import { ProductType } from '../../slices/productSlice'
import Product from './Product'


interface ProductGridProps{
    isNonMobile:boolean,
    products:ProductType[],
    deleteProductFunction:(id:string)=> void
}

const ProductsGrid:React.FC<ProductGridProps>  = ({isNonMobile,products,deleteProductFunction}) => {
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
                   {products.map(product => (
            <Product
              key={product._id}
              product={product}
              delete={deleteProductFunction}
            />
          ))
        }
                </Box>
  )
}

export default ProductsGrid
