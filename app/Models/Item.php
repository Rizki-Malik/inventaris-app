<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Item extends Model
{
    use HasUuids;
    protected $fillable = [
        'name',
        'description',
        'location_id',
        'quantity',
        'category_id',
    ];
    protected $table = 'items';
    protected $primaryKey = 'id';
    public function getRouteKeyName()
    {
        return 'id';
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
