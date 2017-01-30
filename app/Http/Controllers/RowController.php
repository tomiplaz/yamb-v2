<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Row;

class RowController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Row::all();
    }
}
