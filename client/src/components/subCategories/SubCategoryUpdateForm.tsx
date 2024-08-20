import { yupResolver } from '@hookform/resolvers/yup';
import { HighlightOffOutlined } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { useDispatch } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { subCategoryActions, SubCategoryState } from '../../slices/subCategorySlice';
import { updateSubCategory } from '../../apiCalls/subCategoryApiCalls';
interface UpdateSubCategoryProps{
    handleCloseEditForm: () => void,
    opendEditForm: boolean,
    subCategoryToUpdate:SubCategoryState,

}
export interface SubCategoryEditData{
    subCategoryName: string,
    subCategoryDescription: string,  
}

const UpdateSubCategoryForm: React.FC<UpdateSubCategoryProps> = ({ handleCloseEditForm, opendEditForm, subCategoryToUpdate }) => {
    const theme = useTheme();
    const {isSubCategoryUpdated} = useSelector((state:RootState)=> state.subCategory)
    const dispatch=useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    
    const formSchema = yup.object({
      subCategoryName: yup.string().min(3).max(50).trim().required(),
      subCategoryDescription: yup.string().min(5).trim().required(),
     
    });
    
    const { register, handleSubmit, formState: { errors } } = useForm<SubCategoryEditData>({
      resolver: yupResolver(formSchema),
      defaultValues: {
        subCategoryName: subCategoryToUpdate.subCategoryName,
        subCategoryDescription: subCategoryToUpdate.subCategoryDescription,
        
      }
    });
    
    const submitForm = (data: SubCategoryEditData) => {
        const validDataForm: Partial<SubCategoryEditData> = {};
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                validDataForm[key as  keyof SubCategoryEditData] = value;
            }
        });
        dispatch(updateSubCategory(validDataForm,subCategoryToUpdate._id))
        
    }
    useEffect(()=>{
      if(isSubCategoryUpdated){
        handleCloseEditForm();
        dispatch(subCategoryActions.setIsSubCategoryUpdated(false))
           
    }
    },[isSubCategoryUpdated])
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
              id="subCategoryName"
              label="Category Name"
              placeholder="Category Name"
              error={!!errors.subCategoryName}
              helperText={errors.subCategoryName?.message}
              {...register('subCategoryName')}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="subCategoryDescription"
              label="Description "
              placeholder="Description"
              error={!!errors.subCategoryDescription}
              helperText={errors.subCategoryDescription?.message}
              {...register('subCategoryDescription')}
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
  
  export default UpdateSubCategoryForm;
