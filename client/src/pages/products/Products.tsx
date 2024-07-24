import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import FilterProducts from '../../components/FilterProducts'
import { useSelector } from 'react-redux'
import { RootState } from '../../store';
import { useDispatch } from '../../hooks'
import { getAllProducts } from '../../apiCalls/productApiCalls'
import Product from './Product'
const Products :React.FC= () => {
    const dispatch=useDispatch();
    const products=useSelector((state:RootState) =>state.product.products);
    const [currentPage,setCurrentPage]=useState<number>(1);
    const isNonMobile = useMediaQuery("(min-width: 1000px)");

    useEffect(()=>{
        dispatch(getAllProducts(currentPage))
    },[currentPage]);
  return (
    <Box m="1.5rem 2.5rem">
      <Box>
        <Header title="PRODUCTS" subtitle='See list of products' />
        <Box my="1.5rem"><FilterProducts /></Box>
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
          {products.map(
            ({
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
                subCategory
            }) => (
              <Product
                key={_id}
                _id={_id}
                productName={productName}
                description={description}
                carat={carat}
                weight={weight}
                productPhoto={productPhoto}
                purchasePrice={purchasePrice}
                unitPrice={unitPrice}
                stockQuantity={stockQuantity}
                category={category}
                subCategory={subCategory}
              />
            )
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Products
