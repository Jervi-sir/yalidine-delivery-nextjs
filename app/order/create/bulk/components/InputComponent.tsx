
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const InputComponent = ({
  error, value, handleOnChange,
  label, placeholder,
  type = 'text',
  disabled = false,
  minNumber = 0,
  ...props
}) => {
  return (
    <div className='flex flex-col min-w-[100px]'>
      <div className='flex items-center gap-2 border border-input rounded-md'>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleOnChange}
          type={type}
          className='flex p-0 px-1 items-center gap-2 border border-input rounded-md'
          min={type === 'number' ? minNumber : undefined}
          disabled={disabled}
          {...props}
        />
      </div>
      <InputError message={error} className="ml-auto mr-2" />
    </div>
  );
};