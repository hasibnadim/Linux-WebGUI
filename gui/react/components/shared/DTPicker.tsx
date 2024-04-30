import { 
  FormControl, 
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { focusNext } from "@/lib/focusNext";
import { cn } from "@/lib/utils";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn, 
} from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar"; 
import { format } from "date-fns";
import { CalendarIcon, LocateFixed } from "lucide-react";
import { useEffect, useState } from "react"; 
import { DateRange } from "react-day-picker";
interface IProps {
  label: string;
  className?: string;
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  field: ControllerRenderProps<FieldValues, any>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
  max?: Date; 
}

const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DTPicker = (props: IProps) => {
  const today = new Date();
  const selectedDate = new Date(props.field.value);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  function calcYear(i: number) {
    return -(i - today.getFullYear() - 2);
  }
  return (
    <FormItem className={cn("w-full gap-1", props.className)}>
      <div className="flex items-center justify-between w-full h-4">
        <FormLabel className="">{props.label}</FormLabel>
        <FormMessage />
      </div>
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <FormControl className="w-full">
            <p
              className={cn(
                "w-full pl-3 text-left font-normal inline-flex px-5 py-1.5 border cursor-pointer  items-center justify-center whitespace-nowrap text-sm outline-none",
                !props.field.value && "text-muted-foreground"
              )}
              onKeyDown={focusNext}
              onClick={() => {
                if (props.field.value) {
                  setMonth(selectedDate.getMonth());
                  setYear(selectedDate.getFullYear());
                } else {
                  setMonth(today.getMonth());
                  setYear(today.getFullYear());
                }
              }}
            >
              {props.field.value ? (
                format(props.field.value, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </p>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            month={new Date(year, month)}
            mode={ "single"}
            selected={props.field.value}
            onSelect={props.field.onChange}
            disabled={(date) => {
              if (props.max && date > props.max) {
                return true;
              } else {
                return date < new Date("1900-01-01");
              }
            }}
            initialFocus
            onMonthChange={(e) => {
              setMonth(e.getMonth());
              setYear(e.getFullYear());
            }}
            footer={
              <div className="border-t pt-2 flex justify-between items-center">
                <select
                  defaultValue={year}
                  className="outline-none border border-transparent rounded-sm hover:border-blue-200"
                  onChange={(e) => setYear(Number(e.currentTarget.value))}
                >
                  {Array.from({ length: today.getFullYear()-1968 /*start form 1971*/ }).map((_, i) => (
                    <option value={calcYear(i)} key={i}>
                      {calcYear(i)}
                    </option>
                  ))}
                </select>
                <select
                  defaultValue={month}
                  className="outline-none border border-transparent rounded-sm hover:border-blue-200"
                  onChange={(e) => setMonth(Number(e.currentTarget.value))}
                >
                  {monthList.map((m, i) => (
                    <option value={i} key={i}>
                      {m}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setMonth(today.getMonth());
                    setYear(today.getFullYear());
                    props.field.onChange(today);
                  }}
                >
                  <LocateFixed
                    size={20}
                    className="text-stone-900 hover:text-blue-500"
                  />
                </button>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};

interface ISAProps {
  label?: string;
  defaultValue?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

const Range = (props: ISAProps) => {
  const today = new Date();
  const selectedDate = new Date(props.defaultValue?.from || today);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [base, setBase] = useState<DateRange | undefined>(props.defaultValue);
  function calcYear(i: number) {
    return -(i - today.getFullYear() - 2);
  }
  useEffect(() => {
    props.onChange?.({
      from: base?.from,
      to: base?.to || base?.from,
    });
  }, [base]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <p
          className={cn(
            "text-left font-normal inline-flex gap-2 px-2 py-1.5 border cursor-pointer  items-center justify-start whitespace-nowrap text-sm outline-none min-w-[200px]",
            !base && "text-muted-foreground"
          )}
          onKeyDown={focusNext}
          onClick={() => {
            if (props.defaultValue?.from) {
              setMonth(selectedDate.getMonth());
              setYear(selectedDate.getFullYear());
            } else {
              setMonth(today.getMonth());
              setYear(today.getFullYear());
            }
          }}
        >
          <CalendarIcon className="h-4 w-4 opacity-50" />
          {base?.from ? (
            `${format(base?.from, "dd.MMM.yyyy")} - ${format(
              base.to || base.from,
              "dd.MMM.yyyy"
            )}`
          ) : (
            <span>Pick a date</span>
          )}
        </p>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          month={new Date(year, month)}
          mode="range"
          selected={base}
          onSelect={setBase}
          disabled={(date) => {
            // if (props.max && date > props.max) {
            //   return true;
            // } else {
            return date < new Date("1900-01-01");
            // }
          }}
          initialFocus
          onMonthChange={(e) => {
            setMonth(e.getMonth());
            setYear(e.getFullYear());
          }}
          footer={
            <div className="border-t pt-2 flex justify-between items-center">
              <select
                defaultValue={year}
                className="outline-none border border-transparent rounded-sm hover:border-blue-200"
                onChange={(e) => setYear(Number(e.currentTarget.value))}
              >
                {Array.from({ length: 35 }).map((_, i) => (
                  <option value={calcYear(i)} key={i}>
                    {calcYear(i)}
                  </option>
                ))}
              </select>
              <select
                defaultValue={month}
                className="outline-none border border-transparent rounded-sm hover:border-blue-200"
                onChange={(e) => setMonth(Number(e.currentTarget.value))}
              >
                {monthList.map((m, i) => (
                  <option value={i} key={i}>
                    {m}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setMonth(today.getMonth());
                  setYear(today.getFullYear());
                  setBase({
                    from: today,
                    to: today,
                  });
                }}
              >
                <LocateFixed
                  size={20}
                  className="text-stone-900 hover:text-blue-500"
                />
              </button>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};
DTPicker.Range = Range;
export default DTPicker;
