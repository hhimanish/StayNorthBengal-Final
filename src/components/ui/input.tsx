// src/components/ui/input.tsx
import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export const Input = ({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={clsx('w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary', className)}
    {...rest}
  />
);
