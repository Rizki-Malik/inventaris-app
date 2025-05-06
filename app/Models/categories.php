<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class categories extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'id' => 'uuid',
    ];
    protected $table = 'categories';
    protected $primaryKey = 'id';
    public function getRouteKeyName()
    {
        return 'id';
    }
}
