<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use App\Models\Location;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Mendapatkan statistik untuk dashboard
     */
    public function getStats()
    {
        try {
            $totalItems = Item::count();
            $totalCategories = Category::count();
            $totalLocations = Location::count();

            // Menghitung item dengan stok menipis (kurang dari 5)
            $lowStockItems = Item::where('stock', '<', 5)->count();

            return response()->json([
                'totalItems' => $totalItems,
                'totalCategories' => $totalCategories,
                'totalLocations' => $totalLocations,
                'lowStockItems' => $lowStockItems,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch statistics'], 500);
        }
    }

    /**
     * Mendapatkan transaksi terbaru untuk dashboard
     */
    public function getRecentTransactions()
    {
        try {
            $transactions = Transaction::with('item')
                ->orderBy('transaction_date', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'item_name' => $transaction->item->name ?? 'Unknown Item',
                        'quantity' => $transaction->quantity,
                        'transaction_date' => $transaction->transaction_date->format('Y-m-d'),
                        'transaction_type' => $transaction->transaction_type,
                        'notes' => $transaction->notes ?? '',
                    ];
                });

            return response()->json($transactions);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch recent transactions'], 500);
        }
    }

    /**
     * Mendapatkan data transaksi bulanan untuk grafik
     */
    public function getMonthlyTransactions()
    {
        try {
            $monthlyData = DB::table('transactions')
                ->select(
                    DB::raw('MONTHNAME(transaction_date) as name'),
                    DB::raw('SUM(CASE WHEN transaction_type = "in" THEN quantity ELSE 0 END) as masuk'),
                    DB::raw('SUM(CASE WHEN transaction_type = "out" THEN quantity ELSE 0 END) as keluar')
                )
                ->whereYear('transaction_date', date('Y'))
                ->groupBy('name', DB::raw('MONTH(transaction_date)')) // Add month number for proper ordering
                ->orderBy(DB::raw('MONTH(transaction_date)'))
                ->get();

            return response()->json($monthlyData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch monthly transactions'], 500);
        }
    }

    /**
     * Mendapatkan distribusi kategori untuk grafik
     */
    public function getCategoryDistribution()
    {
        try {
            $categoryData = DB::table('items')
                ->join('categories', 'items.category_id', '=', 'categories.id')
                ->select('categories.name', DB::raw('COUNT(items.id) as jumlah'))
                ->groupBy('categories.id', 'categories.name') // Add category id for proper grouping
                ->orderBy('jumlah', 'desc')
                ->limit(5)
                ->get();

            return response()->json($categoryData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch category distribution'], 500);
        }
    }
}
