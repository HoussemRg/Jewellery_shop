import { Card, CardContent, Typography, Box, IconButton, Grid, styled, Paper, Button, CardActions } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { cardActions, ProductToBuyType } from '../../slices/cardSlice';
import CardItem from './CardItem';
import { useDispatch } from '../../hooks';
import { orderActions } from '../../slices/orderSlice';
import { createOrder } from '../../apiCalls/orderApiCall';
import { useNavigate } from 'react-router-dom';


interface CardParams{
    handleClose:()=>void;
}
export interface OrderData{
    clientId:string;
    productsList:
        {
            productId:string,
            quantity:number
        }[]
    
}
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const TopRightCard: React.FC<CardParams> = ({handleClose}) => {
    const dispatch=useDispatch();
    const {productsList,clientId} = useSelector((state:RootState)=>state.card);
    const {isOrderCreated}=useSelector((state:RootState)=>state.order);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const navigate=useNavigate();
    const handleQuantityChange = (productId: string, quantity: number) => {
        console.log(quantity)
        setQuantities((prevQuantities:{ [key: string]: number }) => ({
            ...prevQuantities,
            [productId]: quantity !== undefined ? quantity : 1,
        }));
    };
    
    const onSubmit = () => {
        if(clientId){
            const items:OrderData = {
                clientId,
                productsList: productsList.map((product: ProductToBuyType) => ({
                    productId: product._id,
                    quantity: quantities[product._id],
                })),
            };
            console.log(items);
            dispatch(createOrder(items));
            
            
        }
    };
    useEffect(()=>{
        if(isOrderCreated){
            dispatch(cardActions.clearProductsList());
            dispatch(orderActions.setIsOrderCreated(false));
            dispatch(cardActions.setIsCardToggled(false));
            dispatch(cardActions.setClientId(null));
            navigate('/dashboard/orders');
        }
    },[isOrderCreated,dispatch])
  return (
    
    <Card sx={{ minWidth: 275,maxWidth:375, position: 'absolute', top: 80, right: 20 }}>
      <CardContent sx={{
        display:"flex",
        flexDirection:"column",
        justifyContent:"start",
        alignItems:"start",
        gap:"30px"
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            
            <Typography variant="h5" color="primary" component="div">
            Items to buy
            </Typography>
            <IconButton
              onClick={handleClose}
              color="primary"
              sx={{ padding: 0 }}
            >
              <HighlightOffOutlinedIcon />
            </IconButton>
            
        </Box>
        <Grid container spacing={0.5}>
            {productsList.map((product:ProductToBuyType)=>{
                return (
                    <Grid item xs={12} key={product._id}>
                    <Item>
                        <CardItem product={product}  onQuantityChange={handleQuantityChange} />
                    </Item>
                    </Grid>
                )
            })}
            
            </Grid>
      </CardContent>
      <CardActions sx={{display:"flex" , justifyContent:"end"}} >
        
      <Button variant="contained" onClick={onSubmit}>Contained</Button> 
      </CardActions>
    </Card>
  );
};

export default TopRightCard;