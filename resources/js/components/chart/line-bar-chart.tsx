import formatRupiah from '@/helper/formatRupiah';
import { OmsetChartData } from '@/types';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type LineBarChartProps = {
    data: OmsetChartData[];
};

const LineBarChart = ({ data }: LineBarChartProps) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
                width={400}
                height={400}
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" scale="band" />
                <YAxis tickFormatter={(value) => formatRupiah(value)} width={200} />
                <Tooltip
                    formatter={(value) => {
                        if (Array.isArray(value)) {
                            return value.map((v) => formatRupiah(typeof v === 'number' ? v : parseFloat(v as string))).join(', ');
                        }
                        return formatRupiah(typeof value === 'number' ? value : parseFloat(value as string));
                    }}
                />

                <Bar dataKey="Omset" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="Omset" stroke="#ff7300" />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default LineBarChart;
