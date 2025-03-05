import React from 'react';
import {useSelector} from 'react-redux';
import {selectRole} from '../../slice/Slice';
import Dashboard from './Dashboard';
import ServiceProviderDashboard from './ServiceProviderDashboard';

const Index = () => {
  const role = useSelector(selectRole);

  return role !== 'admin' ? <Dashboard /> : <ServiceProviderDashboard />;
};

export default Index;
