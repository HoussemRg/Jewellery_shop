import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { FilterAltOutlined } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
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
    backgroundColor: theme.palette.background.paper,
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
    categoryName?: string | null;
    subCategoryName?: string | null;
}

interface FilterProductsProps {
  handleSetFiltering: () => void,
  handleClearFiltering: () => void,
  currentPage: number,
  filtered: boolean
}

const FilterProducts: React.FC<FilterProductsProps> = ({ handleSetFiltering, handleClearFiltering, currentPage, filtered }) => {
    const { categories } = useSelector((state: RootState) => state.category);
    const { subCategories } = useSelector((state: RootState) => state.subCategory);
    const [validData, setValidData] = useState<FilterProductData>({});
    const [expanded, setExpanded] = useState<boolean>(false); // State to manage accordion expansion
    const dispatch = useDispatch();

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

    const { filteredProducts } = useSelector((state: RootState) => state.product);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FilterProductData>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            productName: null,
            carat: null,
            weight: null,
            minPrice: null,
            maxPrice: null,
            stockQuantity: null,
            categoryName: null,
            subCategoryName: null,
        }
    });

    const submitForm = (data: FilterProductData) => {
        const validDataForm: FilterProductData = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as keyof FilterProductData] = value;
            }
        });
        dispatch(getFilteredProducts(validDataForm, currentPage));
        setValidData(validDataForm);
        handleSetFiltering();
        setExpanded(false); // Collapse the accordion after submission
        reset();
    };

    useEffect(() => {
        if (filtered && filteredProducts.length > 0) {
            dispatch(getFilteredProducts(validData, currentPage));
        }
    }, [currentPage]);

    return (
        <Box>
            <Accordion expanded={expanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    onClick={() => setExpanded(!expanded)} // Toggle expansion on click
                >
                    <Box display="flex" gap="10px" justifyContent="space-between" alignItems="center">
                        <FilterAltOutlined />
                        <Typography>Filter</Typography>
                        {filtered && <IconButton aria-label="clear" onClick={handleClearFiltering}>
                            <ClearIcon />
                        </IconButton>}                        
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
                                    error={!!errors.categoryName}
                                    helperText={errors.categoryName?.message}
                                    {...register('categoryName')}
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
                                    error={!!errors.subCategoryName}
                                    helperText={errors.subCategoryName?.message}
                                    {...register('subCategoryName')}
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
