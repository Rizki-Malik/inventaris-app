import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Transaction {
    id: string;
    quantity: number;
    transaction_type: 'in' | 'out';
    transaction_date: string;
    notes: string;
    item: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Item {
    id: string;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transactions',
    },
];

export default function Transactions({
    transactions,
    items = []
}: {
    transactions: Transaction[];
    items?: Item[];
}) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const createForm = useForm({
        item_id: '',
        quantity: '1',
        transaction_type: 'in',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const editForm = useForm({
        item_id: '',
        quantity: '',
        transaction_type: '',
        transaction_date: '',
        notes: '',
    });

    const deleteForm = useForm({});

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('transactions.store'), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('transactions.update', selectedTransaction?.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        deleteForm.delete(route('transactions.destroy', selectedTransaction?.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const openViewDialog = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsViewDialogOpen(true);
    };

    const openEditDialog = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        editForm.setData({
            item_id: transaction.item.id,
            quantity: transaction.quantity.toString(),
            transaction_type: transaction.transaction_type,
            transaction_date: new Date(transaction.transaction_date).toISOString().split('T')[0],
            notes: transaction.notes,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: 'item.name',
            header: 'Nama Barang',
        },
        {
            accessorKey: 'quantity',
            header: 'Jumlah',
        },
        {
            accessorKey: 'transaction_type',
            header: 'Tipe',
            cell: ({ row }) => {
                const type = row.getValue('transaction_type') as string;
                return type === 'in' ? 'Masuk' : 'Keluar';
            },
        },
        {
            accessorKey: 'transaction_date',
            header: 'Tanggal',
            cell: ({ row }) => {
                const date = row.getValue('transaction_date') as string;
                return formatDate(date);
            },
        },
        {
            accessorKey: 'user.name',
            header: 'Pengguna',
        },
        {
            accessorKey: 'notes',
            header: 'Catatan',
            cell: ({ row }) => {
                const notes = row.getValue('notes') as string;
                return notes ? (notes.length > 30 ? `${notes.substring(0, 30)}...` : notes) : '-';
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const transaction = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openViewDialog(transaction)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(transaction)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(transaction)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Data Transaksi</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Transaksi
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk menambahkan transaksi baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="item_id" className="text-sm font-medium">Nama Barang</label>
                                        <Select
                                            value={createForm.data.item_id}
                                            onValueChange={(value) => createForm.setData('item_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih barang" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {items.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.item_id && (
                                            <p className="text-sm text-destructive">{createForm.errors.item_id}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="quantity" className="text-sm font-medium">Jumlah</label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            value={createForm.data.quantity}
                                            onChange={(e) => createForm.setData('quantity', e.target.value)}
                                            placeholder="Jumlah barang"
                                        />
                                        {createForm.errors.quantity && (
                                            <p className="text-sm text-destructive">{createForm.errors.quantity}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="transaction_type" className="text-sm font-medium">Tipe Transaksi</label>
                                        <Select
                                            value={createForm.data.transaction_type}
                                            onValueChange={(value) => createForm.setData('transaction_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih tipe transaksi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in">Barang Masuk</SelectItem>
                                                <SelectItem value="out">Barang Keluar</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.transaction_type && (
                                            <p className="text-sm text-destructive">{createForm.errors.transaction_type}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="transaction_date" className="text-sm font-medium">Tanggal Transaksi</label>
                                        <Input
                                            id="transaction_date"
                                            type="date"
                                            value={createForm.data.transaction_date}
                                            onChange={(e) => createForm.setData('transaction_date', e.target.value)}
                                        />
                                        {createForm.errors.transaction_date && (
                                            <p className="text-sm text-destructive">{createForm.errors.transaction_date}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="notes" className="text-sm font-medium">Catatan</label>
                                        <Textarea
                                            id="notes"
                                            value={createForm.data.notes}
                                            onChange={(e) => createForm.setData('notes', e.target.value)}
                                            placeholder="Catatan transaksi"
                                            rows={3}
                                        />
                                        {createForm.errors.notes && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={createForm.processing}>
                                        {createForm.processing ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border">
                    <DataTable columns={columns} data={transactions} searchKey="name" title='List Transaksi' />
                </div>

                {/* View Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detail Transaksi</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Nama Barang</h3>
                                    <p className="mt-1">{selectedTransaction.item.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Jumlah</h3>
                                    <p className="mt-1">{selectedTransaction.quantity}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Tipe Transaksi</h3>
                                    <p className="mt-1">{selectedTransaction.transaction_type === 'in' ? 'Barang Masuk' : 'Barang Keluar'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Tanggal Transaksi</h3>
                                    <p className="mt-1">{formatDate(selectedTransaction.transaction_date)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Pengguna</h3>
                                    <p className="mt-1">{selectedTransaction.user.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Catatan</h3>
                                    <p className="mt-1 whitespace-pre-wrap">{selectedTransaction.notes || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Dibuat pada</h3>
                                    <p className="mt-1">{formatDate(selectedTransaction.created_at)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Diperbarui pada</h3>
                                    <p className="mt-1">{formatDate(selectedTransaction.updated_at)}</p>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button>Tutup</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Transaksi</DialogTitle>
                            <DialogDescription>Ubah informasi transaksi.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-item_id" className="text-sm font-medium">Nama Barang</label>
                                    <Select
                                        value={editForm.data.item_id}
                                        onValueChange={(value) => editForm.setData('item_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih barang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.item_id && (
                                        <p className="text-sm text-destructive">{editForm.errors.item_id}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-quantity" className="text-sm font-medium">Jumlah</label>
                                    <Input
                                        id="edit-quantity"
                                        type="number"
                                        min="1"
                                        value={editForm.data.quantity}
                                        onChange={(e) => editForm.setData('quantity', e.target.value)}
                                        placeholder="Jumlah barang"
                                    />
                                    {editForm.errors.quantity && (
                                        <p className="text-sm text-destructive">{editForm.errors.quantity}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-transaction_type" className="text-sm font-medium">Tipe Transaksi</label>
                                    <Select
                                        value={editForm.data.transaction_type}
                                        onValueChange={(value) => editForm.setData('transaction_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe transaksi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in">Barang Masuk</SelectItem>
                                            <SelectItem value="out">Barang Keluar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.transaction_type && (
                                        <p className="text-sm text-destructive">{editForm.errors.transaction_type}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-transaction_date" className="text-sm font-medium">Tanggal Transaksi</label>
                                    <Input
                                        id="edit-transaction_date"
                                        type="date"
                                        value={editForm.data.transaction_date}
                                        onChange={(e) => editForm.setData('transaction_date', e.target.value)}
                                    />
                                    {editForm.errors.transaction_date && (
                                        <p className="text-sm text-destructive">{editForm.errors.transaction_date}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-notes" className="text-sm font-medium">Catatan</label>
                                    <Textarea
                                        id="edit-notes"
                                        value={editForm.data.notes}
                                        onChange={(e) => editForm.setData('notes', e.target.value)}
                                        placeholder="Catatan transaksi"
                                        rows={3}
                                    />
                                    {editForm.errors.notes && (
                                        <p className="text-sm text-destructive">
                                            {editForm.errors.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hapus Transaksi</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus transaksi untuk "{selectedTransaction?.item.name}"?
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeleteSubmit}>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" type="submit" disabled={deleteForm.processing}>
                                    {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
