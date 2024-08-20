import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { couponActions } from '../../slices/couponSlice';
import { createCoupon, getAllCoupons } from '../../apiCalls/couponApiCall';
import { getAllProductsList } from '../../apiCalls/productApiCalls';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}


type Maybe<T> = T | null | undefined;
export interface CouponData {
  
  couponName: string,
  startDate: Date,
  expirationDate: Date,
  discountRate: number,
  type: string,
  product?:Maybe<string >,
  category?:Maybe<string >,
  subCategory?:Maybe<string >,
  
}
const types=['product','category','subCategory']
const AddCouponForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isCouponCreated} =useSelector((state:RootState)=> state.coupon)
  const {categories} =useSelector((state:RootState)=> state.category)
  const {productsList} =useSelector((state:RootState)=> state.product)
  const {subCategories} =useSelector((state:RootState)=> state.subCategory)

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    couponName: yup.string().required('Coupon Name is required').min(3).max(50).trim(),
    startDate: yup.date().required('Last Name  is required'),
    expirationDate: yup.date().required('Last Name  is required'),
    discountRate: yup.number().required('discountRate  is required'),
    type: yup.string().required('Type is required'),
    product: yup.string().notRequired().nullable(), 
    category: yup.string().notRequired().nullable(), 
    subCategory: yup.string().notRequired().nullable(),
  });

  const { register, handleSubmit, formState: { errors },reset,watch  } = useForm<CouponData>({
    resolver: yupResolver(formSchema),

  });

  const selectedType = watch('type');
 
  useEffect(()=>{
    dispatch(getAllProductsList());
  },[])

  const submitForm = (data: CouponData) => {
    const formattedData = {
        ...data,
        expirationDate: data.expirationDate,
        startDate: data.startDate,
      }
    dispatch(createCoupon(formattedData));   
    console.log(formattedData) 
  }

  useEffect(() => {
    if (isCouponCreated) {
      dispatch(getAllCoupons());
      handleClose();
      reset();
      dispatch(couponActions.setIsCouponCreated(false));
    }
  }, [isCouponCreated, dispatch, handleClose]);
 
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
    >
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <Box>Add New Coupon</Box>
        <Button
          onClick={handleClose}
          color="warning"
          sx={{ padding: 0 }}
        >
          <HighlightOffOutlined />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiTextField-root': {
              m: 1,
              width: fullScreen ? '100%' : 'calc(50% - 16px)',
              boxSizing: 'border-box',
            },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(submitForm)}
        >
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="couponName"
            label="Coupon Name"
            placeholder="Coupon Name"
            error={!!errors.couponName}
            helperText={errors.couponName?.message}
            {...register('couponName')}
          />
         <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="startDate"
            label="Start Date"
            type="date"
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            {...register('startDate')}
         />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="expirationDate"
            label="Expiration Date"
            type="date"
            error={!!errors.expirationDate}
            helperText={errors.expirationDate?.message}
            {...register('expirationDate')}
          />
          <TextField
            id="discountRate"
            label="Discount Rate"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.discountRate}
            helperText={errors.discountRate?.message}
            {...register('discountRate')}
          />
          <TextField
            id="type"
            select
            label="Select Type"
          
            defaultValue=''
            error={!!errors.type}
            helperText={errors.type?.message}
            {...register('type')}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          {selectedType === 'product' && (
            <TextField
              id="product"
              select
              label="Select Product"
              defaultValue=""
              error={!!errors.product}
              helperText={errors.product?.message}
              {...register('product')}
            >
              {productsList.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.productName}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedType === 'category' && (
            <TextField
              id="category"
              select
              label="Select Category"
              defaultValue=""
              error={!!errors.category}
              helperText={errors.category?.message}
              {...register('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedType === 'subCategory' && (
            <TextField
              id="subCategory"
              select
              label="Select SubCategory"
              defaultValue=""
              error={!!errors.subCategory}
              helperText={errors.subCategory?.message}
              {...register('subCategory')}
            >
              {subCategories.map((subCategory) => (
                <MenuItem key={subCategory._id} value={subCategory._id}>
                  {subCategory.subCategoryName}
                </MenuItem>
              ))}
            </TextField>
          )}

          
          
          
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="warning">
              Cancel
            </Button>
            <Button type="submit" color="success">
              Submit
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddCouponForm;