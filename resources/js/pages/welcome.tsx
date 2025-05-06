import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clipboard, BarChart2, Package, Search } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Inventaris Barang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[#FDFDFC] via-[#FFF8F7] to-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-[#0a0a0a] dark:via-[#1a0a0a] dark:to-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[1200px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] rounded-lg" />
                            <span className="text-xl font-bold bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] bg-clip-text text-transparent">
                                Inventaris
                            </span>
                        </div>
                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg px-5 py-2 text-sm font-medium transition-all hover:bg-[#fff5f3] dark:hover:bg-[#1f0a07]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-5 py-2 text-sm font-medium transition-all hover:bg-[#fff5f3] dark:hover:bg-[#1f0a07]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-[#FF4433]/20 transition-all hover:shadow-[#FF4433]/30"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <div className="flex w-full max-w-[1200px] items-center justify-center lg:grow">
                    <main className="flex w-full flex-col gap-8 lg:flex-row">
                        <div className="flex-1 rounded-2xl bg-white p-8 shadow-xl dark:bg-[#161615]">
                            <h1 className="mb-4 text-4xl font-bold leading-tight">
                                Kelola Inventaris Barang
                                <br />
                                <span className="bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] bg-clip-text text-transparent">
                                    Lebih Efisien
                                </span>
                            </h1>
                            <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Solusi terintegrasi untuk manajemen aset digital dengan analitik real-time
                                dan kontrol penuh atas inventaris Anda.
                            </p>
                            <div className="mb-8 grid gap-6 md:grid-cols-2">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4433] to-[#FF6B3B]">
                                        <Clipboard className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">Pencatatan Digital</h3>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Otomatisasi pencatatan dengan sistem terintegrasi
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4433] to-[#FF6B3B]">
                                        <Search className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">Pencarian Cerdas</h3>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Temukan barang dalam sekejap dengan AI-powered search
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4433] to-[#FF6B3B]">
                                        <BarChart2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold">Analitik Real-Time</h3>
                                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                            Dashboard interaktif dengan visualisasi data lengkap
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] px-6 py-3 font-medium text-white shadow-lg shadow-[#FF4433]/20 transition-all hover:shadow-[#FF4433]/30"
                                    >
                                        Buka Dashboard →
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-gradient-to-br from-[#FF4433] to-[#FF6B3B] px-6 py-3 font-medium text-white shadow-lg shadow-[#FF4433]/20 transition-all hover:shadow-[#FF4433]/30"
                                    >
                                        Mulai Gratis Sekarang
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFE5E2] to-[#FFF0ED] p-8 lg:w-[500px] dark:from-[#1D0002] dark:to-[#2D0A07]">
                            <div className="relative z-10 text-center">
                                <Package className="mx-auto mb-6 h-24 w-24 text-[#FF4433]" />
                                <div className="rounded-xl bg-white/50 p-6 backdrop-blur-lg dark:bg-[#ffffff08]">
                                    <h3 className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                                        Kelola Tanpa Ribet
                                    </h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Antarmuka intuitif untuk pengalaman terbaik
                                    </p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff40] to-[#ffffff00]" />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
