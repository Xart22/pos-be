<?php

namespace App\Console\Commands;

use App\Models\BahanBaku;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckBahanBaku extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-bahan-baku';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $bahan = BahanBaku::where('per_unit', '!=', 0)->get();
        $textMassage = "Stok Bahan Baku yang hampir habis:\n\n";
        $apiKey = env('WAHA_API_KEY', '');
        $number = env('WAHA_CHAT_ID', '');
        try {
            Http::withHeaders([
                'X-Api-Key' => $apiKey,
            ])->post(
                'https://waha.outsidecoffee.id/api/startTyping',
                [
                    'chatId' => $number,
                    'session' => 'default',
                ]
            );
            Log::info('Memulai mengetik pesan stok bahan baku hampir habis.');
        } catch (\Throwable $th) {
            Log::error('Gagal memulai mengetik pesan stok bahan baku hampir habis: ' . $th->getMessage());
        }
        foreach ($bahan as $item) {
            $alertStock =  $item->per_unit;
            if (str_contains($item->name, 'JNC')) {
                $alertStock =  $item->per_unit * 2;
            }

            if (str_contains($item->kode, 'UHT')) {
                $alertStock =  $item->per_unit * 24;
            }
            if ($alertStock >= $item->stock) {
                $textMassage .= "- " . $item->name . " (Stok: " . $item->stock . ")\n";
            }
        }
        sleep(5);
        Http::withHeaders([
            'X-Api-Key' => $apiKey,
        ])->post(
            'https://waha.outsidecoffee.id/api/stopTyping',
            [
                'chatId' => $number,
                'session' => 'default',
            ]
        );
        sleep(2);
        if (strlen($textMassage) > strlen("Stok Bahan Baku yang hampir habis:\n\n")) {

            try {
                Http::withHeaders([
                    'X-Api-Key' => $apiKey,
                ])->post(
                    'https://waha.outsidecoffee.id/api/sendText',
                    [
                        'chatId' => $number,
                        'text' => $textMassage,
                        'session' => 'default',
                    ]
                );
                Log::info('Stok bahan baku hampir habis, pesan telah dikirim.');
            } catch (\Throwable $th) {
                Log::error('Gagal mengirim pesan stok bahan baku hampir habis: ' . $th->getMessage());
            }
        }
        return 0;
    }
}
