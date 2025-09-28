
import { useMemo, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { id } from "date-fns/locale";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfDay,
  subDays,
  format,
} from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  // nilai awal opsional dari parent
  defaultStart?: Date;
  defaultEnd?: Date;
  onChange?: (range: { startDate: Date; endDate: Date }) => void;
};

export default function PeriodPicker({
  defaultStart,
  defaultEnd,
  onChange,
}: Props) {
  const today = useMemo(() => endOfDay(new Date()), []);
  const [range, setRange] = useState<{
    startDate: Date;
    endDate: Date;
    key: "selection";
  }>({
    startDate: defaultStart ?? startOfMonth(today),
    endDate: defaultEnd ?? today,
    key: "selection",
  });

  const selectionRange = useMemo(
    () => ({
      startDate: range.startDate,
      endDate: range.endDate,
      key: "selection" as const,
    }),
    [range]
  );

  const applyRange = (start: Date, end: Date) => {
    const next = { startDate: start, endDate: end, key: "selection" as const };
    setRange(next);
    onChange?.(next);
  };

  const handleSelect = (r: any) => {
    const { startDate, endDate } = r.selection;
    applyRange(startDate, endDate);
  };

  // QUICK PRESETS
  const setThisMonth = () => applyRange(startOfMonth(today), today);
  const setLastMonth = () => {
    const last = subMonths(today, 1);
    applyRange(startOfMonth(last), endOfMonth(last));
  };
  const setYTD = () => applyRange(startOfYear(today), today);
  const set7Days = () => applyRange(subDays(today, 6), today);
  const set30Days = () => applyRange(subDays(today, 29), today);

  // Format aman tanpa toISOString (hindari masalah zona waktu)
  const labelValue = `${format(range.startDate, "dd/MM/yyyy")} – ${format(
    range.endDate,
    "dd/MM/yyyy"
  )}`;

  return (
    <div className="grid w-full gap-4">
      <div className="grid w-full max-w-sm items-center gap-2 mx-auto">
        <Label htmlFor="period" className="text-center">
          Pilih Periode
        </Label>
        <Input
          id="period"
          name="period"
          className="text-center"
          value={labelValue}
          readOnly
        />
      </div>

      {/* QUICK FILTERS */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={setThisMonth}>
          Bulan ini
        </Button>
        <Button variant="outline" size="sm" onClick={setLastMonth}>
          Bulan lalu
        </Button>
        <Button variant="outline" size="sm" onClick={set7Days}>
          7 hari
        </Button>
        <Button variant="outline" size="sm" onClick={set30Days}>
          30 hari
        </Button>
        <Button variant="outline" size="sm" onClick={setYTD}>
          YTD
        </Button>
      </div>

      <div className="flex justify-center p-4">
        <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
          maxDate={today}
          locale={id}
          showDateDisplay={false}
          moveRangeOnFirstSelection={false}
          rangeColors={["#0ea5e9"]}
          direction="horizontal"
        />
      </div>
    </div>
  );
}
