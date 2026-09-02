// src/components/ui/card.tsx
import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={clsx('bg-white rounded-xl shadow-sm border border-gray-200', className)}>{children}</div>
);
