<?php

namespace App\Http\Controllers;
use App\File;
use Illuminate\Http\Request;

class DropzoneUploadsController extends Controller
{
    protected $file_upload_path;
 
    public function __construct()
    {
        $this->file_upload_path = public_path('/images');
    }

    public function dropzone() {
        return view('dropzone');
    }
 
    /**
     * List all the files
     *
     * @return void
     */
    public function list()
    {
        $files = File::all();
 
        if (request()->wantsJson()) {
            return response()->json(['files' => $files], 200);
        }
 
        return response(['files' => $files], 200);
    }
 
    /**
     * Upload the file
     *
     * @return void
     */
    public function upload()
    {
        $this->validate(request(), [
            'file' => 'required|file'
        ]);
 
        $request_file = request()->file('file');
 
        $size = $request_file->getClientSize();
 
        $type = strtolower($request_file->getClientOriginalExtension());
 
        $name = $request_file->getClientOriginalName();
 
        $file = File::create([
            'name' => $name,
            'size' => $size,
            'type' => $type,
        ]);
 
        $request_file->move($this->file_upload_path, $file->id . '.' . $type);
 
        return response()->json(['file' => $file], 200);
    }
 
    /**
     * Delete Given file
     *
     * @return void
     */
    public function deleteFile()
    {
        $this->validate(request(), [
            'id' => 'required'
        ]);
 
        $file = File::find(request('id'));
 
        unlink($this->file_upload_path . '/' . $file->id . '.' . $file->type);
 
        $file->delete();
 
        return response()->json(['message' => 'Given file has been deleted'], 200);
    }
}
