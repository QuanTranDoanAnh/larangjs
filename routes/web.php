<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::resource('/task', 'TaskController');

Route::get('/files', 'FilesController@files');

Route::post('/upload/file', 'FilesController@upload');
 
Route::get('/file/list', 'FilesController@listFiles');

Route::post('/delete/file', 'FilesController@delete');

Route::get('/dropzone', 'DropzoneUploadsController@dropzone');
Route::get('/all-files', 'DropzoneUploadsController@list');
Route::post('/upload-file', 'DropzoneUploadsController@upload');
Route::post('/delete-file', 'DropzoneUploadsController@deleteFile');