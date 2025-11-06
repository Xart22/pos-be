import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { endOfDay, format, startOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { Button } from './ui/button';

type Props = {
    // nilai awal opsional dari parent
    defaultStart?: Date;
    defaultEnd?: Date;
    onChange?: (range: { startDate: Date; endDate: Date }) => void;
};

export default function PeriodPicker({ defaultStart, defaultEnd, onChange }: Props) {
    const today = useMemo(() => endOfDay(new Date()), []);
    const [range, setRange] = useState<{
        startDate: Date;
        endDate: Date;
        key: 'selection';
    }>({
        startDate: defaultStart ?? startOfMonth(today),
        endDate: defaultEnd ?? today,
        key: 'selection',
    });

    const selectionRange = useMemo(
        () => ({
            startDate: range.startDate,
            endDate: range.endDate,
            key: 'selection' as const,
        }),
        [range],
    );

    const handleSelect = (r: any) => {
        const { startDate, endDate } = r.selection;
        setRange({ startDate, endDate, key: 'selection' });
    };

    // Format aman tanpa toISOString (hindari masalah zona waktu)
    const labelValue = `${format(range.startDate, 'dd/MM/yyyy')} – ${format(range.endDate, 'dd/MM/yyyy')}`;

    return (
        <div className="grid w-full gap-4">
            <div className="mx-auto grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="period" className="text-center">
                    Pilih Periode
                </Label>
                <Input id="period" name="period" className="text-center" value={labelValue} readOnly />
            </div>
            <div className="flex flex-col items-center justify-center p-4">
                <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    maxDate={today}
                    locale={id}
                    showDateDisplay={false}
                    moveRangeOnFirstSelection={false}
                    rangeColors={['#0ea5e9']}
                    direction="horizontal"
                />
                <Button className="mt-4 w-full max-w-sm" onClick={() => console.log(range)}>
                    Filter
                </Button>
            </div>
        </div>
    );
}
