import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BarChart, LineChart, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Definisi tipe data untuk statistik dan transaksi
interface DashboardStats {
    totalItems: number;
    totalCategories: number;
    totalLocations: number;
    lowStockItems: number;
}

interface Transaction {
    id: number;
    item_name: string;
    quantity: number;
    transaction_date: string;
    transaction_type: 'in' | 'out';
    notes: string;
}

// Nilai awal untuk state
const initialStats: DashboardStats = {
    totalItems: 0,
    totalCategories: 0,
    totalLocations: 0,
    lowStockItems: 0,
};

// Tipe data untuk grafik
interface MonthlyTransactionData {
    name: string;
    masuk: number;
    keluar: number;
}

interface CategoryDistributionData {
    name: string;
    jumlah: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyTransactionData[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryDistributionData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Kolom untuk tabel transaksi terbaru
    const columns = [
        {
            accessorKey: 'item_name',
            header: 'Nama Barang',
        },
        {
            accessorKey: 'quantity',
            header: 'Jumlah',
        },
        {
            accessorKey: 'transaction_date',
            header: 'Tanggal',
        },
        {
            accessorKey: 'transaction_type',
            header: 'Tipe',
            cell: ({ row }: { row: any }) => {
                const type = row.getValue('transaction_type') as string;
                return type === 'in' ? 'Masuk' : 'Keluar';
            },
        },
        {
            accessorKey: 'notes',
            header: 'Catatan',
        },
    ];

    // Mengambil data dari API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Mengambil data statistik
                const statsResponse = await axios.get('/api/dashboard/stats');
                setStats(statsResponse.data);

                // Mengambil data transaksi terbaru
                const transactionsResponse = await axios.get('/api/dashboard/recent-transactions');
                setRecentTransactions(transactionsResponse.data);

                // Mengambil data transaksi bulanan untuk grafik
                const monthlyResponse = await axios.get('/api/dashboard/monthly-transactions');
                setMonthlyData(monthlyResponse.data);

                // Mengambil data distribusi kategori untuk grafik
                const categoryResponse = await axios.get('/api/dashboard/category-distribution');
                setCategoryData(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Gagal memuat data dashboard. Silakan coba lagi nanti.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Komponen loading
    const LoadingIndicator = () => (
        <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Memuat data...</span>
        </div>
    );

    // Komponen untuk menampilkan pesan ketika data kosong
    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex h-40 w-full flex-col items-center justify-center text-muted-foreground">
            <p>{message}</p>
        </div>
    );

    // Komponen untuk menampilkan pesan error
    const ErrorState = ({ message }: { message: string }) => (
        <div className="flex h-40 w-full flex-col items-center justify-center text-red-500">
            <p>{message}</p>
        </div>
    );

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <ErrorState message={error} />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Kartu Statistik */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M2 17V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
                                <path d="M6 12h4" />
                                <path d="M14 12h4" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                                    <p className="text-xs text-muted-foreground">Inventaris aktif</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" x2="12.01" y1="17" y2="17" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats.totalCategories}</div>
                                    <p className="text-xs text-muted-foreground">Jenis kategori</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lokasi</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats.totalLocations}</div>
                                    <p className="text-xs text-muted-foreground">Tempat penyimpanan</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stats.lowStockItems}</div>
                                    <p className="text-xs text-muted-foreground">Perlu pengadaan</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Grafik dan Tabel */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Grafik Transaksi Bulanan */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Transaksi Bulanan</CardTitle>
                            <CardDescription>Perbandingan barang masuk dan keluar per bulan</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            {isLoading ? (
                                <LoadingIndicator />
                            ) : monthlyData.length === 0 ? (
                                <EmptyState message="Belum ada data transaksi bulanan" />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsBarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="masuk" fill="#4ade80" name="Barang Masuk" />
                                        <Bar dataKey="keluar" fill="#f87171" name="Barang Keluar" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Grafik Kategori */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Distribusi Kategori</CardTitle>
                            <CardDescription>Jumlah barang per kategori</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <LoadingIndicator />
                            ) : categoryData.length === 0 ? (
                                <EmptyState message="Belum ada data kategori" />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsLineChart data={categoryData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="jumlah" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Tabel Transaksi Terbaru */}
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                        <CardDescription>Daftar transaksi barang masuk dan keluar terbaru</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingIndicator />
                        ) : recentTransactions.length === 0 ? (
                            <EmptyState message="Belum ada data transaksi" />
                        ) : (
                            <DataTable columns={columns} data={recentTransactions} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
