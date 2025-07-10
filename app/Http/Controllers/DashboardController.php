<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
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
        //get absensi from 25th of the previous month to the 24th of the current month
        $absensis = Absensi::where('user_id', Auth::id())
            ->whereBetween('tanggal', [now()->subMonth()->startOfMonth()->addDays(24), now()->endOfMonth()->addDays(24)])
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





        return Inertia::render('dashboard/page', [
            'absensis' => $absensis,
            'totalEarnings' => $absensis->sum(function ($absensi) {
                $cleanValue = str_replace(['Rp', '.', ','], '', $absensi->take_home_pay);
                return (int)$cleanValue;
            }),
            'type' => $type,

        ]);
    }
}
