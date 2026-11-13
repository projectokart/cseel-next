'use client';

import React from 'react';

export const DisabledRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default DisabledRouteGuard;
