import React from 'react'
import { cardActions, ProductToBuyType } from '../../slices/cardSlice'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import getImageType from '../../utils/getImageType'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useDispatch } from '../../hooks';

interface CardItem{
    product:ProductToBuyType;
    onQuantityChange: (productId: string, quantity: number) => void;

}

const CardItem:React.FC<CardItem> = ({product,onQuantityChange}) => {
    const dispatch=useDispatch()
    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        
        onQuantityChange(product._id, value!==undefined ? value : 1);
    };
    const handleRemoveItem=(productId:string)=>{
        dispatch(cardActions.removeProduct(productId));
    }
  return (
    <Box display="flex" gap={3}>
            <Box display="flex" justifyContent="center" alignItems="center" my="20px" width="30%">
                <img src={getImageType(product.productPhoto.data)} alt='Product Photo' width="60%" style={{ borderRadius: '8px' }} />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="start" width="70%">
                <Typography variant="h6" component="div" color="text.primary">
                    {product.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`Category: ${product.category.categoryName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`Sub-Category: ${product.subCategory.subCategoryName}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {`Carat: ${product.carat}, Weight: ${product.weight}g`}
                </Typography>
                <TextField
                    label="Quantity"
                    type="number"
                    
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1,max:product.stockQuantity }}
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: '10px',width:"50%" }}
                    
                />
                
            </Box>
            <IconButton
              onClick={()=> handleRemoveItem(product._id)}
              color="primary"
              sx={{ padding: 0 }}
            >
              <HighlightOffOutlinedIcon />
            </IconButton>
        </Box>
    );
};
  


export default CardItem
