import { Box, Pagination, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import FilterProducts from "../../components/FilterProducts";
import {  useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  deleteProduct,
  getAllProducts, 
  getProductsNumber,
} from "../../apiCalls/productApiCalls";
import { productActions } from "../../slices/productSlice";
import ProductsGrid from "./ProductsGrid";
import ProductsFiltred from "./ProductsFiltred";
import { useDispatch } from "../../hooks";
 
const Products: React.FC = () => {
  const dispatch =useDispatch() ;
  const { products, productsCount } = useSelector(
    (state: RootState) => state.product
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageFilter, setCurrentPageFilter] = useState<number>(1);
  const { filteredProducts, filteredProductsCount } = useSelector(
    (state: RootState) => state.product
  );
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const PRODUCT_PER_PAGE: number = 8;
  const pages: number = Math.ceil(productsCount / PRODUCT_PER_PAGE);
  const filterdPages: number = Math.ceil(
    filteredProductsCount / PRODUCT_PER_PAGE
  );
  const [filtered, setFiltered] = useState<boolean>(false);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };
  const handleFilteredPageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPageFilter(page);
  };

  useEffect(() => {
    dispatch(getAllProducts(currentPage));
  }, [currentPage, productsCount, filtered, dispatch]);

  useEffect(() => {
    dispatch(getProductsNumber());
  }, [dispatch]);

  const deleteProductFunction = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const handleSetFiltering = () => {
    setFiltered(true);
  };
  const handleClearFiltering = (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event) event.stopPropagation();
    setFiltered(false);
    dispatch(productActions.resetFiltredProducts());
    dispatch(productActions.resetFiltredProductsCount());
    dispatch(productActions.setIsProductsFiltered(false));
    //dispatch(getAllProducts(currentPage));
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Box>
        <Header title="PRODUCTS" subtitle="See list of products" />
        <Box my="1.5rem">
          <FilterProducts
            handleSetFiltering={handleSetFiltering}
            filtered={filtered}
            handleClearFiltering={handleClearFiltering}
            currentPage={currentPageFilter}
          />
        </Box>
        {!filtered ? (
          <ProductsGrid
            isNonMobile={isNonMobile}
            products={products}
            deleteProductFunction={deleteProductFunction}
          />
        ) : (
          <ProductsFiltred
            isNonMobile={isNonMobile}
            filteredProducts={filteredProducts}
            deleteProductFunction={deleteProductFunction}
          />
        )}
      </Box>
      {productsCount > 0 && !filtered && (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          py="30px"
        >
          <Pagination
            count={pages}
            page={currentPage}
            onChange={handlePageChange}
            size="large"
          />
        </Box>
      )}
      {filteredProductsCount > 0 && filtered && (
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          py="30px"
        >
          <Pagination
            count={filterdPages}
            page={currentPageFilter}
            onChange={handleFilteredPageChange}
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default Products;
