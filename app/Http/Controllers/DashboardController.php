<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Cashbon;
use App\Models\CashOut;
use App\Models\Category;
use App\Models\Menu;
use App\Models\Operational;
use App\Models\Transaction;
use App\Models\User;
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
    public function index(Request $request)
    {
        $now = now();
        if ($request->input('period')) {
            $period = $request->input('period');
        } else {
            $now = now();
        }


        // Periode bulan berjalan: 1 s/d akhir bulan
        $startOfPeriod = $now->copy()->startOfMonth();
        $endOfPeriod   = $now->copy()->endOfMonth();



        $startOfPeriod = \Carbon\Carbon::parse($startOfPeriod)->startOfDay();
        $endOfPeriod = \Carbon\Carbon::parse($endOfPeriod)->endOfDay();

        // Batas "hari ini"
        $todayStart = $now->copy()->startOfDay();
        $todayEnd   = $now->copy()->endOfDay();


        if (Auth::user()->role === 'admin') {
            $currentMonth = date("n");
            $currentYear = date("Y");
            $currentDate = date("d");

            $numberOfDays = cal_days_in_month(CAL_GREGORIAN, $currentMonth, $currentYear);


            $user = User::where('role', "!=", 'admin')->with(['absensiThisMonth', 'cashbons'])->get();
            $load = [];
            $totalGajiAll = (Operational::all()->sum('price') / $numberOfDays) * $currentDate;

            foreach ($user as $usr) {
                $baseGaji = $usr->base_gaji / 26;
                $totalGaji = 0;
                foreach ($usr->absensiThisMonth as $absensi) {
                    if ($absensi->shift === 'Full Time') {
                        $totalGaji += $baseGaji * 2;
                    } else {
                        $totalGaji += $baseGaji;
                    }
                }


                $load[$usr->name]['base_gaji'] = number_format($baseGaji, 0, ',', '.');
                $load[$usr->name]['cashbon'] = $usr->cashbons->sum('jumlah');
                $load[$usr->name]['netto'] = $totalGaji - $usr->cashbons->sum('jumlah');
            }

            foreach ($load as $name => $data) {
                $totalGajiAll += $data['netto'];
            }




            $omsetToday = Transaction::whereBetween('created_at', ["{$todayStart}", "{$todayEnd}"])
                ->sum('total_price');
            $jumlahTransaksiToday = Transaction::whereBetween('created_at',  ["{$todayStart}", "{$todayEnd}"])->where("total_price", "!=", 0)
                ->count();

            $totalTransaksiQris = Transaction::where('payment_method', 'qris')
                ->whereDate('created_at', $now->format('Y-m-d'))
                ->sum('total_price');

            $totalTransaksiCash = Transaction::where('payment_method', 'cash')
                ->whereDate('created_at', $now->format('Y-m-d'))
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

            $dataOmsetLastMonth = Transaction::whereBetween('created_at', [
                $startOfPeriod->copy()->subMonth(),
                $endOfPeriod->copy()->subMonth(),
            ])
                ->selectRaw('DATE(created_at) as date, SUM(total_price) as Omset')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();


            $transactions = Transaction::whereDate('created_at', $now->format('Y-m-d'))->where("total_price", "!=", 0)->get();

            // $transactions = Transaction::whereBetween('created_at', [
            //     $startOfPeriod->copy()->subMonth(),
            //     $endOfPeriod->copy()->subMonth(),
            // ])->get();

            $transactions->load([
                'details.menu',
                'details.variants.variantOption.variant'
            ]);

            $foodCategory = [2, 3, 4, 5, 6, 7, 8, 9, 18];
            $drinkCategory = [1, 10, 11, 12, 14, 16, 17];

            $transFood = [];
            $transDrink = [];
            $transUnknown = [];

            // Ubah category list jadi "set" O(1) lookup
            $foodSet  = array_flip($foodCategory ?? []);
            $drinkSet = array_flip($drinkCategory ?? []);

            foreach ($transactions as $tx) {
                foreach ($tx->details as $detail) {
                    $menu       = $detail->menu;
                    $categoryId = $menu->category->id ?? null;

                    // Hitung sekali saja
                    $quantity      = (int) $detail->quantity;
                    $basePrice     = (float) ($menu->price ?? 0);
                    $variantPrice  = (float) $detail->variants->sum('variantOption.price');

                    // Susun info variant (nama, harga, dsb)
                    $variantItems = $detail->variants->map(function ($variant) {
                        return [
                            'variant_name' => $variant->variantOption->variant->name ?? null,
                            'name'         => $variant->variantOption->name ?? null,
                            'price'        => (float) ($variant->variantOption->price ?? 0),
                        ];
                    });

                    // Untuk pembeda menu minuman, gunakan nama varian yang diurutkan agar konsisten
                    $variantNames = $detail->variants
                        ->pluck('variantOption.name')
                        ->filter()
                        ->sort()
                        ->values()
                        ->all();

                    // BUAT KEY:
                    // - Food: gabung berdasarkan nama menu saja
                    // - Drink: jika ada varian maka gabung per "menu + varian", jika tidak ada varian ya nama menu saja
                    $baseKey = $menu->name ?? 'Unknown';
                    $drinkKey = $variantNames
                        ? $baseKey . ' - ' . implode(', ', $variantNames)
                        : $baseKey;
                    if (str_contains(strtolower($drinkKey), 'large')) {
                        $drinkKey = $baseKey . " - L";
                    } else if (str_contains(strtolower($drinkKey), 'reguler')) {
                        $drinkKey = $baseKey . " - R";
                    }
                    // Normalized row (sekali bikin, nanti tinggal ditambah kuantitas & total)
                    $row = [
                        'menu'          => $baseKey,
                        'category'      => $categoryId,
                        'quantity'      => $quantity,
                        'base_price'    => $basePrice,
                        'variant_price' => $variantPrice,
                        'total_price'   => ($basePrice * $quantity) + $variantPrice,
                        'variants'      => $variantItems,
                    ];

                    // Tentukan bucket & key
                    if (isset($foodSet[$categoryId])) {
                        $key = $baseKey; // food: gabung per nama menu
                        if (!isset($transFood[$key])) {
                            $transFood[$key] = $row;
                        } else {
                            $transFood[$key]['quantity']    += $row['quantity'];
                            $transFood[$key]['total_price'] += $row['total_price'];
                        }
                    } elseif (isset($drinkSet[$categoryId])) {
                        $key = $drinkKey; // drink: bedakan varian
                        // Perbarui label 'menu' agar tampak nama + varian saat disimpan
                        $row['menu'] = $key;
                        if (!isset($transDrink[$key])) {
                            $transDrink[$key] = $row;
                        } else {
                            $transDrink[$key]['quantity']    += $row['quantity'];
                            $transDrink[$key]['total_price'] += $row['total_price'];
                        }
                    } else {
                        // Unknown: simpan apa adanya (kalau mau digabung, bisa pakai key $baseKey juga)
                        $transUnknown[] = $row;
                    }
                }
            }

            // Jika butuh array numerik (bukan assoc), reindex:
            $transFood    = array_values($transFood);
            $transDrink   = array_values($transDrink);
            // $transUnknown sudah numerik


            $totalCashOut = CashOut::whereBetween('created_at', ["{$todayStart}", "{$todayEnd}"])
                ->sum('amount');
            $cashOutToday = CashOut::whereDate('tanggal', $now->format('Y-m-d'))
                ->sum('amount');



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
                'dataOmset' => $dataOmset,
                'dataOmsetLastMonth' => $dataOmsetLastMonth,
                'txDrink' => $transDrink,
                'txFood' => $transFood,
                'txUnknown' => $transUnknown,
                'cashOutToday' => $cashOutToday,
                'totalCashOut' => $totalCashOut,
                'totalGajiAll' => $totalGajiAll,
                'load' => $load,
            ]);
        }


        $absensis = Absensi::where('user_id', Auth::id())
            ->where('keterangan', null)
            ->orderBy('tanggal', 'desc')
            ->get()
            ->map(function ($absensi) {
                $baseGaji = Auth::user()->base_gaji / 26; // Assuming 26 working days in a month
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
            'paid' => Cashbon::where('user_id', Auth::id())->where('status', 'Disetujui')->whereBetween('tanggal', [$startOfPeriod->format('Y-m-d'), $endOfPeriod->format('Y-m-d')])->sum('jumlah'),

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


    public function handleSubmitCashbon(Request $request)
    {
        // Validasi input
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $amount = $request->input('amount');

        Cashbon::create([
            'user_id' => Auth::id(),
            'jumlah' => $amount,
            'status' => 'Diajukan',
            'tanggal' => now()->format('Y-m-d'),
        ]);

        return redirect()->back()->with('success', 'Cashout request of amount ' . $amount . ' has been submitted successfully.');
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
