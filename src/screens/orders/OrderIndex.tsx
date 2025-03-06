import React from 'react';
import {useSelector} from 'react-redux';
import {selectRole} from '../../slice/Slice';
import Orders from './Orders';
import ServiceProviderOrders from './ServiceProviderOrders';

const OrderIndex = () => {
  const role = useSelector(selectRole);

  return role === 'admin' ? <Orders /> : <ServiceProviderOrders />;
};

export default OrderIndex;
