<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class locations extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $casts = [
        'id' => 'uuid',
    ];
    protected $table = 'locations';
    protected $primaryKey = 'id';
    public function getRouteKeyName()
    {
        return 'id';
    }
}
