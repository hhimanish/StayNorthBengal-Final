// src/components/ui/button.tsx
import { motion, HTMLMotionProps } from 'framer-motion';
import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ children, variant = 'primary', className, ...rest }: ButtonProps) => {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
  };
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={clsx(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
};
