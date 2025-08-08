export default function formatRupiah(value: number): string {
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    });
    return formatter.format(value).replace(',00', '').trim();
}
