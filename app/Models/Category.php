<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Category extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];
    protected $table = 'categories';
    protected $primaryKey = 'id';
    public function getRouteKeyName()
    {
        return 'id';
    }
}
