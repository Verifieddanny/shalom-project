'use client';

import { useEffect } from 'react';
import { registerServiceWorker} from "../service/service-worker-registration"

const RegisterServiceWorker = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
};

export default RegisterServiceWorker;