import { Box, Pagination, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import FilterProducts from '../../components/FilterProducts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from '../../hooks';
import { deleteProduct, getAllProducts, getProductsNumber } from '../../apiCalls/productApiCalls';
import Product from './Product';

const Products: React.FC = () => {
    const dispatch = useDispatch();
    const { products, productsCount } = useSelector((state: RootState) => state.product);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
    const isNonMobile = useMediaQuery("(min-width: 1000px)");
    const PRODUCT_PER_PAGE: number = 8;
    const pages: number = Math.ceil(productsCount / PRODUCT_PER_PAGE);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        dispatch(getAllProducts(currentPage));

    }, [currentPage,productsCount, dispatch]);

    useEffect(() => {
        dispatch(getProductsNumber());
    }, [dispatch]);
    const deleteProductFunction=(id:string)=>{
      dispatch(deleteProduct(id));
    }
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
                    {products.map(product => (
            <Product
              key={product._id}
              product={product}
              delete={deleteProductFunction}
            />
          ))}
                </Box>
            </Box>
            <Box width="100%" display="flex" justifyContent="center" alignItems="center" py="30px">
                <Pagination count={pages} page={currentPage} onChange={handlePageChange} size='large' />
            </Box>
        </Box>
    )
}

export default Products;