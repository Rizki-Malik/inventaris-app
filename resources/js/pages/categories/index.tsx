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

interface Category {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori Barang',
        href: '/categories',
    },
];

export default function Categories({ categories }: { categories: Category[] }) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
        createForm.post(route('categories.store'), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('categories.update', selectedCategory?.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
            },
        });
    };

    const handleDeleteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        deleteForm.delete(route('categories.destroy', selectedCategory?.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
            },
        });
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        editForm.setData({
            name: category.name,
            description: category.description,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteDialogOpen(true);
    };

    const columns: ColumnDef<Category>[] = [
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
                const category = row.original;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Barang" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kategori Barang</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Kategori
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Kategori Baru</DialogTitle>
                                <DialogDescription>
                                    Isi form berikut untuk menambahkan kategori baru.
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
                                            placeholder="Nama kategori"
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
                                            placeholder="Deskripsi kategori"
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
                    <DataTable columns={columns} data={categories} searchKey="name" title='List Kategori' />
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Kategori</DialogTitle>
                            <DialogDescription>Ubah informasi kategori.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label htmlFor="edit-name" className="text-sm font-medium">Nama</label>
                                    <Input
                                        id="edit-name"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        placeholder="Nama kategori"
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
                                        placeholder="Deskripsi kategori"
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
                            <DialogTitle>Hapus Kategori</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus kategori "{selectedCategory?.name}"?
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
