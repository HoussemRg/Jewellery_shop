import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createSubCategory, getAllSubCategories } from '../../apiCalls/subCategoryApiCalls';
import { subCategoryActions } from '../../slices/subCategorySlice';

export interface FormProps {
  handleClose: () => void,
  open: boolean,
  
}



export interface SubCategoryData {
  subCategoryName: string,
  subCategoryDescription: string,
  
}

const AddSubCategoryForm: React.FC<FormProps> = ({ handleClose, open }) => {
  const dispatch = useDispatch();
  const {isSubCategoryCreated} =useSelector((state:RootState)=> state.subCategory)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const formSchema = yup.object({
    subCategoryName: yup.string().required('Sub-Category Name is required').min(3).max(50).trim(),
    subCategoryDescription: yup.string().required('Description  is required').min(5).trim(),    

   
  });

  const { register, handleSubmit, formState: { errors },reset } = useForm<SubCategoryData>({
    resolver: yupResolver(formSchema),

  });
 
 


  const submitForm = (data: SubCategoryData) => {
    dispatch(createSubCategory(data));        
  }

  useEffect(() => {
    if (isSubCategoryCreated) {
      dispatch(getAllSubCategories());
      handleClose();
      reset();
      dispatch(subCategoryActions.setIsSubCategoryCreated(false));
    }
  }, [isSubCategoryCreated, dispatch, handleClose]);
 
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
        <Box>Add New Sub-Category</Box>
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
            id="subCategoryName"
            label="Sub-Category Name"
            placeholder="Sub-Category Name"
            error={!!errors.subCategoryName}
            helperText={errors.subCategoryName?.message}
            {...register('subCategoryName')}
          />
          <TextField
            required
            InputLabelProps={{ shrink: true }}
            id="subCategoryDescription"
            label="Description"
            placeholder="Description"
            error={!!errors.subCategoryDescription}
            helperText={errors.subCategoryDescription?.message}
            {...register('subCategoryDescription')}
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

export default AddSubCategoryForm;