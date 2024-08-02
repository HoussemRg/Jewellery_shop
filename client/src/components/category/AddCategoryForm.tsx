import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createCategory, getAllCategories } from '../../apiCalls/categoryApiCalls';
import { categoryActions } from '../../slices/categorySlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface CategoryData {
  categoryName: string,
  categoryDescription: string,
  
}

const AddCategoryForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isCategoryCreated} =useSelector((state:RootState)=> state.category)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    categoryName: yup.string().required('Category Name is required').min(3).max(50).trim(),
    categoryDescription: yup.string().required('Description  is required').min(5).trim(),    

   
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<CategoryData>({
    resolver: yupResolver(formSchema),

  });
 
 


  const submitForm = (data: CategoryData) => {
    dispatch(createCategory(data));        
  }

  useEffect(() => {
    if (isCategoryCreated) {
      dispatch(getAllCategories());
      handleClose();
      reset();
      dispatch(categoryActions.setIsCategoryCreated(false));
    }
  }, [isCategoryCreated, dispatch, handleClose]);
 
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
        <Box>Add New Category</Box>
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
            id="categoryName"
            label="Category Name"
            placeholder="Category Name"
            error={!!errors.categoryName}
            helperText={errors.categoryName?.message}
            {...register('categoryName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="categoryDescription"
            label="Description"
            placeholder="Description"
            error={!!errors.categoryDescription}
            helperText={errors.categoryDescription?.message}
            {...register('categoryDescription')}
          />
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

export default AddCategoryForm;