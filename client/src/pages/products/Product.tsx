import React, {  useState } from 'react'
import {  ProductType } from '../../slices/productSlice'
import { Box, Button, Card, CardActions, CardContent, Collapse, IconButton, Typography, useTheme } from '@mui/material';
import getImageType from '../../utils/getImageType';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlexBetween from '../../components/FlexBetween';
import EditProductForm from '../../components/EditProductForm';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

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
      subCategory
    } = product;
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const {categories}=useSelector((state:RootState)=> state.category);
    const {subCategories}=useSelector((state:RootState)=> state.subCategory);
    const handleOpenForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      setOpenEditForm(true);
      console.log('Form opened');
    };
    const handleCloseForm = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (event) event.stopPropagation();
      setOpenEditForm(false);
      console.log('Form closed');
    };
  /*const toggleEditForm=()=>{
    setOpenEditForm(!openEditForm)
    console.log(openEditForm)
  }*/
 
  
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
