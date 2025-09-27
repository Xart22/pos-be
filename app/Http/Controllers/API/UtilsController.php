<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TransactionDetailVariant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UtilsController extends Controller
{
    public function tes()
    {
        $transactions = [
            [
                'id' => 1,
                'order_id' => 'S100825-001',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'ikhsan',
                'sub_total' => 89000,
                'discount' => 0,
                'total_price' => 89000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '82557 - bsi',
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 109,
                'order_id' => 'S100825-002',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 3,
                'customer_name' => 'ars a',
                'sub_total' => 68000,
                'discount' => 0,
                'total_price' => 68000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '002271 - bni',
                'note' => null,
                'created_at' => '2025-08-10 04:41:50',
                'updated_at' => '2025-08-10 04:41:50'
            ],
            [
                'id' => 110,
                'order_id' => 'S100825-003',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'beni',
                'sub_total' => 23000,
                'discount' => 0,
                'total_price' => 23000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '105610 - bca',
                'note' => null,
                'created_at' => '2025-08-10 04:43:49',
                'updated_at' => '2025-08-10 04:43:49'
            ],
            [
                'id' => 111,
                'order_id' => 'S100825-004',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 4,
                'customer_name' => 'arsa',
                'sub_total' => 66000,
                'discount' => 0,
                'total_price' => 66000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '954537 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 04:48:47',
                'updated_at' => '2025-08-10 04:48:47'
            ],
            [
                'id' => 112,
                'order_id' => 'S100825-005',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 5,
                'customer_name' => 'iki',
                'sub_total' => 110000,
                'discount' => 0,
                'total_price' => 110000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '091904 - gopay',
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 113,
                'order_id' => 'S100825-006',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 6,
                'customer_name' => 'langit',
                'sub_total' => 35000,
                'discount' => 0,
                'total_price' => 35000,
                'cash' => 100000,
                'change' => 65000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 06:51:09',
                'updated_at' => '2025-08-10 06:51:09'
            ],
            [
                'id' => 114,
                'order_id' => 'S100825-007',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 7,
                'customer_name' => 'salma',
                'sub_total' => 40000,
                'discount' => 0,
                'total_price' => 40000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '095680 - seabank',
                'note' => null,
                'created_at' => '2025-08-10 07:02:18',
                'updated_at' => '2025-08-10 07:02:18'
            ],
            [
                'id' => 115,
                'order_id' => 'S100825-008',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'mona',
                'sub_total' => 23000,
                'discount' => 0,
                'total_price' => 23000,
                'cash' => 100000,
                'change' => 77000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 07:11:30',
                'updated_at' => '2025-08-10 07:11:30'
            ],
            [
                'id' => 116,
                'order_id' => 'S100825-009',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 9,
                'customer_name' => 'zibran',
                'sub_total' => 17000,
                'discount' => 0,
                'total_price' => 17000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '157 - dana',
                'note' => null,
                'created_at' => '2025-08-10 07:35:24',
                'updated_at' => '2025-08-10 07:35:24'
            ],
            [
                'id' => 117,
                'order_id' => 'S100825-010',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'upi',
                'sub_total' => 44000,
                'discount' => 0,
                'total_price' => 44000,
                'cash' => 50000,
                'change' => 6000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 08:18:24',
                'updated_at' => '2025-08-10 08:18:24'
            ],
            [
                'id' => 118,
                'order_id' => 'S100825-011',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => 11,
                'customer_name' => 'putri',
                'sub_total' => 122000,
                'discount' => 0,
                'total_price' => 122000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '687312 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 119,
                'order_id' => 'S100825-012',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 12,
                'customer_name' => 'rafka',
                'sub_total' => 109000,
                'discount' => 0,
                'total_price' => 109000,
                'cash' => 109000,
                'change' => 0,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 120,
                'order_id' => 'S100825-013',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 13,
                'customer_name' => 'LANGIT',
                'sub_total' => 28000,
                'discount' => 0,
                'total_price' => 28000,
                'cash' => 100000,
                'change' => 72000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 09:07:43',
                'updated_at' => '2025-08-10 09:07:43'
            ],
            [
                'id' => 121,
                'order_id' => 'S100825-014',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'deri',
                'sub_total' => 50000,
                'discount' => 0,
                'total_price' => 50000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '1 - bca',
                'note' => null,
                'created_at' => '2025-08-10 09:29:35',
                'updated_at' => '2025-08-10 09:29:35'
            ],
            [
                'id' => 122,
                'order_id' => 'S100825-015',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 15,
                'customer_name' => 'rafka',
                'sub_total' => 22000,
                'discount' => 0,
                'total_price' => 22000,
                'cash' => 52000,
                'change' => 30000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 09:30:09',
                'updated_at' => '2025-08-10 09:30:09'
            ],
            [
                'id' => 123,
                'order_id' => 'S100825-016',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'ayu',
                'sub_total' => 23000,
                'discount' => 0,
                'total_price' => 23000,
                'cash' => 30000,
                'change' => 7000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 09:43:36',
                'updated_at' => '2025-08-10 09:43:36'
            ],
            [
                'id' => 124,
                'order_id' => 'S100825-017',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 17,
                'customer_name' => 'ajeng',
                'sub_total' => 89000,
                'discount' => 0,
                'total_price' => 89000,
                'cash' => 100000,
                'change' => 11000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 125,
                'order_id' => 'S100825-018',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'resa',
                'sub_total' => 60000,
                'discount' => 0,
                'total_price' => 60000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '170134 - bca',
                'note' => null,
                'created_at' => '2025-08-10 10:01:44',
                'updated_at' => '2025-08-10 10:01:44'
            ],
            [
                'id' => 126,
                'order_id' => 'S100825-019',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 19,
                'customer_name' => 'riska',
                'sub_total' => 51000,
                'discount' => 0,
                'total_price' => 51000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '171636 -  bca',
                'note' => null,
                'created_at' => '2025-08-10 10:16:47',
                'updated_at' => '2025-08-10 10:16:47'
            ],
            [
                'id' => 127,
                'order_id' => 'S100825-020',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 20,
                'customer_name' => 'riska',
                'sub_total' => 12000,
                'discount' => 0,
                'total_price' => 12000,
                'cash' => 50000,
                'change' => 38000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 10:37:54',
                'updated_at' => '2025-08-10 10:37:54'
            ],
            [
                'id' => 128,
                'order_id' => 'S100825-021',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'jepri',
                'sub_total' => 27000,
                'discount' => 0,
                'total_price' => 27000,
                'cash' => 100000,
                'change' => 73000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 11:15:26',
                'updated_at' => '2025-08-10 11:15:26'
            ],
            [
                'id' => 129,
                'order_id' => 'S100825-022',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 22,
                'customer_name' => 'dtinda',
                'sub_total' => 66000,
                'discount' => 0,
                'total_price' => 66000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '182311 - bca',
                'note' => null,
                'created_at' => '2025-08-10 11:23:21',
                'updated_at' => '2025-08-10 11:23:21'
            ],
            [
                'id' => 130,
                'order_id' => 'S100825-023',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 23,
                'customer_name' => 'rey',
                'sub_total' => 88000,
                'discount' => 0,
                'total_price' => 88000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '183143 - bca',
                'note' => null,
                'created_at' => '2025-08-10 11:31:59',
                'updated_at' => '2025-08-10 11:31:59'
            ],
            [
                'id' => 131,
                'order_id' => 'S100825-024',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'fitri',
                'sub_total' => 104000,
                'discount' => 0,
                'total_price' => 104000,
                'cash' => 104000,
                'change' => 0,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 132,
                'order_id' => 'S100825-025',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 2,
                'customer_name' => 'eli',
                'sub_total' => 70000,
                'discount' => 0,
                'total_price' => 70000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '184614 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 11:46:34',
                'updated_at' => '2025-08-10 11:46:34'
            ],
            [
                'id' => 133,
                'order_id' => 'S100825-026',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 26,
                'customer_name' => 'mega',
                'sub_total' => 19000,
                'discount' => 0,
                'total_price' => 19000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '110248 - bca',
                'note' => null,
                'created_at' => '2025-08-10 11:47:49',
                'updated_at' => '2025-08-10 11:47:49'
            ],
            [
                'id' => 134,
                'order_id' => 'S100825-027',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 27,
                'customer_name' => 'ridwan',
                'sub_total' => 16000,
                'discount' => 0,
                'total_price' => 16000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '185446 - bca',
                'note' => null,
                'created_at' => '2025-08-10 11:50:21',
                'updated_at' => '2025-08-10 11:50:21'
            ],
            [
                'id' => 135,
                'order_id' => 'S100825-028',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 2,
                'customer_name' => 'danis',
                'sub_total' => 63000,
                'discount' => 0,
                'total_price' => 63000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '185945 - bca',
                'note' => null,
                'created_at' => '2025-08-10 11:59:52',
                'updated_at' => '2025-08-10 11:59:52'
            ],
            [
                'id' => 136,
                'order_id' => 'S100825-029',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 29,
                'customer_name' => 'rey mysterio',
                'sub_total' => 18000,
                'discount' => 0,
                'total_price' => 18000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '555326 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:01:13',
                'updated_at' => '2025-08-10 12:01:13'
            ],
            [
                'id' => 137,
                'order_id' => 'S100825-030',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 30,
                'customer_name' => 'erika',
                'sub_total' => 22000,
                'discount' => 0,
                'total_price' => 22000,
                'cash' => 22000,
                'change' => 0,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:03:38',
                'updated_at' => '2025-08-10 12:03:38'
            ],
            [
                'id' => 138,
                'order_id' => 'S100825-031',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 31,
                'customer_name' => 'mega',
                'sub_total' => 61000,
                'discount' => 0,
                'total_price' => 61000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '3390389 - shopee',
                'note' => null,
                'created_at' => '2025-08-10 12:07:16',
                'updated_at' => '2025-08-10 12:07:16'
            ],
            [
                'id' => 139,
                'order_id' => 'S100825-032',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'liva',
                'sub_total' => 88000,
                'discount' => 0,
                'total_price' => 88000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '191664 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:16:22',
                'updated_at' => '2025-08-10 12:16:22'
            ],
            [
                'id' => 140,
                'order_id' => 'S100825-033',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'lala',
                'sub_total' => 39000,
                'discount' => 0,
                'total_price' => 39000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '191824 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:18:32',
                'updated_at' => '2025-08-10 12:18:32'
            ],
            [
                'id' => 141,
                'order_id' => 'S100825-034',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 34,
                'customer_name' => 'caca',
                'sub_total' => 39000,
                'discount' => 0,
                'total_price' => 39000,
                'cash' => 50000,
                'change' => 11000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:26:14',
                'updated_at' => '2025-08-10 12:26:14'
            ],
            [
                'id' => 142,
                'order_id' => 'S100825-035',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'ayung',
                'sub_total' => 92000,
                'discount' => 0,
                'total_price' => 92000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '887743 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:30:19',
                'updated_at' => '2025-08-10 12:30:19'
            ],
            [
                'id' => 143,
                'order_id' => 'S100825-036',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 36,
                'customer_name' => 'elvin',
                'sub_total' => 24000,
                'discount' => 0,
                'total_price' => 24000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '066867 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:32:39',
                'updated_at' => '2025-08-10 12:32:39'
            ],
            [
                'id' => 144,
                'order_id' => 'S100825-037',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 37,
                'customer_name' => 'widi',
                'sub_total' => 19000,
                'discount' => 0,
                'total_price' => 19000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '193435 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:35:06',
                'updated_at' => '2025-08-10 12:35:06'
            ],
            [
                'id' => 145,
                'order_id' => 'S100825-038',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 38,
                'customer_name' => 'hadi',
                'sub_total' => 47000,
                'discount' => 0,
                'total_price' => 47000,
                'cash' => 50000,
                'change' => 3000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:36:26',
                'updated_at' => '2025-08-10 12:36:26'
            ],
            [
                'id' => 146,
                'order_id' => 'S100825-039',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 39,
                'customer_name' => 'dadam',
                'sub_total' => 21000,
                'discount' => 0,
                'total_price' => 21000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '1932226 - bca',
                'note' => null,
                'created_at' => '2025-08-10 12:38:10',
                'updated_at' => '2025-08-10 12:38:10'
            ],
            [
                'id' => 147,
                'order_id' => 'S100825-040',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 40,
                'customer_name' => 'caca',
                'sub_total' => 23000,
                'discount' => 0,
                'total_price' => 23000,
                'cash' => 25000,
                'change' => 2000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:44:33',
                'updated_at' => '2025-08-10 12:44:33'
            ],
            [
                'id' => 148,
                'order_id' => 'S100825-041',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 41,
                'customer_name' => 'p',
                'sub_total' => 8000,
                'discount' => 0,
                'total_price' => 8000,
                'cash' => 50000,
                'change' => 42000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:56:40',
                'updated_at' => '2025-08-10 12:56:40'
            ],
            [
                'id' => 149,
                'order_id' => 'S100825-042',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 42,
                'customer_name' => 'naira',
                'sub_total' => 40000,
                'discount' => 0,
                'total_price' => 40000,
                'cash' => 40000,
                'change' => 0,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 12:59:39',
                'updated_at' => '2025-08-10 12:59:39'
            ],
            [
                'id' => 150,
                'order_id' => 'S100825-043',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'nayla',
                'sub_total' => 71000,
                'discount' => 0,
                'total_price' => 71000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '552 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 13:10:12',
                'updated_at' => '2025-08-10 13:10:12'
            ],
            [
                'id' => 151,
                'order_id' => 'S100825-044',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 44,
                'customer_name' => 'viona',
                'sub_total' => 181000,
                'discount' => 0,
                'total_price' => 181000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '201414 - bca',
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 152,
                'order_id' => 'S100825-045',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 45,
                'customer_name' => 'karisa',
                'sub_total' => 40000,
                'discount' => 0,
                'total_price' => 40000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '755 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 13:15:23',
                'updated_at' => '2025-08-10 13:15:23'
            ],
            [
                'id' => 153,
                'order_id' => 'S100825-046',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 46,
                'customer_name' => 'dita',
                'sub_total' => 110000,
                'discount' => 0,
                'total_price' => 110000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '3588665 - dana',
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 154,
                'order_id' => 'S100825-047',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 47,
                'customer_name' => 'yuda',
                'sub_total' => 32000,
                'discount' => 0,
                'total_price' => 32000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '202704 - bca',
                'note' => null,
                'created_at' => '2025-08-10 13:27:22',
                'updated_at' => '2025-08-10 13:27:22'
            ],
            [
                'id' => 155,
                'order_id' => 'S100825-048',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'altan',
                'sub_total' => 87000,
                'discount' => 0,
                'total_price' => 87000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '203996 - bca',
                'note' => null,
                'created_at' => '2025-08-10 13:39:29',
                'updated_at' => '2025-08-10 13:39:29'
            ],
            [
                'id' => 156,
                'order_id' => 'S100825-049',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 49,
                'customer_name' => 'nayla',
                'sub_total' => 23000,
                'discount' => 0,
                'total_price' => 23000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '204812 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 13:48:27',
                'updated_at' => '2025-08-10 13:48:27'
            ],
            [
                'id' => 157,
                'order_id' => 'S100825-050',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => null,
                'customer_name' => 'hilmi',
                'sub_total' => 40000,
                'discount' => 8000,
                'total_price' => 32000,
                'cash' => 50000,
                'change' => 18000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 13:51:11',
                'updated_at' => '2025-08-10 13:51:11'
            ],
            [
                'id' => 158,
                'order_id' => 'S100825-051',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'TAKE_AWAY',
                'status' => 'PROCESS',
                'table_number' => 1,
                'customer_name' => 'alpan',
                'sub_total' => 22000,
                'discount' => 0,
                'total_price' => 22000,
                'cash' => 52000,
                'change' => 30000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 13:52:41',
                'updated_at' => '2025-08-10 13:52:41'
            ],
            [
                'id' => 159,
                'order_id' => 'S100825-052',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 52,
                'customer_name' => 'hengky',
                'sub_total' => 70000,
                'discount' => 0,
                'total_price' => 70000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '2125553 - mandiri',
                'note' => null,
                'created_at' => '2025-08-10 14:26:06',
                'updated_at' => '2025-08-10 14:26:06'
            ],
            [
                'id' => 160,
                'order_id' => 'S100825-053',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 53,
                'customer_name' => 'sabik',
                'sub_total' => 16000,
                'discount' => 0,
                'total_price' => 16000,
                'cash' => 20000,
                'change' => 4000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 14:30:50',
                'updated_at' => '2025-08-10 14:30:50'
            ],
            [
                'id' => 162,
                'order_id' => 'S100825-054',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 54,
                'customer_name' => 'faris',
                'sub_total' => 24000,
                'discount' => 0,
                'total_price' => 24000,
                'cash' => 50000,
                'change' => 26000,
                'payment_method' => 'CASH',
                'payment_status' => null,
                'payment_proof' => '-',
                'note' => null,
                'created_at' => '2025-08-10 14:36:10',
                'updated_at' => '2025-08-10 14:36:10'
            ],
            [
                'id' => 163,
                'order_id' => 'S100825-055',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 55,
                'customer_name' => 'pras',
                'sub_total' => 41000,
                'discount' => 0,
                'total_price' => 41000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '220858 - bca',
                'note' => null,
                'created_at' => '2025-08-10 15:09:12',
                'updated_at' => '2025-08-10 15:09:12'
            ],
            [
                'id' => 164,
                'order_id' => 'S100825-056',
                'user_id' => 1,
                'promo_id' => null,
                'type' => 'DINE_IN',
                'status' => 'PROCESS',
                'table_number' => 56,
                'customer_name' => 'didi',
                'sub_total' => 63000,
                'discount' => 0,
                'total_price' => 63000,
                'cash' => null,
                'change' => null,
                'payment_method' => 'QRIS',
                'payment_status' => null,
                'payment_proof' => '222222 - bca',
                'note' => null,
                'created_at' => '2025-08-10 15:22:30',
                'updated_at' => '2025-08-10 15:22:30'
            ]
        ];

        $transaction_details = [
            [
                'id' => 2,
                'transaction_id' => 1,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 3,
                'transaction_id' => 1,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 4,
                'transaction_id' => 1,
                'menu_id' => 73,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 5,
                'transaction_id' => 1,
                'menu_id' => 13,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 6,
                'transaction_id' => 1,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 03:18:19',
                'updated_at' => '2025-08-10 03:18:19'
            ],
            [
                'id' => 7,
                'transaction_id' => 109,
                'menu_id' => 38,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:41:50',
                'updated_at' => '2025-08-10 04:41:50'
            ],
            [
                'id' => 8,
                'transaction_id' => 109,
                'menu_id' => 21,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:41:50',
                'updated_at' => '2025-08-10 04:41:50'
            ],
            [
                'id' => 9,
                'transaction_id' => 109,
                'menu_id' => 41,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:41:50',
                'updated_at' => '2025-08-10 04:41:50'
            ],
            [
                'id' => 10,
                'transaction_id' => 109,
                'menu_id' => 97,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:41:50',
                'updated_at' => '2025-08-10 04:41:50'
            ],
            [
                'id' => 11,
                'transaction_id' => 110,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:43:49',
                'updated_at' => '2025-08-10 04:43:49'
            ],
            [
                'id' => 12,
                'transaction_id' => 111,
                'menu_id' => 39,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 04:48:47',
                'updated_at' => '2025-08-10 04:48:47'
            ],
            [
                'id' => 13,
                'transaction_id' => 111,
                'menu_id' => 11,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:48:47',
                'updated_at' => '2025-08-10 04:48:47'
            ],
            [
                'id' => 14,
                'transaction_id' => 111,
                'menu_id' => 76,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 04:48:47',
                'updated_at' => '2025-08-10 04:48:47'
            ],
            [
                'id' => 15,
                'transaction_id' => 112,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 16,
                'transaction_id' => 112,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 17,
                'transaction_id' => 112,
                'menu_id' => 43,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 18,
                'transaction_id' => 112,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 19,
                'transaction_id' => 112,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:25:32',
                'updated_at' => '2025-08-10 06:25:32'
            ],
            [
                'id' => 20,
                'transaction_id' => 113,
                'menu_id' => 53,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:51:09',
                'updated_at' => '2025-08-10 06:51:09'
            ],
            [
                'id' => 21,
                'transaction_id' => 113,
                'menu_id' => 13,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 06:51:09',
                'updated_at' => '2025-08-10 06:51:09'
            ],
            [
                'id' => 22,
                'transaction_id' => 114,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 07:02:18',
                'updated_at' => '2025-08-10 07:02:18'
            ],
            [
                'id' => 23,
                'transaction_id' => 114,
                'menu_id' => 58,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 07:02:19',
                'updated_at' => '2025-08-10 07:02:19'
            ],
            [
                'id' => 24,
                'transaction_id' => 115,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 07:11:30',
                'updated_at' => '2025-08-10 07:11:30'
            ],
            [
                'id' => 25,
                'transaction_id' => 116,
                'menu_id' => 58,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 07:35:25',
                'updated_at' => '2025-08-10 07:35:25'
            ],
            [
                'id' => 26,
                'transaction_id' => 117,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:18:24',
                'updated_at' => '2025-08-10 08:18:24'
            ],
            [
                'id' => 27,
                'transaction_id' => 117,
                'menu_id' => 93,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:18:24',
                'updated_at' => '2025-08-10 08:18:24'
            ],
            [
                'id' => 28,
                'transaction_id' => 118,
                'menu_id' => 1,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 29,
                'transaction_id' => 118,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 30,
                'transaction_id' => 118,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 31,
                'transaction_id' => 118,
                'menu_id' => 55,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 32,
                'transaction_id' => 118,
                'menu_id' => 19,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 08:53:33',
                'updated_at' => '2025-08-10 08:53:33'
            ],
            [
                'id' => 33,
                'transaction_id' => 119,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 34,
                'transaction_id' => 119,
                'menu_id' => 36,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 35,
                'transaction_id' => 119,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 36,
                'transaction_id' => 119,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 37,
                'transaction_id' => 119,
                'menu_id' => 18,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 38,
                'transaction_id' => 119,
                'menu_id' => 69,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:06:30',
                'updated_at' => '2025-08-10 09:06:30'
            ],
            [
                'id' => 39,
                'transaction_id' => 120,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:07:43',
                'updated_at' => '2025-08-10 09:07:43'
            ],
            [
                'id' => 40,
                'transaction_id' => 120,
                'menu_id' => 76,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:07:43',
                'updated_at' => '2025-08-10 09:07:43'
            ],
            [
                'id' => 41,
                'transaction_id' => 121,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:29:35',
                'updated_at' => '2025-08-10 09:29:35'
            ],
            [
                'id' => 42,
                'transaction_id' => 121,
                'menu_id' => 93,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:29:35',
                'updated_at' => '2025-08-10 09:29:35'
            ],
            [
                'id' => 43,
                'transaction_id' => 122,
                'menu_id' => 36,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:30:09',
                'updated_at' => '2025-08-10 09:30:09'
            ],
            [
                'id' => 44,
                'transaction_id' => 123,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:43:36',
                'updated_at' => '2025-08-10 09:43:36'
            ],
            [
                'id' => 45,
                'transaction_id' => 124,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 46,
                'transaction_id' => 124,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 47,
                'transaction_id' => 124,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 48,
                'transaction_id' => 124,
                'menu_id' => 23,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 49,
                'transaction_id' => 124,
                'menu_id' => 29,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 09:47:20',
                'updated_at' => '2025-08-10 09:47:20'
            ],
            [
                'id' => 50,
                'transaction_id' => 125,
                'menu_id' => 65,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:01:44',
                'updated_at' => '2025-08-10 10:01:44'
            ],
            [
                'id' => 51,
                'transaction_id' => 125,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:01:44',
                'updated_at' => '2025-08-10 10:01:44'
            ],
            [
                'id' => 52,
                'transaction_id' => 125,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:01:44',
                'updated_at' => '2025-08-10 10:01:44'
            ],
            [
                'id' => 53,
                'transaction_id' => 126,
                'menu_id' => 70,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:16:47',
                'updated_at' => '2025-08-10 10:16:47'
            ],
            [
                'id' => 54,
                'transaction_id' => 126,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:16:47',
                'updated_at' => '2025-08-10 10:16:47'
            ],
            [
                'id' => 55,
                'transaction_id' => 126,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:16:47',
                'updated_at' => '2025-08-10 10:16:47'
            ],
            [
                'id' => 56,
                'transaction_id' => 127,
                'menu_id' => 29,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 10:37:54',
                'updated_at' => '2025-08-10 10:37:54'
            ],
            [
                'id' => 57,
                'transaction_id' => 128,
                'menu_id' => 65,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:15:26',
                'updated_at' => '2025-08-10 11:15:26'
            ],
            [
                'id' => 58,
                'transaction_id' => 129,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:23:21',
                'updated_at' => '2025-08-10 11:23:21'
            ],
            [
                'id' => 59,
                'transaction_id' => 129,
                'menu_id' => 50,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:23:21',
                'updated_at' => '2025-08-10 11:23:21'
            ],
            [
                'id' => 60,
                'transaction_id' => 129,
                'menu_id' => 7,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:23:21',
                'updated_at' => '2025-08-10 11:23:21'
            ],
            [
                'id' => 61,
                'transaction_id' => 130,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:31:59',
                'updated_at' => '2025-08-10 11:31:59'
            ],
            [
                'id' => 62,
                'transaction_id' => 130,
                'menu_id' => 5,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:31:59',
                'updated_at' => '2025-08-10 11:31:59'
            ],
            [
                'id' => 63,
                'transaction_id' => 130,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:31:59',
                'updated_at' => '2025-08-10 11:31:59'
            ],
            [
                'id' => 64,
                'transaction_id' => 130,
                'menu_id' => 6,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:31:59',
                'updated_at' => '2025-08-10 11:31:59'
            ],
            [
                'id' => 65,
                'transaction_id' => 131,
                'menu_id' => 5,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 66,
                'transaction_id' => 131,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 67,
                'transaction_id' => 131,
                'menu_id' => 26,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 68,
                'transaction_id' => 131,
                'menu_id' => 69,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 69,
                'transaction_id' => 131,
                'menu_id' => 52,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:37:43',
                'updated_at' => '2025-08-10 11:37:43'
            ],
            [
                'id' => 70,
                'transaction_id' => 132,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:46:34',
                'updated_at' => '2025-08-10 11:46:34'
            ],
            [
                'id' => 71,
                'transaction_id' => 132,
                'menu_id' => 68,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 11:46:34',
                'updated_at' => '2025-08-10 11:46:34'
            ],
            [
                'id' => 72,
                'transaction_id' => 132,
                'menu_id' => 76,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:46:34',
                'updated_at' => '2025-08-10 11:46:34'
            ],
            [
                'id' => 73,
                'transaction_id' => 133,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:47:49',
                'updated_at' => '2025-08-10 11:47:49'
            ],
            [
                'id' => 74,
                'transaction_id' => 134,
                'menu_id' => 91,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:50:21',
                'updated_at' => '2025-08-10 11:50:21'
            ],
            [
                'id' => 75,
                'transaction_id' => 135,
                'menu_id' => 2,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:59:52',
                'updated_at' => '2025-08-10 11:59:52'
            ],
            [
                'id' => 76,
                'transaction_id' => 135,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:59:52',
                'updated_at' => '2025-08-10 11:59:52'
            ],
            [
                'id' => 77,
                'transaction_id' => 135,
                'menu_id' => 76,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:59:52',
                'updated_at' => '2025-08-10 11:59:52'
            ],
            [
                'id' => 78,
                'transaction_id' => 135,
                'menu_id' => 91,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 11:59:52',
                'updated_at' => '2025-08-10 11:59:52'
            ],
            [
                'id' => 79,
                'transaction_id' => 136,
                'menu_id' => 77,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:01:13',
                'updated_at' => '2025-08-10 12:01:13'
            ],
            [
                'id' => 80,
                'transaction_id' => 137,
                'menu_id' => 52,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:03:38',
                'updated_at' => '2025-08-10 12:03:38'
            ],
            [
                'id' => 81,
                'transaction_id' => 138,
                'menu_id' => 23,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:07:16',
                'updated_at' => '2025-08-10 12:07:16'
            ],
            [
                'id' => 82,
                'transaction_id' => 138,
                'menu_id' => 77,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:07:16',
                'updated_at' => '2025-08-10 12:07:16'
            ],
            [
                'id' => 83,
                'transaction_id' => 138,
                'menu_id' => 20,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:07:16',
                'updated_at' => '2025-08-10 12:07:16'
            ],
            [
                'id' => 84,
                'transaction_id' => 139,
                'menu_id' => 23,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:16:23',
                'updated_at' => '2025-08-10 12:16:23'
            ],
            [
                'id' => 85,
                'transaction_id' => 139,
                'menu_id' => 93,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:16:23',
                'updated_at' => '2025-08-10 12:16:23'
            ],
            [
                'id' => 86,
                'transaction_id' => 139,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:16:23',
                'updated_at' => '2025-08-10 12:16:23'
            ],
            [
                'id' => 87,
                'transaction_id' => 139,
                'menu_id' => 46,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:16:23',
                'updated_at' => '2025-08-10 12:16:23'
            ],
            [
                'id' => 88,
                'transaction_id' => 140,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:18:32',
                'updated_at' => '2025-08-10 12:18:32'
            ],
            [
                'id' => 89,
                'transaction_id' => 140,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:18:32',
                'updated_at' => '2025-08-10 12:18:32'
            ],
            [
                'id' => 90,
                'transaction_id' => 141,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:26:14',
                'updated_at' => '2025-08-10 12:26:14'
            ],
            [
                'id' => 91,
                'transaction_id' => 141,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:26:14',
                'updated_at' => '2025-08-10 12:26:14'
            ],
            [
                'id' => 92,
                'transaction_id' => 142,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:30:19',
                'updated_at' => '2025-08-10 12:30:19'
            ],
            [
                'id' => 93,
                'transaction_id' => 142,
                'menu_id' => 4,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:30:20',
                'updated_at' => '2025-08-10 12:30:20'
            ],
            [
                'id' => 94,
                'transaction_id' => 142,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:30:20',
                'updated_at' => '2025-08-10 12:30:20'
            ],
            [
                'id' => 95,
                'transaction_id' => 142,
                'menu_id' => 53,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:30:20',
                'updated_at' => '2025-08-10 12:30:20'
            ],
            [
                'id' => 96,
                'transaction_id' => 142,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:30:20',
                'updated_at' => '2025-08-10 12:30:20'
            ],
            [
                'id' => 97,
                'transaction_id' => 143,
                'menu_id' => 93,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:32:39',
                'updated_at' => '2025-08-10 12:32:39'
            ],
            [
                'id' => 98,
                'transaction_id' => 144,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:35:06',
                'updated_at' => '2025-08-10 12:35:06'
            ],
            [
                'id' => 99,
                'transaction_id' => 145,
                'menu_id' => 85,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:36:26',
                'updated_at' => '2025-08-10 12:36:26'
            ],
            [
                'id' => 100,
                'transaction_id' => 145,
                'menu_id' => 50,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:36:26',
                'updated_at' => '2025-08-10 12:36:26'
            ],
            [
                'id' => 101,
                'transaction_id' => 146,
                'menu_id' => 53,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:38:10',
                'updated_at' => '2025-08-10 12:38:10'
            ],
            [
                'id' => 102,
                'transaction_id' => 147,
                'menu_id' => 32,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:44:33',
                'updated_at' => '2025-08-10 12:44:33'
            ],
            [
                'id' => 103,
                'transaction_id' => 148,
                'menu_id' => 76,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:56:40',
                'updated_at' => '2025-08-10 12:56:40'
            ],
            [
                'id' => 104,
                'transaction_id' => 149,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:59:39',
                'updated_at' => '2025-08-10 12:59:39'
            ],
            [
                'id' => 105,
                'transaction_id' => 149,
                'menu_id' => 69,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 12:59:39',
                'updated_at' => '2025-08-10 12:59:39'
            ],
            [
                'id' => 106,
                'transaction_id' => 150,
                'menu_id' => 52,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:10:12',
                'updated_at' => '2025-08-10 13:10:12'
            ],
            [
                'id' => 107,
                'transaction_id' => 150,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:10:12',
                'updated_at' => '2025-08-10 13:10:12'
            ],
            [
                'id' => 108,
                'transaction_id' => 150,
                'menu_id' => 20,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:10:12',
                'updated_at' => '2025-08-10 13:10:12'
            ],
            [
                'id' => 109,
                'transaction_id' => 150,
                'menu_id' => 18,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:10:12',
                'updated_at' => '2025-08-10 13:10:12'
            ],
            [
                'id' => 110,
                'transaction_id' => 151,
                'menu_id' => 32,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 111,
                'transaction_id' => 151,
                'menu_id' => 33,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 112,
                'transaction_id' => 151,
                'menu_id' => 29,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 113,
                'transaction_id' => 151,
                'menu_id' => 6,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 114,
                'transaction_id' => 151,
                'menu_id' => 35,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 115,
                'transaction_id' => 151,
                'menu_id' => 72,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 116,
                'transaction_id' => 151,
                'menu_id' => 23,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 117,
                'transaction_id' => 151,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 118,
                'transaction_id' => 151,
                'menu_id' => 71,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:14:28',
                'updated_at' => '2025-08-10 13:14:28'
            ],
            [
                'id' => 119,
                'transaction_id' => 152,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:15:23',
                'updated_at' => '2025-08-10 13:15:23'
            ],
            [
                'id' => 120,
                'transaction_id' => 152,
                'menu_id' => 39,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:15:23',
                'updated_at' => '2025-08-10 13:15:23'
            ],
            [
                'id' => 121,
                'transaction_id' => 153,
                'menu_id' => 43,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 122,
                'transaction_id' => 153,
                'menu_id' => 85,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 123,
                'transaction_id' => 153,
                'menu_id' => 20,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 124,
                'transaction_id' => 153,
                'menu_id' => 29,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 125,
                'transaction_id' => 153,
                'menu_id' => 27,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:21:34',
                'updated_at' => '2025-08-10 13:21:34'
            ],
            [
                'id' => 126,
                'transaction_id' => 154,
                'menu_id' => 42,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:27:22',
                'updated_at' => '2025-08-10 13:27:22'
            ],
            [
                'id' => 127,
                'transaction_id' => 154,
                'menu_id' => 97,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:27:22',
                'updated_at' => '2025-08-10 13:27:22'
            ],
            [
                'id' => 128,
                'transaction_id' => 155,
                'menu_id' => 91,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 13:39:29',
                'updated_at' => '2025-08-10 13:39:29'
            ],
            [
                'id' => 129,
                'transaction_id' => 155,
                'menu_id' => 21,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:39:29',
                'updated_at' => '2025-08-10 13:39:29'
            ],
            [
                'id' => 130,
                'transaction_id' => 155,
                'menu_id' => 44,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:39:29',
                'updated_at' => '2025-08-10 13:39:29'
            ],
            [
                'id' => 131,
                'transaction_id' => 155,
                'menu_id' => 38,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:39:29',
                'updated_at' => '2025-08-10 13:39:29'
            ],
            [
                'id' => 132,
                'transaction_id' => 156,
                'menu_id' => 2,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:48:27',
                'updated_at' => '2025-08-10 13:48:27'
            ],
            [
                'id' => 133,
                'transaction_id' => 157,
                'menu_id' => 8,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:51:11',
                'updated_at' => '2025-08-10 13:51:11'
            ],
            [
                'id' => 134,
                'transaction_id' => 157,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:51:11',
                'updated_at' => '2025-08-10 13:51:11'
            ],
            [
                'id' => 135,
                'transaction_id' => 158,
                'menu_id' => 36,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 13:52:41',
                'updated_at' => '2025-08-10 13:52:41'
            ],
            [
                'id' => 136,
                'transaction_id' => 159,
                'menu_id' => 66,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 14:26:06',
                'updated_at' => '2025-08-10 14:26:06'
            ],
            [
                'id' => 137,
                'transaction_id' => 159,
                'menu_id' => 48,
                'quantity' => 3,
                'note' => null,
                'created_at' => '2025-08-10 14:26:06',
                'updated_at' => '2025-08-10 14:26:06'
            ],
            [
                'id' => 138,
                'transaction_id' => 160,
                'menu_id' => 48,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 14:30:50',
                'updated_at' => '2025-08-10 14:30:50'
            ],
            [
                'id' => 139,
                'transaction_id' => 162,
                'menu_id' => 45,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 14:36:10',
                'updated_at' => '2025-08-10 14:36:10'
            ],
            [
                'id' => 140,
                'transaction_id' => 163,
                'menu_id' => 1,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 15:09:12',
                'updated_at' => '2025-08-10 15:09:12'
            ],
            [
                'id' => 141,
                'transaction_id' => 163,
                'menu_id' => 77,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 15:09:12',
                'updated_at' => '2025-08-10 15:09:12'
            ],
            [
                'id' => 142,
                'transaction_id' => 164,
                'menu_id' => 47,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 15:22:30',
                'updated_at' => '2025-08-10 15:22:30'
            ],
            [
                'id' => 143,
                'transaction_id' => 164,
                'menu_id' => 14,
                'quantity' => 2,
                'note' => null,
                'created_at' => '2025-08-10 15:22:30',
                'updated_at' => '2025-08-10 15:22:30'
            ],
            [
                'id' => 144,
                'transaction_id' => 164,
                'menu_id' => 96,
                'quantity' => 1,
                'note' => null,
                'created_at' => '2025-08-10 15:22:30',
                'updated_at' => '2025-08-10 15:22:30'
            ]
        ];

        $transaction_details_variant = [
            [
                "transaction_detail_id" => "2",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 03=>18=>19",
                "updated_at" => "2025-08-10 03=>18=>19"
            ],
            [
                "transaction_detail_id" => "3",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 03=>18=>19",
                "updated_at" => "2025-08-10 03=>18=>19"
            ],
            [
                "transaction_detail_id" => "4",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 03=>18=>19",
                "updated_at" => "2025-08-10 03=>18=>19"
            ],
            [
                "transaction_detail_id" => "9",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 04=>41=>50",
                "updated_at" => "2025-08-10 04=>41=>50"
            ],
            [
                "transaction_detail_id" => "11",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 04=>43=>49",
                "updated_at" => "2025-08-10 04=>43=>49"
            ],
            [
                "transaction_detail_id" => "11",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 04=>43=>49",
                "updated_at" => "2025-08-10 04=>43=>49"
            ],
            [
                "transaction_detail_id" => "11",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 04=>43=>49",
                "updated_at" => "2025-08-10 04=>43=>49"
            ],
            [
                "transaction_detail_id" => "12",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 04=>48=>47",
                "updated_at" => "2025-08-10 04=>48=>47"
            ],
            [
                "transaction_detail_id" => "15",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 06=>25=>32",
                "updated_at" => "2025-08-10 06=>25=>32"
            ],
            [
                "transaction_detail_id" => "16",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 06=>25=>32",
                "updated_at" => "2025-08-10 06=>25=>32"
            ],
            [
                "transaction_detail_id" => "17",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 06=>25=>32",
                "updated_at" => "2025-08-10 06=>25=>32"
            ],
            [
                "transaction_detail_id" => "18",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 06=>25=>32",
                "updated_at" => "2025-08-10 06=>25=>32"
            ],
            [
                "transaction_detail_id" => "19",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 06=>25=>32",
                "updated_at" => "2025-08-10 06=>25=>32"
            ],
            [
                "transaction_detail_id" => "20",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 06=>51=>09",
                "updated_at" => "2025-08-10 06=>51=>09"
            ],
            [
                "transaction_detail_id" => "22",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 07=>02=>18",
                "updated_at" => "2025-08-10 07=>02=>18"
            ],
            [
                "transaction_detail_id" => "22",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 07=>02=>18",
                "updated_at" => "2025-08-10 07=>02=>18"
            ],
            [
                "transaction_detail_id" => "22",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 07=>02=>18",
                "updated_at" => "2025-08-10 07=>02=>18"
            ],
            [
                "transaction_detail_id" => "23",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 07=>02=>19",
                "updated_at" => "2025-08-10 07=>02=>19"
            ],
            [
                "transaction_detail_id" => "24",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 07=>11=>30",
                "updated_at" => "2025-08-10 07=>11=>30"
            ],
            [
                "transaction_detail_id" => "24",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 07=>11=>30",
                "updated_at" => "2025-08-10 07=>11=>30"
            ],
            [
                "transaction_detail_id" => "24",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 07=>11=>30",
                "updated_at" => "2025-08-10 07=>11=>30"
            ],
            [
                "transaction_detail_id" => "25",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 07=>35=>25",
                "updated_at" => "2025-08-10 07=>35=>25"
            ],
            [
                "transaction_detail_id" => "26",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 08=>18=>24",
                "updated_at" => "2025-08-10 08=>18=>24"
            ],
            [
                "transaction_detail_id" => "27",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 08=>18=>24",
                "updated_at" => "2025-08-10 08=>18=>24"
            ],
            [
                "transaction_detail_id" => "27",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 08=>18=>24",
                "updated_at" => "2025-08-10 08=>18=>24"
            ],
            [
                "transaction_detail_id" => "28",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "28",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "28",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "29",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "30",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "31",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 08=>53=>33",
                "updated_at" => "2025-08-10 08=>53=>33"
            ],
            [
                "transaction_detail_id" => "33",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>06=>30",
                "updated_at" => "2025-08-10 09=>06=>30"
            ],
            [
                "transaction_detail_id" => "35",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>06=>30",
                "updated_at" => "2025-08-10 09=>06=>30"
            ],
            [
                "transaction_detail_id" => "35",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 09=>06=>30",
                "updated_at" => "2025-08-10 09=>06=>30"
            ],
            [
                "transaction_detail_id" => "36",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>06=>30",
                "updated_at" => "2025-08-10 09=>06=>30"
            ],
            [
                "transaction_detail_id" => "38",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>06=>30",
                "updated_at" => "2025-08-10 09=>06=>30"
            ],
            [
                "transaction_detail_id" => "39",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>07=>43",
                "updated_at" => "2025-08-10 09=>07=>43"
            ],
            [
                "transaction_detail_id" => "39",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 09=>07=>43",
                "updated_at" => "2025-08-10 09=>07=>43"
            ],
            [
                "transaction_detail_id" => "39",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 09=>07=>43",
                "updated_at" => "2025-08-10 09=>07=>43"
            ],
            [
                "transaction_detail_id" => "41",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>29=>35",
                "updated_at" => "2025-08-10 09=>29=>35"
            ],
            [
                "transaction_detail_id" => "41",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 09=>29=>35",
                "updated_at" => "2025-08-10 09=>29=>35"
            ],
            [
                "transaction_detail_id" => "41",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 09=>29=>35",
                "updated_at" => "2025-08-10 09=>29=>35"
            ],
            [
                "transaction_detail_id" => "42",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>29=>35",
                "updated_at" => "2025-08-10 09=>29=>35"
            ],
            [
                "transaction_detail_id" => "42",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 09=>29=>35",
                "updated_at" => "2025-08-10 09=>29=>35"
            ],
            [
                "transaction_detail_id" => "44",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>43=>36",
                "updated_at" => "2025-08-10 09=>43=>36"
            ],
            [
                "transaction_detail_id" => "44",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 09=>43=>36",
                "updated_at" => "2025-08-10 09=>43=>36"
            ],
            [
                "transaction_detail_id" => "44",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 09=>43=>36",
                "updated_at" => "2025-08-10 09=>43=>36"
            ],
            [
                "transaction_detail_id" => "45",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>47=>20",
                "updated_at" => "2025-08-10 09=>47=>20"
            ],
            [
                "transaction_detail_id" => "46",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 09=>47=>20",
                "updated_at" => "2025-08-10 09=>47=>20"
            ],
            [
                "transaction_detail_id" => "47",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 09=>47=>20",
                "updated_at" => "2025-08-10 09=>47=>20"
            ],
            [
                "transaction_detail_id" => "50",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 10=>01=>44",
                "updated_at" => "2025-08-10 10=>01=>44"
            ],
            [
                "transaction_detail_id" => "51",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 10=>01=>44",
                "updated_at" => "2025-08-10 10=>01=>44"
            ],
            [
                "transaction_detail_id" => "52",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 10=>01=>44",
                "updated_at" => "2025-08-10 10=>01=>44"
            ],
            [
                "transaction_detail_id" => "52",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 10=>01=>44",
                "updated_at" => "2025-08-10 10=>01=>44"
            ],
            [
                "transaction_detail_id" => "52",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 10=>01=>44",
                "updated_at" => "2025-08-10 10=>01=>44"
            ],
            [
                "transaction_detail_id" => "53",
                "variant_options_id" => "35",
                "variant_id" => "8",
                "created_at" => "2025-08-10 10=>16=>47",
                "updated_at" => "2025-08-10 10=>16=>47"
            ],
            [
                "transaction_detail_id" => "54",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 10=>16=>47",
                "updated_at" => "2025-08-10 10=>16=>47"
            ],
            [
                "transaction_detail_id" => "54",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 10=>16=>47",
                "updated_at" => "2025-08-10 10=>16=>47"
            ],
            [
                "transaction_detail_id" => "57",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 11=>15=>26",
                "updated_at" => "2025-08-10 11=>15=>26"
            ],
            [
                "transaction_detail_id" => "58",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 11=>23=>21",
                "updated_at" => "2025-08-10 11=>23=>21"
            ],
            [
                "transaction_detail_id" => "59",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 11=>23=>21",
                "updated_at" => "2025-08-10 11=>23=>21"
            ],
            [
                "transaction_detail_id" => "61",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>31=>59",
                "updated_at" => "2025-08-10 11=>31=>59"
            ],
            [
                "transaction_detail_id" => "61",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 11=>31=>59",
                "updated_at" => "2025-08-10 11=>31=>59"
            ],
            [
                "transaction_detail_id" => "62",
                "variant_options_id" => "10",
                "variant_id" => "4",
                "created_at" => "2025-08-10 11=>31=>59",
                "updated_at" => "2025-08-10 11=>31=>59"
            ],
            [
                "transaction_detail_id" => "63",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>31=>59",
                "updated_at" => "2025-08-10 11=>31=>59"
            ],
            [
                "transaction_detail_id" => "65",
                "variant_options_id" => "9",
                "variant_id" => "4",
                "created_at" => "2025-08-10 11=>37=>43",
                "updated_at" => "2025-08-10 11=>37=>43"
            ],
            [
                "transaction_detail_id" => "68",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>37=>43",
                "updated_at" => "2025-08-10 11=>37=>43"
            ],
            [
                "transaction_detail_id" => "69",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>37=>43",
                "updated_at" => "2025-08-10 11=>37=>43"
            ],
            [
                "transaction_detail_id" => "70",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>46=>34",
                "updated_at" => "2025-08-10 11=>46=>34"
            ],
            [
                "transaction_detail_id" => "70",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 11=>46=>34",
                "updated_at" => "2025-08-10 11=>46=>34"
            ],
            [
                "transaction_detail_id" => "73",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>47=>49",
                "updated_at" => "2025-08-10 11=>47=>49"
            ],
            [
                "transaction_detail_id" => "75",
                "variant_options_id" => "10",
                "variant_id" => "4",
                "created_at" => "2025-08-10 11=>59=>52",
                "updated_at" => "2025-08-10 11=>59=>52"
            ],
            [
                "transaction_detail_id" => "76",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 11=>59=>52",
                "updated_at" => "2025-08-10 11=>59=>52"
            ],
            [
                "transaction_detail_id" => "80",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>03=>38",
                "updated_at" => "2025-08-10 12=>03=>38"
            ],
            [
                "transaction_detail_id" => "85",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>16=>23",
                "updated_at" => "2025-08-10 12=>16=>23"
            ],
            [
                "transaction_detail_id" => "85",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 12=>16=>23",
                "updated_at" => "2025-08-10 12=>16=>23"
            ],
            [
                "transaction_detail_id" => "87",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>16=>23",
                "updated_at" => "2025-08-10 12=>16=>23"
            ],
            [
                "transaction_detail_id" => "88",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 12=>18=>32",
                "updated_at" => "2025-08-10 12=>18=>32"
            ],
            [
                "transaction_detail_id" => "89",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>18=>32",
                "updated_at" => "2025-08-10 12=>18=>32"
            ],
            [
                "transaction_detail_id" => "90",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>26=>14",
                "updated_at" => "2025-08-10 12=>26=>14"
            ],
            [
                "transaction_detail_id" => "91",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>26=>14",
                "updated_at" => "2025-08-10 12=>26=>14"
            ],
            [
                "transaction_detail_id" => "91",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 12=>26=>14",
                "updated_at" => "2025-08-10 12=>26=>14"
            ],
            [
                "transaction_detail_id" => "91",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 12=>26=>14",
                "updated_at" => "2025-08-10 12=>26=>14"
            ],
            [
                "transaction_detail_id" => "92",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>30=>20",
                "updated_at" => "2025-08-10 12=>30=>20"
            ],
            [
                "transaction_detail_id" => "92",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 12=>30=>20",
                "updated_at" => "2025-08-10 12=>30=>20"
            ],
            [
                "transaction_detail_id" => "93",
                "variant_options_id" => "10",
                "variant_id" => "4",
                "created_at" => "2025-08-10 12=>30=>20",
                "updated_at" => "2025-08-10 12=>30=>20"
            ],
            [
                "transaction_detail_id" => "94",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>30=>20",
                "updated_at" => "2025-08-10 12=>30=>20"
            ],
            [
                "transaction_detail_id" => "95",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 12=>30=>20",
                "updated_at" => "2025-08-10 12=>30=>20"
            ],
            [
                "transaction_detail_id" => "97",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>32=>39",
                "updated_at" => "2025-08-10 12=>32=>39"
            ],
            [
                "transaction_detail_id" => "97",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 12=>32=>39",
                "updated_at" => "2025-08-10 12=>32=>39"
            ],
            [
                "transaction_detail_id" => "98",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>35=>06",
                "updated_at" => "2025-08-10 12=>35=>06"
            ],
            [
                "transaction_detail_id" => "99",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>36=>26",
                "updated_at" => "2025-08-10 12=>36=>26"
            ],
            [
                "transaction_detail_id" => "100",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 12=>36=>26",
                "updated_at" => "2025-08-10 12=>36=>26"
            ],
            [
                "transaction_detail_id" => "101",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 12=>38=>10",
                "updated_at" => "2025-08-10 12=>38=>10"
            ],
            [
                "transaction_detail_id" => "102",
                "variant_options_id" => "27",
                "variant_id" => "7",
                "created_at" => "2025-08-10 12=>44=>33",
                "updated_at" => "2025-08-10 12=>44=>33"
            ],
            [
                "transaction_detail_id" => "104",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>59=>39",
                "updated_at" => "2025-08-10 12=>59=>39"
            ],
            [
                "transaction_detail_id" => "105",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 12=>59=>39",
                "updated_at" => "2025-08-10 12=>59=>39"
            ],
            [
                "transaction_detail_id" => "106",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>10=>12",
                "updated_at" => "2025-08-10 13=>10=>12"
            ],
            [
                "transaction_detail_id" => "107",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 13=>10=>12",
                "updated_at" => "2025-08-10 13=>10=>12"
            ],
            [
                "transaction_detail_id" => "110",
                "variant_options_id" => "28",
                "variant_id" => "7",
                "created_at" => "2025-08-10 13=>14=>28",
                "updated_at" => "2025-08-10 13=>14=>28"
            ],
            [
                "transaction_detail_id" => "111",
                "variant_options_id" => "28",
                "variant_id" => "7",
                "created_at" => "2025-08-10 13=>14=>28",
                "updated_at" => "2025-08-10 13=>14=>28"
            ],
            [
                "transaction_detail_id" => "115",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 13=>14=>28",
                "updated_at" => "2025-08-10 13=>14=>28"
            ],
            [
                "transaction_detail_id" => "117",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>14=>28",
                "updated_at" => "2025-08-10 13=>14=>28"
            ],
            [
                "transaction_detail_id" => "118",
                "variant_options_id" => "36",
                "variant_id" => "8",
                "created_at" => "2025-08-10 13=>14=>28",
                "updated_at" => "2025-08-10 13=>14=>28"
            ],
            [
                "transaction_detail_id" => "119",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>15=>23",
                "updated_at" => "2025-08-10 13=>15=>23"
            ],
            [
                "transaction_detail_id" => "119",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 13=>15=>23",
                "updated_at" => "2025-08-10 13=>15=>23"
            ],
            [
                "transaction_detail_id" => "120",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>15=>23",
                "updated_at" => "2025-08-10 13=>15=>23"
            ],
            [
                "transaction_detail_id" => "121",
                "variant_options_id" => "13",
                "variant_id" => "5",
                "created_at" => "2025-08-10 13=>21=>34",
                "updated_at" => "2025-08-10 13=>21=>34"
            ],
            [
                "transaction_detail_id" => "122",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>21=>34",
                "updated_at" => "2025-08-10 13=>21=>34"
            ],
            [
                "transaction_detail_id" => "126",
                "variant_options_id" => "12",
                "variant_id" => "5",
                "created_at" => "2025-08-10 13=>27=>22",
                "updated_at" => "2025-08-10 13=>27=>22"
            ],
            [
                "transaction_detail_id" => "130",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>39=>29",
                "updated_at" => "2025-08-10 13=>39=>29"
            ],
            [
                "transaction_detail_id" => "130",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 13=>39=>29",
                "updated_at" => "2025-08-10 13=>39=>29"
            ],
            [
                "transaction_detail_id" => "132",
                "variant_options_id" => "9",
                "variant_id" => "4",
                "created_at" => "2025-08-10 13=>48=>27",
                "updated_at" => "2025-08-10 13=>48=>27"
            ],
            [
                "transaction_detail_id" => "134",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 13=>51=>11",
                "updated_at" => "2025-08-10 13=>51=>11"
            ],
            [
                "transaction_detail_id" => "134",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 13=>51=>11",
                "updated_at" => "2025-08-10 13=>51=>11"
            ],
            [
                "transaction_detail_id" => "134",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 13=>51=>11",
                "updated_at" => "2025-08-10 13=>51=>11"
            ],
            [
                "transaction_detail_id" => "136",
                "variant_options_id" => "32",
                "variant_id" => "6",
                "created_at" => "2025-08-10 14=>26=>06",
                "updated_at" => "2025-08-10 14=>26=>06"
            ],
            [
                "transaction_detail_id" => "137",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 14=>26=>06",
                "updated_at" => "2025-08-10 14=>26=>06"
            ],
            [
                "transaction_detail_id" => "138",
                "variant_options_id" => "1",
                "variant_id" => "1",
                "created_at" => "2025-08-10 14=>30=>50",
                "updated_at" => "2025-08-10 14=>30=>50"
            ],
            [
                "transaction_detail_id" => "139",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 14=>36=>10",
                "updated_at" => "2025-08-10 14=>36=>10"
            ],
            [
                "transaction_detail_id" => "139",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 14=>36=>10",
                "updated_at" => "2025-08-10 14=>36=>10"
            ],
            [
                "transaction_detail_id" => "140",
                "variant_options_id" => "2",
                "variant_id" => "1",
                "created_at" => "2025-08-10 15=>09=>12",
                "updated_at" => "2025-08-10 15=>09=>12"
            ],
            [
                "transaction_detail_id" => "140",
                "variant_options_id" => "4",
                "variant_id" => "2",
                "created_at" => "2025-08-10 15=>09=>12",
                "updated_at" => "2025-08-10 15=>09=>12"
            ],
            [
                "transaction_detail_id" => "140",
                "variant_options_id" => "16",
                "variant_id" => "3",
                "created_at" => "2025-08-10 15=>09=>12",
                "updated_at" => "2025-08-10 15=>09=>12"
            ]
        ];

        $merge = [];


        foreach ($transactions as $transaction) {
            $id = $transaction['id'];
            //find transaction_detail by id

            //set data same as transaction just remove id
            $data = $transaction;
            unset($data['id']);

            $transactionDetail = array_filter($transaction_details, fn($detail) => $detail['transaction_id'] === $id);
            $data['transaction_details'] = $transactionDetail;


            foreach ($transactionDetail as $i => $detail) {
                unset($data['transaction_details'][$i]['id']);
                unset($data['transaction_details'][$i]['transaction_id']);
                $detail_id = $detail['id'];
                $variants = array_filter($transaction_details_variant, fn($variant) => (int) $variant['transaction_detail_id'] === $detail_id);
                if (!empty($variants)) {
                    $data['transaction_details'][$i]['variant'] = $variants;
                    foreach ($data['transaction_details'][$i]['variant'] as $j => $variant) {
                        unset($data['transaction_details'][$i]['variant'][$j]['id']);
                        unset($data['transaction_details'][$i]['variant'][$j]['transaction_detail_id']);
                    }
                } else {
                    $data['transaction_details'][$i]['variant'] = [];
                }
            }

            $merge[] = $data;
        }
        try {
            DB::beginTransaction();
            foreach ($merge as $item) {
                $createdAt = str_replace('=>', ':', $item['created_at']);
                $updatedAt = str_replace('=>', ':', $item['updated_at']);
                $id = Transaction::create([
                    'order_id' => $item['order_id'],
                    'user_id' => $item['user_id'],
                    'type' => $item['type'],
                    'status' => $item['status'],
                    'table_number' => $item['table_number'],
                    'customer_name' => $item['customer_name'],
                    'sub_total' => $item['sub_total'],
                    'total_price' => $item['total_price'],
                    'discount' => $item['discount'],
                    'cash' => $item['cash'],
                    'change' => $item['change'],
                    'payment_method' => $item['payment_method'],
                    'note' => $item['note'],
                    'payment_proof' => $item['payment_proof'],
                    'created_at' => Carbon::parse($createdAt),
                    'updated_at' => Carbon::parse($updatedAt)
                ])->id;
                foreach ($item['transaction_details'] as $detail) {
                    $detailCreatedAt = str_replace('=>', ':', $detail['created_at']);
                    $detailUpdatedAt = str_replace('=>', ':', $detail['updated_at']);
                    $detail_id = TransactionDetail::create([
                        'transaction_id' => $id,
                        'menu_id' => $detail['menu_id'],
                        'quantity' => $detail['quantity'],
                        'note' => $detail['note'],
                        'created_at' => Carbon::parse($detailCreatedAt),
                        'updated_at' => Carbon::parse($detailUpdatedAt)
                    ])->id;
                    foreach ($detail['variant'] as $variant) {
                        $variantCreatedAt = str_replace('=>', ':', $variant['created_at']);
                        $variantUpdatedAt = str_replace('=>', ':', $variant['updated_at']);
                        TransactionDetailVariant::create([
                            'transaction_detail_id' => $detail_id,
                            'variant_options_id' => $variant['variant_options_id'],
                            'variant_id' => $variant['variant_id'],
                            'created_at' => Carbon::parse($variantCreatedAt),
                            'updated_at' => Carbon::parse($variantUpdatedAt)
                        ]);
                    }
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'Transaction data imported successfully',
                'data' => $merge
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to import transaction data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
