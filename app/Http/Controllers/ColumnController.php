<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Column;

class ColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Column::all();
    }
}
