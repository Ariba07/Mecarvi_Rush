import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectRole} from '../../slice/Slice';
import Orders from './Orders';
import ServiceProviderOrders from './ServiceProviderOrders';

const STORAGE_KEY = '@login_credentials'; // Match the key used in your Login component

const OrderIndex = () => {
  const reduxRole = useSelector(selectRole);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {role: storedRole} = JSON.parse(savedCredentials);
          if (storedRole) {
            setRole(storedRole);
          } else {
            setRole(reduxRole);
          }
        } else {
          setRole(reduxRole);
        }
      } catch (error) {
        console.log(
          'Error fetching role from AsyncStorage:',
          (error as any)?.message,
        );
        setRole(reduxRole);
      }
    };

    fetchRoleFromStorage();
  }, [reduxRole]);

  if (role === null) {
    return null;
  }

  return role !== 'admin' ? <Orders /> : <ServiceProviderOrders />;
};

export default OrderIndex;
