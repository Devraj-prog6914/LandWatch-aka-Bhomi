import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PortalGateway } from '../components/PortalGateway';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PortalGateway
      initialStage="GATEWAY"
      onAuthenticated={() => {
        navigate('/');
      }}
    />
  );
};

