'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Controller } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

import {
    FORM_FIELD_INPUT_ROW,
    FormFieldControlBox,
    FormFieldEndSlot,
    FormFieldErrorMessage,
    FormFieldInputRow,
    FormFieldLabel,
    FormFieldStartSlot,
} from './components';
import type { IFormField } from './interface/field.interface';

export function FormField<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    rules,
    className,
    inputClassName,
    label,
    withLabel = false,
    startSlot,
    endSlot,
    passwordRevealToggle = false,
    id: idProp,
    ...rest
}: IFormField<TFieldValues, TName>) {
    const [showPassword, setShowPassword] = useState(false);
    const fieldId = idProp ?? `field-${String(name)}`;
    const resolvedEndSlot =
        endSlot ??
        (passwordRevealToggle ? (
            <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent group-focus-within:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                ) : (
                    <Eye className="h-4 w-4" />
                )}
            </button>
        ) : null);

    return (
        <div className="space-y-1.5">
            {withLabel && label ? (
                <FormFieldLabel htmlFor={fieldId}>{label}</FormFieldLabel>
            ) : null}

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <FormFieldControlBox invalid={!!error} className={className}>
                        <FormFieldInputRow>
                            {startSlot ? (
                                <FormFieldStartSlot>{startSlot}</FormFieldStartSlot>
                            ) : null}
                            <Input
                                id={fieldId}
                                {...field}
                                {...rest}
                                type={
                                    passwordRevealToggle
                                        ? showPassword
                                            ? 'text'
                                            : 'password'
                                        : rest.type
                                }
                                value={
                                    field.value === undefined ||
                                    field.value === null
                                        ? ''
                                        : String(field.value)
                                }
                                aria-invalid={!!error}
                                className={cn(
                                    FORM_FIELD_INPUT_ROW,
                                    'min-w-0 flex-1 border-0 bg-transparent px-0 py-0 shadow-none',
                                    'text-base leading-normal md:text-sm',
                                    'focus-visible:ring-0 focus-visible:ring-offset-0',
                                    resolvedEndSlot && 'pr-11',
                                    inputClassName,
                                )}
                            />
                            {resolvedEndSlot ? (
                                <FormFieldEndSlot>{resolvedEndSlot}</FormFieldEndSlot>
                            ) : null}
                        </FormFieldInputRow>
                        <FormFieldErrorMessage
                            message={
                                error
                                    ? (error.message?.toString() ??
                                      'Ошибка')
                                    : undefined
                            }
                        />
                    </FormFieldControlBox>
                )}
            />
        </div>
    );
}
