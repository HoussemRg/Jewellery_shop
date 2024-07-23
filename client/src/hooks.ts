import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch } from './store'; // Adjust the path as necessary

export const useDispatch = () => useReduxDispatch<AppDispatch>();