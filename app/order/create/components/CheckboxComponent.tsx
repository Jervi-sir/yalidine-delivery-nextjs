import { Checkbox } from '@/components/ui/checkbox';
import React from 'react'; // We don't need useState anymore

export const CheckboxComponent = ({
    label,
    onChange,
    checked, // Rename initialValue to checked
    error,
}) => {
    const handleChange = (checked) => { // shadcn Checkbox provides checked directly
        if (onChange) {
            onChange(checked);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={label}
                checked={checked}
                onCheckedChange={handleChange} // Use onCheckedChange instead of onChange
            />
            <label
                htmlFor={label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </label>
        </div>
    );
};