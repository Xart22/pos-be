<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard view.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $now = now();

        if ($now->day >= 28) {
            $startOfPeriod = $now->copy()->day(28);
            $endOfPeriod = $now->copy()->addMonthNoOverflow()->day(27)->endOfDay();
        } else {
            $startOfPeriod = $now->copy()->subMonthNoOverflow()->day(28);
            $endOfPeriod = $now->copy()->day(27)->endOfDay();
        }

        if (Auth::user()->role === 'admin') {

            $omsetToday = Transaction::whereBetween('created_at', ["{$now->startOfDay()}", "{$now->endOfDay()}"])
                ->sum('total_price');
            $jumlahTransaksiToday = Transaction::whereBetween('created_at',  ["{$now->startOfDay()}", "{$now->endOfDay()}"])
                ->count();

            $totalTransaksiQris = Transaction::where('payment_method', 'qris')
                ->whereBetween('created_at', ["{$now->startOfDay()}", "{$now->endOfDay()}"])
                ->sum('total_price');

            $totalTransaksiCash = Transaction::where('payment_method', 'cash')
                ->whereBetween('created_at', ["{$now->startOfDay()}", "{$now->endOfDay()}"])
                ->sum('total_price');

            $omsetThisMonth = Transaction::whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->sum('total_price');

            $jumlahTransaksiThisMonth = Transaction::whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->count();

            $totalTransaksiQrisThisMonth = Transaction::where('payment_method', 'qris')
                ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->sum('total_price');

            $totalTransaksiCashThisMonth = Transaction::where('payment_method', 'cash')
                ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->sum('total_price');

            $categories = Category::get()->sortBy('position')->values()->all();
            $menu = Menu::all();

            $dataOmset = Transaction::whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->selectRaw('DATE(created_at) as date, SUM(total_price) as Omset')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            $transaction = Transaction::whereBetween('created_at', ["{$now->startOfDay()}", "{$now->endOfDay()}"])->with([
                'details.menu',
                'details.variants.variantOption.variant'
            ])
                ->get();
            $foodCategory = [2, 3, 4, 5, 6, 7, 8, 9, 18];
            $drinkCategory = [1, 10, 11, 12, 14, 16, 17];
            $menuDrink = $menu->whereIn('category_id', $drinkCategory)->pluck('name')->toArray();
            $menuFood = $menu->whereIn('category_id', $foodCategory)->pluck('name')->toArray();
            $menuUnknown = $menu->whereNotIn('category_id', array_merge($foodCategory, $drinkCategory))->pluck('name')->toArray();


            foreach ($transaction as $trans) {
                foreach ($trans->details as $detail) {
                    $order[] = [
                        'menu' => $detail->menu->name,
                        'category' => $detail->menu->category->id,
                        'quantity' => $detail->quantity,
                        'base_price' => $detail->menu->price,
                        'variant_price' => $detail->variants->sum('variantOption.price'),
                        'total_price' => $detail->menu->price * $detail->quantity + $detail->variants->sum('variantOption.price'),

                        'variants' => $detail->variants->map(function ($variant) {
                            return [
                                'variant_name' => $variant->variantOption->variant->name,
                                'name' => $variant->variantOption->name,
                                'price' => $variant->variantOption->price
                            ];
                        }),
                    ];
                }
            }



            $itemSoldThisMonth = Transaction::whereBetween('created_at', [$startOfPeriod, $endOfPeriod])
                ->count();


            return Inertia::render('dashboard/dashboard', [
                'omsetToday' => $omsetToday,
                'jumlahTransaksiToday' => $jumlahTransaksiToday,
                'totalTransaksiQris' => $totalTransaksiQris,
                'totalTransaksiCash' => $totalTransaksiCash,
                'omsetThisMonth' => $omsetThisMonth,
                'jumlahTransaksiThisMonth' => $jumlahTransaksiThisMonth,
                'totalTransaksiQrisThisMonth' => $totalTransaksiQrisThisMonth,
                'totalTransaksiCashThisMonth' => $totalTransaksiCashThisMonth,
                'period' => [
                    'start' => $startOfPeriod->format('Y-m-d'),
                    'end' => $endOfPeriod->format('Y-m-d'),
                ],
                'categories' => $categories,
                'menu' => $menu,
                'dataOmset' => $dataOmset,
            ]);
        }


        $absensis = Absensi::where('user_id', Auth::id())
            ->whereBetween('tanggal', [$startOfPeriod->format('Y-m-d'), $endOfPeriod->format('Y-m-d')])
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($absensi) {
                $baseGaji = Auth::user()->base_gaji / 26; // Assuming 26 working days in a month
                $absensi->shift = $absensi->shift;
                $absensi->take_home_pay = $absensi->shift === 'Full Time' ? number_format($baseGaji * 2, 0, ',', '.') : number_format($baseGaji, 0, ',', '.');
                return $absensi;
            });

        $type = null;
        $todayHasAbsensi = $absensis->firstWhere('tanggal', now()->format('Y-m-d'));
        if ($todayHasAbsensi) {
            $type = $todayHasAbsensi->jam_masuk ? "Absen Pulang" : "Absen Masuk";
        } else {
            $type = "Absen Masuk";
        }
        return Inertia::render('dashboard/pegawai/dashboard', [
            'absensis' => $absensis,
            'totalEarnings' => $absensis->sum(function ($absensi) {
                $cleanValue = str_replace(['Rp', '.', ','], '', $absensi->take_home_pay);
                return (int)$cleanValue;
            }),
            'paid' => $absensis->where('keterangan', 'Paid')->sum(function ($absensi) {
                $cleanValue = str_replace(['Rp', '.', ','], '', $absensi->take_home_pay);
                return (int)$cleanValue;
            }),

            'type' => $type,
        ]);
    }


    /**
     * Handle the form submission for absensi.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleSubmit(Request $request)
    {

        $lat = -6.946912929555798;
        $long = 107.7250390895087;
        $distance = 100; // in meters

        if (!$request->has('latitude') || !$request->has('longitude')) {
            return redirect()->back()->withErrors(['location' => 'Lokasi tidak tersedia.']);
        }

        $userLat = $request->input('latitude');
        $userLong = $request->input('longitude');
        $calculatedDistance = $this->calculateDistance($lat, $long, $userLat, $userLong);
        if ($calculatedDistance > $distance) {
            return redirect()->back()->withErrors(['location' => 'Anda tidak berada di lokasi yang ditentukan.']);
        }

        $absensi = new Absensi();
        $absensi->user_id = Auth::id();
        $absensi->tanggal = now()->format('Y-m-d');
        $absensi->shift = $request->shift;
        $absensi->jam_masuk = $request->type === 'Absen Masuk' ? now()->format('H:i:s') : null;
        $absensi->save();

        return redirect()->back()->with('success', 'Absensi berhasil disimpan.');
    }
    public function show()
    {
        return Inertia::render('dashboard/show');
    }


    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Earth radius in meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c; // Distance in meters
    }
}
