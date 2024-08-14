import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { createProduct, getAllProducts, getProductsNumber } from '../../apiCalls/productApiCalls';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { productActions } from '../../slices/productSlice';
import { CategoryState } from '../../slices/categorySlice';
import { SubCategoryState } from '../../slices/subCategorySlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  categories: CategoryState[],
  subCategories: SubCategoryState[]
}

const carrats = [
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '12', label: '12' },
  { value: '14', label: '14' },
  { value: '18', label: '18' },
  { value: '22', label: '22' },
  { value: '24', label: '24' },
];
const types=['Owner','Investor']
type Maybe<T> = T | null | undefined;

export interface ProductData {
  productName: string,
  description: string,
  carat: number,
  weight: number,
  purchasePrice: number,
  unitPrice: number,
  stockQuantity: number,
  category: string,
  subCategory: string,
  purchaseSource:string,
  investment?:Maybe<string >
}

const AddProductForm: React.FC<FormProps> = ({ handleClose, open, categories, subCategories }) => {
  const dispatch = useDispatch();
  const { isProductCreated } = useSelector((state: RootState) => state.product);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formSchema = yup.object({
    productName: yup.string().required('Product name is required').min(3).max(50).trim(),
    description: yup.string().required('Product description is required').min(3).max(100).trim(),
    carat: yup.number().required('Product carat is required'),
    weight: yup.number().required('Product weight is required'),
    purchasePrice: yup.number().required('Product purchase price is required'),
    unitPrice: yup.number().required('Product unit price is required'),
    stockQuantity: yup.number().required('Product stock quantity is required'),
    category: yup.string().required('Product category is required').notOneOf([''], 'Category is required'),
    subCategory: yup.string().required('Product sub-category is required').notOneOf([''], 'SubCategory is required'),
    purchaseSource:yup.string().required().oneOf(['Owner', 'Investor'], 'Purchase source must be either "Owner" or "Investor"'),
    investment:yup.string().notRequired().nullable()
  });

  const { register, handleSubmit, formState: { errors },reset,watch } = useForm<ProductData>({
    resolver: yupResolver(formSchema),
    
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const submitForm = (data: ProductData) => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    formData.append('productName', data.productName);
    formData.append('description', data.description);
    formData.append('carat', data.carat.toString());
    formData.append('weight', data.weight.toString());
    formData.append('purchasePrice', data.purchasePrice.toString());
    formData.append('unitPrice', data.unitPrice.toString());
    formData.append('stockQuantity', data.stockQuantity.toString());
    formData.append('category', data.category);
    formData.append('subCategory', data.subCategory);

    dispatch(createProduct(formData));
    reset();
  }
  const selectedPurchaseSource = watch('purchaseSource');
  useEffect(() => {
    if (isProductCreated) {
      dispatch(getProductsNumber());
      dispatch(getAllProducts(1))
      dispatch(productActions.setIsProductCreated(false));
      handleClose();
    }
  }, [isProductCreated, dispatch, handleClose]);
  
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
        <Box>Add New Product</Box>
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
            id="productName"
            label="Product Name"
            placeholder="Product Name"
            error={!!errors.productName}
            helperText={errors.productName?.message}
            {...register('productName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="description"
            label="Product Description"
            placeholder="Product Description"
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register('description')}
          />
          <TextField
            id="category"
            select
            label="Select Category"
          
            defaultValue=''
            error={!!errors.category}
            helperText={errors.category?.message}
            {...register('category')}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.categoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="subCategory"
            select
            defaultValue=''
            label="Select Sub-Category"
            error={!!errors.subCategory}
            helperText={errors.subCategory?.message}
            {...register('subCategory')}
          >
            {subCategories.map((subcat) => (
              <MenuItem key={subcat._id} value={subcat._id}>
                {subcat.subCategoryName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="carat"
            select
            label="Select Carat"
            defaultValue="14"
            error={!!errors.carat}
            helperText={errors.carat?.message}
            {...register('carat')}
          >
            {carrats.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="weight"
            label="Weight"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.weight}
            helperText={errors.weight?.message}
            {...register('weight')}
          />
          <TextField
            id="purchasePrice"
            label="Purchase Price"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.purchasePrice}
            helperText={errors.purchasePrice?.message}
            {...register('purchasePrice')}
          />
          <TextField
            id="unitPrice"
            label="Unit Price"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.unitPrice}
            helperText={errors.unitPrice?.message}
            {...register('unitPrice')}
          />
          <TextField
            id="stockQuantity"
            label="Stock Quantity"
            type="number"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 0 }}
            error={!!errors.stockQuantity}
            helperText={errors.stockQuantity?.message}
            {...register('stockQuantity')}
          />
          <TextField
            id="purchaseSource"
            select
            label="Select Purchase Source"
          
            defaultValue=''
            error={!!errors.purchaseSource}
            helperText={errors.purchaseSource?.message}
            {...register('purchaseSource')}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          {selectedPurchaseSource === 'Investor' && (
            <TextField
              id="investment"
              select
              label="Select Investment"
              defaultValue=""
              error={!!errors.investment}
              helperText={errors.investment?.message}
              {...register('investment')}
            >
              {investments.map((investment) => (
                <MenuItem key={investment._id} value={investment._id}>
                  {investment.investmentName}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="start" gap="10px">
            <Typography>
              Upload Product Photo
            </Typography>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </Box>
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

export default AddProductForm;