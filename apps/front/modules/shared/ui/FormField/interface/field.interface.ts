import type { ComponentProps, ReactNode } from 'react';
import type {
    Control,
    FieldPath,
    FieldValues,
    RegisterOptions,
} from 'react-hook-form';

export type IFormField<
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
    ComponentProps<'input'>,
    'name' | 'value' | 'onChange' | 'onBlur' | 'ref' | 'className'
> & {
    control: Control<TFieldValues>;
    name: TName;
    rules?: Omit<
        RegisterOptions<TFieldValues, TName>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
    >;
    /** Подпись над полем */
    label?: string;
    /** Показывать ли подпись над полем */
    withLabel?: boolean;
    /** Обёртка (рамка как в мобильном Field) */
    className?: string;
    inputClassName?: string;
    /** Иконка слева (user / lock и т.д.) — серая, в фокусе поля становится primary */
    startSlot?: ReactNode;
    /** Например кнопка показа пароля — справа */
    endSlot?: ReactNode;
};
