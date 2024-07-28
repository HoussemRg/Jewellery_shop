import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect } from 'react'
import { FilterAltOutlined } from '@mui/icons-material';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useDispatch } from '../hooks';
import { getFilteredProducts } from '../apiCalls/productApiCalls';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const carrats = [
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '18', label: '18' },
    { value: '22', label: '22' },
    { value: '24', label: '24' },
];

export interface FilterProductData {
    productName?: string | null;
    carat?: number | null;
    weight?: number | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    stockQuantity?: number | null;
    category?: string | null;
    subCategory?: string | null;
}

interface FilterProductsProps{
  handleSetFiltering:()=> void,
  handleClearFiltering:()=>void
}

const FilterProducts: React.FC<FilterProductsProps> = ({handleSetFiltering,handleClearFiltering}) => {
    const { categories } = useSelector((state: RootState) => state.category);
    const { subCategories } = useSelector((state: RootState) => state.subCategory);
    const dispatch=useDispatch();
    const formSchema = yup.object().shape({
      productName: yup.string().notRequired(),
      carat: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? null : value)
          .notRequired()
          .nullable(),
      weight: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? null : value)
          .notRequired()
          .nullable(),
      minPrice: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? null : value)
          .notRequired()
          .nullable(),
      maxPrice: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? null : value)
          .notRequired()
          .nullable(),
      stockQuantity: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? null : value)
          .notRequired()
          .nullable(),
      category: yup.string().notRequired().nullable(),
      subCategory: yup.string().notRequired().nullable()
  });
  const {filteredProducts} =useSelector((state:RootState)=>state.product);
    const { register, handleSubmit, formState: { errors } } = useForm<FilterProductData>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            productName: null,
            carat: null,
            weight: null,
            minPrice: null,
            maxPrice: null,
            stockQuantity: null,
            category: null,
            subCategory: null,
        }
    });

    const submitForm = (data: FilterProductData) => {
      
        const validData: Partial<FilterProductData>={}
        Object.entries(data).forEach(([key,value])=>{
          if(value !== null && value!== ''){
            validData[key as keyof(FilterProductData)]=value;
          }
        })
        
        console.log(validData)
        dispatch(getFilteredProducts(validData))
    }
    useEffect(()=>{
      if(filteredProducts && filteredProducts?.length>0){
        handleSetFiltering();
      }
    },[filteredProducts]);
    return (
        <Box>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Box display="flex" gap="10px">
                        <FilterAltOutlined />
                        <Typography>Filter</Typography>
                        <Button onClick={handleClearFiltering}>clear</Button>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container component="form" noValidate autoComplete="off" spacing={3} onSubmit={handleSubmit(submitForm)}>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    InputLabelProps={{ shrink: true }}
                                    id="productName"
                                    label="Product Name"
                                    placeholder="Product Name"
                                    error={!!errors.productName}
                                    helperText={errors.productName?.message}
                                    {...register('productName')}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    id="category"
                                    select
                                    label="Select Category"
                                    sx={{ width: "100%" }}
                                    defaultValue=""
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                    {...register('category')}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat.categoryName}>
                                            {cat.categoryName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    id="subCategory"
                                    sx={{ width: "100%" }}
                                    select
                                    defaultValue=""
                                    label="Select Sub-Category"
                                    error={!!errors.subCategory}
                                    helperText={errors.subCategory?.message}
                                    {...register('subCategory')}
                                >
                                    {subCategories.map((subcat) => (
                                        <MenuItem key={subcat._id} value={subcat.subCategoryName}>
                                            {subcat.subCategoryName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="carat"
                                    select
                                    label="Select Carat"
                                    defaultValue=""
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
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="weight"
                                    label="Weight"
                                    type="number"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.weight}
                                    helperText={errors.weight?.message}
                                    {...register('weight')}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="minPrice"
                                    label="Min Price"
                                    type="number"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.minPrice}
                                    helperText={errors.minPrice?.message}
                                    {...register('minPrice')}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="maxPrice"
                                    label="Max Price"
                                    type="number"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.maxPrice}
                                    helperText={errors.maxPrice?.message}
                                    {...register('maxPrice')}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Item>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="stockQuantity"
                                    label="Min Stock Quantity"
                                    type="number"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.stockQuantity}
                                    helperText={errors.stockQuantity?.message}
                                    {...register('stockQuantity')}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={12}>
                            <Item>
                                <Button type="submit" color="success">
                                    Submit
                                </Button>
                            </Item>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Box>
    )
}

export default FilterProducts;
