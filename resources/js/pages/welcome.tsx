import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clipboard, BarChart2, Package, Search } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Sistem Inventaris Barang">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-xl font-bold">SistemInventaris</span>
                        </div>
                        <nav className="flex items-center justify-end gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-2xl font-bold">Sistem Inventaris Barang</h1>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Kelola inventaris barang Anda dengan mudah dan efisien.
                                <br />
                                Lacak, monitor, dan analisis semua aset dalam satu platform.
                            </p>
                            <h2 className="mb-2 font-medium">Fitur Utama</h2>
                            <ul className="mb-8 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <Clipboard className="h-4 w-4 text-[#f53003] dark:text-[#FF4433]" />
                                        </span>
                                    </span>
                                    <span>
                                        <strong className="font-medium">Pencatatan Inventaris</strong>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Catat dan kelola semua barang dengan detail lengkap</p>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] before:border-[#e3e3e0] dark:before:border-[#3E3E3A] before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <Search className="h-4 w-4 text-[#f53003] dark:text-[#FF4433]" />
                                        </span>
                                    </span>
                                    <span>
                                        <strong className="font-medium">Pencarian Cepat</strong>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Temukan barang dengan mudah menggunakan fitur pencarian</p>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <BarChart2 className="h-4 w-4 text-[#f53003] dark:text-[#FF4433]" />
                                        </span>
                                    </span>
                                    <span>
                                        <strong className="font-medium">Laporan & Analisis</strong>
                                        <p className="text-[#706f6c] dark:text-[#A1A09A]">Dapatkan laporan dan analisis untuk pengambilan keputusan</p>
                                    </span>
                                </li>
                            </ul>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                        >
                                            Masuk ke Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('register')}
                                            className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                        >
                                            Mulai Sekarang
                                        </Link>
                                    )}
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                            <div className="flex h-full items-center justify-center">
                                <Package className="h-32 w-32 text-[#F53003] dark:text-[#F61500]" />
                                <div className="absolute bottom-4 right-4 text-right">
                                    <h3 className="text-lg font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Sistem Inventaris</h3>
                                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Solusi terbaik untuk manajemen aset</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
