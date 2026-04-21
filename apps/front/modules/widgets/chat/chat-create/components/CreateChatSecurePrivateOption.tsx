'use client';

import { Checkbox } from '@workspace/ui/components/checkbox';
import { Label } from '@workspace/ui/components/label';

type CreateChatSecurePrivateOptionProps = {
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
};

export function CreateChatSecurePrivateOption({
    checked,
    onCheckedChange,
}: CreateChatSecurePrivateOptionProps) {
    return (
        <div className="mb-4 flex items-center gap-2">
            <Checkbox
                id="secure-private-chat"
                checked={checked}
                onCheckedChange={(v) => onCheckedChange(v === true)}
            />
            <Label
                htmlFor="secure-private-chat"
                className="cursor-pointer text-sm font-normal"
            >
                Защищённый диалог (Signal E2EE)
            </Label>
        </div>
    );
}
