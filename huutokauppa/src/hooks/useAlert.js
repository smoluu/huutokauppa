// useAlert.js
"use client"
import { useContext } from 'react';
import AlertContext from '../context/AlertContext';

const useAlert = () => useContext(AlertContext);

export default useAlert;