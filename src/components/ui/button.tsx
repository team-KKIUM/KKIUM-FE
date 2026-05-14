import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none enabled:cursor-pointer focus-visible:shadow-focus-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-6',
  {
    variants: {
      variant: {
        default:
          'bg-gray-main text-on-fill hover:bg-gray-800 hover:shadow-sm focus-visible:bg-background-b focus-visible:text-on-fill disabled:bg-gray-200 disabled:text-gray-400',
        secondary:
          'bg-gray-200 text-tertiary hover:bg-gray-300 hover:shadow-sm focus-visible:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
        fill: 'bg-mint-50 text-mint-600 hover:bg-mint-100 hover:shadow-sm focus-visible:bg-mint-50 disabled:bg-gray-200 disabled:text-gray-400',
        line: 'border-border-default bg-background-w text-tertiary hover:border-border-bold hover:bg-background-default hover:shadow-sm focus-visible:border-border-default focus-visible:bg-background-w disabled:border-border-thick disabled:bg-gray-100 disabled:text-gray-400',
      },
      size: {
        default: 'body-1-bold h-10 px-3 py-1',
        medium: 'body-1-bold h-9 py-0.5 pr-2.5 pl-1',
        small: 'body-3-bold h-8 py-1 pr-2.5 pl-1',
        icon: 'size-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

function Button({
  children,
  className,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {!asChild && leftIcon && <ButtonIcon size={size}>{leftIcon}</ButtonIcon>}
      {children}
      {!asChild && rightIcon && <ButtonIcon size={size}>{rightIcon}</ButtonIcon>}
    </Comp>
  );
}

function ButtonIcon({
  children,
  size,
}: {
  children: React.ReactNode;
  size: VariantProps<typeof buttonVariants>['size'];
}) {
  return (
    <span
      data-slot="button-icon"
      className={cn(
        'flex shrink-0 items-center justify-center [&_svg]:size-6',
        size === 'small' ? 'size-6' : 'size-8',
      )}
    >
      {children}
    </span>
  );
}

export { Button, buttonVariants };
