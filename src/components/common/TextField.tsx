import * as React from 'react';

import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type TextFieldBaseProps = {
  helpText?: string;
  error?: boolean;
  description?: boolean;
  containerClassName?: string;
};

type InputTextFieldProps = TextFieldBaseProps &
  Omit<React.ComponentProps<'input'>, 'aria-invalid'> & {
    variant?: 'input';
  };

type TextareaTextFieldProps = TextFieldBaseProps &
  Omit<React.ComponentProps<'textarea'>, 'aria-invalid'> & {
    variant: 'textarea';
  };

type DateTextFieldProps = TextFieldBaseProps &
  Omit<React.ComponentProps<'button'>, 'aria-invalid' | 'children'> & {
    variant: 'date';
    value?: string;
    placeholder?: string;
  };

export type TextFieldProps = InputTextFieldProps | TextareaTextFieldProps | DateTextFieldProps;

export function TextField(props: TextFieldProps) {
  const { helpText, error = false, description = true, containerClassName } = props;
  const showDescription = description && helpText;

  return (
    <div className={cn('flex w-full flex-col items-start gap-1.5', containerClassName)}>
      {renderField(props)}
      {showDescription && (
        <p className={cn('w-full caption-bold', error ? 'text-red-700' : 'text-quaternary')}>
          {helpText}
        </p>
      )}
    </div>
  );
}

function renderField(props: TextFieldProps) {
  const { error = false } = props;

  if (props.variant === 'textarea') {
    const textareaProps = omitProps(props, [
      'variant',
      'helpText',
      'error',
      'description',
      'containerClassName',
    ]);

    return <Textarea aria-invalid={error || undefined} {...textareaProps} />;
  }

  if (props.variant === 'date') {
    const { value, placeholder = '0000년 00월 00일', className, disabled } = props;
    const buttonProps = omitProps(props, [
      'variant',
      'helpText',
      'error',
      'description',
      'containerClassName',
      'value',
      'placeholder',
      'className',
      'disabled',
    ]);

    return (
      <button
        type="button"
        data-invalid={error || undefined}
        disabled={disabled}
        className={cn(
          'flex h-[54px] w-full items-center gap-2 rounded-lg border-[1.5px] border-solid border-border-bold bg-background-w px-4 py-4 body-2-regular text-quaternary transition-colors outline-none focus-visible:border-mint-main focus-visible:bg-mint-50/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-background-default data-[invalid=true]:border-red-700 data-[invalid=true]:bg-red-50/40',
          className,
        )}
        {...buttonProps}
      >
        <CalendarIcon className="size-6 shrink-0 text-quaternary" />
        <span className="truncate">{value || placeholder}</span>
      </button>
    );
  }

  const inputProps = omitProps(props, [
    'variant',
    'helpText',
    'error',
    'description',
    'containerClassName',
  ]);

  return <Input aria-invalid={error || undefined} {...inputProps} />;
}

function omitProps<T extends object, K extends keyof T>(props: T, propNames: readonly K[]) {
  const result = { ...props };

  for (const propName of propNames) {
    delete result[propName];
  }

  return result as Omit<T, K>;
}
