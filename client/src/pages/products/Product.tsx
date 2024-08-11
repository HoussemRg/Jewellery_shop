import React, {  useEffect, useState } from 'react'
import {  ProductType } from '../../slices/productSlice'
import { Box, Button, Card, CardActions, CardContent, Collapse, Divider, IconButton, Typography, useTheme } from '@mui/material';
import getImageType from '../../utils/getImageType';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlexBetween from '../../components/FlexBetween';
import EditProductForm from '../../components/product/EditProductForm';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useDispatch } from '../../hooks';
import { cardActions, ProductToBuyType } from '../../slices/cardSlice';
import ApplyCouonForm from '../../components/product/ApplyCouonForm';
import { getCouponPerType } from '../../apiCalls/couponApiCall';
import DiscountIcon from '@mui/icons-material/Discount';

interface ProductProps{
  product:ProductType,
  delete:(id:string)=> void
}

const Product:React.FC<ProductProps> = ({ product, delete:deleteProduct }) => {
    const {
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
      coupon,
    } = product;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch=useDispatch();
  const {user}=useSelector((state:RootState)=> state.auth);
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [openCouponForm, setOpenCouponForm] = useState<boolean>(false);
  const {categories}=useSelector((state:RootState)=> state.category);
    const {subCategories}=useSelector((state:RootState)=> state.subCategory);
    const {productsList,isCardOpened,clientId}=useSelector((state:RootState)=> state.card);
    const {filteredCoupons}=useSelector((state:RootState)=> state.coupon);
    const handleOpenForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      setOpenEditForm(true);
      
    };
    const handleCloseForm = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (event) event.stopPropagation();
      setOpenEditForm(false);

    };
  
  const handleAddProduct=()=>{
    const productToBuy:ProductToBuyType={
      _id,
      productName,
      description,
      carat,
      weight,
      productPhoto,
      stockQuantity,
      category,
      subCategory
    }
    dispatch(cardActions.addProduct(productToBuy));
    if(!isCardOpened){
      dispatch(cardActions.setIsCardToggled(true))
    }
  }
  const handleOpenCouponForm=(event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    event.stopPropagation();
    setOpenCouponForm(true);
  }
  const handleCloseCouponForm=(event?: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    if (event) event.stopPropagation();
    setOpenCouponForm(false);
  }
  useEffect(()=>{
    dispatch(getCouponPerType('product'));
  },[]);
  

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="div">
          {productName}
        </Typography>
        <ApplyCouonForm
          handleCloseCouponForm={handleCloseCouponForm}
          open={openCouponForm}
          FilteredCoupon={filteredCoupons}
          itemId={product._id}
        />
        <Box display="flex" justifyContent="center" alignItems="center">
        {!productsList.find((product:ProductToBuyType)=> product._id===_id) &&  clientId && <IconButton
              onClick={handleAddProduct}
              color="primary"
            >
              <AddCircleOutlineOutlinedIcon />
            </IconButton>}
            {user?.role!== 'vendor ' && <IconButton
              onClick={handleOpenCouponForm}
              color="primary"
            >
              <DiscountIcon />
            </IconButton>}
        </Box>

        </Box>
        
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[200]}>
        {`$${(unitPrice * weight).toFixed(2)}`}
        </Typography>
        
        <Box display="flex" justifyContent="center" alignItems="center" my="20px">
            <img src={getImageType(productPhoto.data)}  alt='Product Photo' width="60%" />
        </Box>
        <Box display="flex" gap="10px">
            <Typography color={theme.palette.secondary[100]}>Category:</Typography>
            <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[300]}
            gutterBottom
            >
            {category.categoryName}
            </Typography>
        </Box>
        <Box display="flex" gap="10px">
            <Typography color={theme.palette.secondary[400]}>Sub-Category:</Typography>
            <Typography
            sx={{ fontSize: 14 }}
            color={theme.palette.secondary[700]}
            gutterBottom
            >
            {subCategory.subCategoryName}
            </Typography>
            
        </Box>
        <Box display="flex" gap="10px">
        <Typography color={theme.palette.secondary[400]}>Stock :</Typography>
        <Typography sx={{ fontSize: 14 }}
            color={theme.palette.secondary[700]}
            gutterBottom>
            {stockQuantity}
          </Typography>
        </Box>
        <Typography variant="body2">{description}</Typography>
        
  
      </CardContent>
      <CardActions>
      <FlexBetween width="100%">
      <Button
        
        size="small"
        sx={{ backgroundColor: theme.palette.primary[100] }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
  
          See More
        </Button>
        <Box display="flex" justifyContent="space-around" alignItems="center">
        <IconButton aria-label="delete"  color='info' onClick={() => deleteProduct(product._id)} >
        <DeleteIcon/>
        </IconButton>
        <IconButton color="success" aria-label="edit" onClick={handleOpenForm}>
        <EditIcon />
      
        <EditProductForm
          handleCloseEditForm={handleCloseForm}
          open={openEditForm}
          categories={categories}
          subCategories={subCategories}
          product={product}
        />
        </IconButton>
      
        </Box>
        </FlexBetween>
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
           Purchase Price: {purchasePrice}
          </Typography>
          {coupon && coupon.length > 0 && (
  <Box mt="20px" p="10px" borderRadius="8px" sx={{ backgroundColor: theme.palette.background.default, boxShadow: 2 }}>
    
    {coupon.map((coupon) =>  {
  const isValid =  new Date(coupon.expirationDate) >= new Date();
  
  return isValid && (
    <Box 
      key={coupon._id} 
      display="flex" 
      flexDirection={{ xs: 'row', md: 'column' }} 
      justifyContent={{ xs: 'space-between', md: 'flex-start' }} 
      alignItems={{ xs: 'center', md: 'flex-start' }} 
      my="6px"  
      p="6px"   
      borderRadius="8px" 
      sx={{ 
        backgroundColor: theme.palette.background.paper, 
        boxShadow: 1 
      }}
    >
      <Typography variant="body2" fontWeight="bold" color={theme.palette.primary.main}>
        {coupon.couponName}
      </Typography>
      <Typography variant="body2" fontWeight="bold" color={theme.palette.secondary.main}>
        Type : {coupon.type}
      </Typography>
      <Typography variant="caption" color={theme.palette.success.main}>
        {coupon.discountRate}% off
      </Typography>
      <Typography variant="caption" color={theme.palette.success.main}>
        {`Starts: ${new Date(coupon.startDate).toLocaleDateString()}`}
      </Typography>
      <Typography variant="caption" color={theme.palette.error.main}>
        {`Expires: ${new Date(coupon.expirationDate).toLocaleDateString()}`}
      </Typography>
    </Box>
  );
})}
<Divider sx={{ mt: 1 }} /> 
</Box>
)}
{category.coupon && category.coupon.length > 0 && (
  <Box mt="10px" p="6px" borderRadius="8px" sx={{ backgroundColor: theme.palette.background.default, boxShadow: 2 }}>
    
    {category.coupon.map((coupon) => {  
      const isValid=new Date(coupon.expirationDate)>= new Date();
      return isValid &&
      (<Box 
        key={coupon._id} 
        display="flex" 
        flexDirection={{ xs: 'row', md: 'column' }} 
        justifyContent={{ xs: 'space-between', md: 'flex-start' }} 
        alignItems={{ xs: 'center', md: 'flex-start' }} 
        my="6px" 
        p="6px" 
        borderRadius="8px" 
        sx={{ 
          backgroundColor: theme.palette.background.paper, 
          boxShadow: 1 
        }}
      >
        <Typography variant="body2" fontWeight="bold" color={theme.palette.primary.main}>
          {coupon.couponName}
        </Typography>
        <Typography variant="body2" fontWeight="bold" color={theme.palette.secondary.main}>
        Type : {coupon.type}
      </Typography>
        <Typography variant="caption" color={theme.palette.success.main}>
          {coupon.discountRate}% off
        </Typography>
        <Typography variant="caption" color={theme.palette.success.main}>
      {`starts: ${new Date(coupon.startDate).toLocaleDateString()}`}
    </Typography>
        <Typography variant="caption" color={theme.palette.error.main}>
          {`Expires: ${new Date(coupon.expirationDate).toLocaleDateString()}`}
        </Typography>
      </Box>)
})}
    <Divider sx={{ mt: 1 }} />
  </Box>
)}
{subCategory.coupon && subCategory.coupon.length > 0 && (
  <Box mt="10px" p="6px" borderRadius="8px" sx={{ backgroundColor: theme.palette.background.default, boxShadow: 2 }}>
    
    {subCategory.coupon.map((coupon) => { 
      const isValid=new Date(coupon.expirationDate)>= new Date();
      return isValid &&
      (<Box 
        key={coupon._id} 
        display="flex" 
        flexDirection={{ xs: 'row', md: 'column' }} 
        justifyContent={{ xs: 'space-between', md: 'flex-start' }} 
        alignItems={{ xs: 'center', md: 'flex-start' }} 
        my="6px" 
        p="6px" 
        borderRadius="8px" 
        sx={{ 
          backgroundColor: theme.palette.background.paper, 
          boxShadow: 1 
        }}
      >
        <Typography variant="body2" fontWeight="bold" color={theme.palette.primary.main}>
          {coupon.couponName}
        </Typography>
        <Typography variant="body2" fontWeight="bold" color={theme.palette.secondary.main}>
        Type : {coupon.type}
      </Typography>
        <Typography variant="caption" color={theme.palette.success.main}>
          {coupon.discountRate}% off
        </Typography>
        <Typography variant="caption" color={theme.palette.success.main}>
      {`starts: ${new Date(coupon.startDate).toLocaleDateString()}`}
    </Typography>
        <Typography variant="caption" color={theme.palette.error.main}>
          {`Expires: ${new Date(coupon.expirationDate).toLocaleDateString()}`}
        </Typography>
      </Box>)
    })}
    <Divider sx={{ mt: 1 }} />
  </Box>
)}
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default Product
