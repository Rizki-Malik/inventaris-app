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

interface Item {
    id: string;
    name: string;
    description: string;
    location: {
        id: string;
        name: string;
    };
    category: {
        id: string;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Location {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Barang',
        href: '/items',
    },
];

export default function Items({
    items,
    locations = [],
    categories = []
}: {
    items: Item[];
    locations?: Location[];
    categories?: Category[];
}) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
        location_id: '',
        category_id: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
        location_id: '',
        category_id: '',
    });

    const deleteForm = useForm({});

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('items.store'), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('items.update', selectedItem?.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        deleteForm.delete(route('items.destroy', selectedItem?.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const openViewDialog = (item: Item) => {
        setSelectedItem(item);
        setIsViewDialogOpen(true);
    };

    const openEditDialog = (item: Item) => {
        setSelectedItem(item);
        editForm.setData({
            name: item.name,
            description: item.description,
            location_id: item.location.id,
            category_id: item.category.id,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (item: Item) => {
        setSelectedItem(item);
        setIsDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Item>[] = [
        {
            accessorKey: 'name',
            header: 'Nama Barang',
        },
        {
            accessorKey: 'category.name',
            header: 'Kategori',
        },
        {
            accessorKey: 'location.name',
            header: 'Lokasi',
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return description ? (description.length > 50 ? `${description.substring(0, 50)}...` : description) : '-';
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openViewDialog(item)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(item)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Barang" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Data Barang</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Barang
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Barang Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk menambahkan data barang baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nama Barang</label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="Nama barang"
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="category_id" className="text-sm font-medium">Kategori</label>
                                        <Select
                                            value={createForm.data.category_id}
                                            onValueChange={(value) => createForm.setData('category_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.category_id && (
                                            <p className="text-sm text-destructive">{createForm.errors.category_id}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="location_id" className="text-sm font-medium">Lokasi</label>
                                        <Select
                                            value={createForm.data.location_id}
                                            onValueChange={(value) => createForm.setData('location_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih lokasi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem key={location.id} value={location.id}>
                                                        {location.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {createForm.errors.location_id && (
                                            <p className="text-sm text-destructive">{createForm.errors.location_id}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
                                        <Textarea
                                            id="description"
                                            value={createForm.data.description}
                                            onChange={(e) => createForm.setData('description', e.target.value)}
                                            placeholder="Deskripsi barang"
                                            rows={4}
                                        />
                                        {createForm.errors.description && (
                                            <p className="text-sm text-destructive">
                                                {createForm.errors.description}
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
                    <DataTable columns={columns} data={items} searchKey="name" title='List Barang' />
                </div>

                {/* View Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Detail Barang</DialogTitle>
                        </DialogHeader>
                        {selectedItem && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Nama Barang</h3>
                                    <p className="mt-1">{selectedItem.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
                                    <p className="mt-1">{selectedItem.category.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Lokasi</h3>
                                    <p className="mt-1">{selectedItem.location.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Deskripsi</h3>
                                    <p className="mt-1 whitespace-pre-wrap">{selectedItem.description}</p>
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
                            <DialogTitle>Edit Barang</DialogTitle>
                            <DialogDescription>Ubah informasi barang.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-name" className="text-sm font-medium">Nama Barang</label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Nama barang"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-sm text-destructive">{editForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-category_id" className="text-sm font-medium">Kategori</label>
                                    <Select
                                        value={editForm.data.category_id}
                                        onValueChange={(value) => editForm.setData('category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.category_id && (
                                        <p className="text-sm text-destructive">{editForm.errors.category_id}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-location_id" className="text-sm font-medium">Lokasi</label>
                                    <Select
                                        value={editForm.data.location_id}
                                        onValueChange={(value) => editForm.setData('location_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih lokasi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((location) => (
                                                <SelectItem key={location.id} value={location.id}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.location_id && (
                                        <p className="text-sm text-destructive">{editForm.errors.location_id}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-description" className="text-sm font-medium">Deskripsi</label>
                                    <Textarea
                                        id="edit-description"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        placeholder="Deskripsi barang"
                                        rows={4}
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-sm text-destructive">
                                            {editForm.errors.description}
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
                            <DialogTitle>Hapus Barang</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus barang "{selectedItem?.name}"?
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
