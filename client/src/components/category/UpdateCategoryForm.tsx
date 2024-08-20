import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { categoryActions, CategoryState } from '../../slices/categorySlice';
import { updateCategory } from '../../apiCalls/categoryApiCalls';
interface UpdateCategoryProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    categoryToUpdate:CategoryState,

}
export interface CategoryEditData{
    categoryName: string,
    categoryDescription: string,  
}

const UpdateCategoryForm: React.FC<UpdateCategoryProps> = ({ handleCloseEditForm, opendEditForm, categoryToUpdate }) => {
    const theme = useTheme();
    const {isCategoryUpdated} = useSelector((state:RootState)=> state.category)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
      categoryName: yup.string().min(3).max(50).trim().required(),
      categoryDescription: yup.string().min(5).trim().required(),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<CategoryEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        categoryName: categoryToUpdate.categoryName,
        categoryDescription: categoryToUpdate.categoryDescription,
        
      }
    });
    
    const submitForm = (data: CategoryEditData) => {
        const validDataForm: Partial<CategoryEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof CategoryEditData] = value;
            }
        });
        dispatch(updateCategory(validDataForm,categoryToUpdate._id))
        
    }
    useEffect(()=>{
      if(isCategoryUpdated){
        handleCloseEditForm();
        dispatch(categoryActions.setIsCategoryUpdated(false))
           
    }
    },[isCategoryUpdated])
    return (
      <Dialog
        onClose={handleCloseEditForm}
        open={opendEditForm}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        sx={{ '& .MuiDialog-paper': { overflowX: 'hidden' } }}
      >
        <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
          <Box>Update Category</Box>
          <Button
            onClick={handleCloseEditForm}
            color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
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
              InputLabelProps={{ shrink: true }}
              id="categoryName"
              label="Category Name"
              placeholder="Category Name"
              error={!!errors.categoryName}
              helperText={errors.categoryName?.message}
              {...register('categoryName')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="categoryDescription"
              label="Description "
              placeholder="Description"
              error={!!errors.categoryDescription}
              helperText={errors.categoryDescription?.message}
              {...register('categoryDescription')}
            />
            
            <DialogActions>
              <Button autoFocus onClick={handleCloseEditForm} color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
                Cancel
              </Button>
              <Button type="submit" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}>
                Submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default UpdateCategoryForm;
