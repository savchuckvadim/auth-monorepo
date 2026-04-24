'use client';

import { cn } from '@workspace/ui/lib/utils';

import { evaluatePasswordStrength } from '../lib/utils/password-strength.util';

interface PasswordStrengthMeterProps {
    value: string;
    className?: string;
}

/**
 * Маленький индикатор «4 сегмента + подпись» — оценка пароля по
 * эвристике из `password-strength.util.ts`. Сознательно не показываем
 * оценку, если поле ещё не тронуто (`score === 0`), чтобы не
 * перегружать форму.
 */
export function PasswordStrengthMeter({ value, className }: PasswordStrengthMeterProps) {
    const strength = evaluatePasswordStrength(value);

    if (strength.score === 0) return null;

    return (
        <div className={cn('space-y-1.5', className)}>
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                    <span
                        key={segment}
                        className={cn(
                            'h-1.5 flex-1 rounded-full transition-colors',
                            segment <= strength.filled ? strength.colorClass : 'bg-muted',
                        )}
                    />
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-xs">
                <span className="font-medium text-foreground">{strength.label}</span>
                {strength.hint ? (
                    <span className="text-muted-foreground">{strength.hint}</span>
                ) : null}
            </div>
        </div>
    );
}
