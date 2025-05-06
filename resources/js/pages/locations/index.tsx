import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Plus, Trash } from 'lucide-react';

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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Location {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lokasi',
        href: '/locations',
    },
];

export default function Locations({ locations }: { locations: Location[] }) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const createForm = useForm({
        name: '',
        description: '',
    });

    const editForm = useForm({
        name: '',
        description: '',
    });

    const deleteForm = useForm({});

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('locations.store'), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('locations.update', selectedLocation?.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        deleteForm.delete(route('locations.destroy', selectedLocation?.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const openEditDialog = (location: Location) => {
        setSelectedLocation(location);
        editForm.setData({
            name: location.name,
            description: location.description,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (location: Location) => {
        setSelectedLocation(location);
        setIsDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Location>[] = [
        {
            accessorKey: 'name',
            header: 'Nama',
        },
        {
            accessorKey: 'description',
            header: 'Deskripsi',
            cell: ({ row }) => {
                const description = row.getValue('description') as string;
                return description.length > 100 ? `${description.substring(0, 100)}...` : description;
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const location = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(location)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(location)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lokasi" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Lokasi</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Lokasi
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Lokasi Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk menambahkan lokasi baru.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="name" className="text-sm font-medium">Nama</label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                            placeholder="Nama lokasi"
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-medium">Deskripsi</label>
                                        <Textarea
                                            id="description"
                                            value={createForm.data.description}
                                            onChange={(e) => createForm.setData('description', e.target.value)}
                                            placeholder="Deskripsi lokasi"
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
                    <DataTable columns={columns} data={locations} searchKey="name" title='List Lokasi' />
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Lokasi</DialogTitle>
                            <DialogDescription>Ubah informasi lokasi.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-name" className="text-sm font-medium">Nama</label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Nama lokasi"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-sm text-destructive">{editForm.errors.name}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="edit-description" className="text-sm font-medium">Deskripsi</label>
                                    <Textarea
                                        id="edit-description"
                                        value={editForm.data.description}
                                        onChange={(e) => editForm.setData('description', e.target.value)}
                                        placeholder="Deskripsi lokasi"
                                    />
                                    {editForm.errors.description && (
                                        <p className="text-sm text-destructive">{editForm.errors.description}</p>
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
                            <DialogTitle>Hapus Lokasi</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus lokasi "{selectedLocation?.name}"?
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
