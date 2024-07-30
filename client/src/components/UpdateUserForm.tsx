import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react'
import * as yup from 'yup'
interface AddUserProps{
    handleClose: () => void,
    open: boolean,
}

const UpdateUserForm:React.FC<AddUserProps> = ({handleClose,open}) => {
    const theme=useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const formSchema = yup.object({
        firstName: yup.string().required('Product name is required'),
        lastName: yup.string().required('Product description is required'),
        cin: yup.number().required('Product carat is required'),
        email: yup.number().required('Product weight is required'),
        address: yup.number().required('Product purchase price is required'),
        password: yup.string().required('Product unit price is required'),
        stockQuantity: yup.number().required('Product stock quantity is required'),
        category: yup.string().required('Product category is required'),
        subCategory: yup.string().required('Product sub-category is required')
    });
    {/*
        const {currentPage}=useSelector((state:RootState)=>state.product)
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ProductData>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            productName,
            description,
            carat,
            weight,
            purchasePrice,
            unitPrice,
            stockQuantity,
            category: category?._id,
            subCategory: subCategory?._id
        }
    });

    const watchCategory = watch("category");
    const watchSubCategory = watch("subCategory");
    const watchCarat = watch("carat");

    const submitForm = (data: ProductData) => {
        const formData = new FormData();
        formData.append('productName', data.productName);
        formData.append('description', data.description);
        formData.append('carat', data.carat.toString());
        formData.append('weight', data.weight.toString());
        formData.append('purchasePrice', data.purchasePrice.toString());
        formData.append('unitPrice', data.unitPrice.toString());
        formData.append('stockQuantity', data.stockQuantity.toString());
        formData.append('category', data.category);
        formData.append('subCategory', data.subCategory);
        dispatch(updateProduct(formData, _id));
    };

    useEffect(() => {
        if (isProductUpdated) {
            dispatch(getAllProducts(currentPage));
            dispatch(productActions.setIsProductUpdated(false));
            handleCloseEditForm();
        }
    }, [isProductUpdated, dispatch, handleCloseEditForm]);

    return (
        <Dialog
            onClose={handleCloseEditForm}
            open={open}
            fullWidth
            maxWidth="sm"
            fullScreen={fullScreen}
            sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
        >
            <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                <Box>Update Product</Box>
                <Button onClick={handleCloseEditForm} color="warning" sx={{ padding: 0 }}>
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
                        value={watchCategory}
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
                        value={watchSubCategory}
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
                        value={watchCarat}
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

                    <DialogActions>
                        <Button autoFocus onClick={handleCloseEditForm} color="warning">
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

    */ }
    return 
    <div>
        
    </div>
    
}

export default UpdateUserForm
