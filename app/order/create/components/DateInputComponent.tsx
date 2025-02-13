import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover,  PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/ui/input-error';

export const DateInputComponent = ({
  error, label, value, 

}) => {
  return (
    <div className='flex items-center gap-2 border border-input rounded-md'>
      <Label className='pl-2'>{ label }</Label>
      <Separator orientation="vertical" className='h-5 w-0.5' />
      <Popover>
        <PopoverTrigger asChild className='border-none'>
          <Button variant="outline" className="w-full text-left">
            <CalendarIcon className="mr-2" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {/* <PopoverContent align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(e) => handleOnSelect(format(e, 'yyyy-MM-dd'))}
            initialFocus
          />
        </PopoverContent> */}
      </Popover>
      <InputError message={error} className="mt-2" />
    </div>
  );
};