@extends('layouts.upload-app')

@section('content')
<div class="container" ng-controller="FileUploadController">
    <div class="row">
        <div class="col-md-12">
            <h2>Laravel 5 AngularJS File Upload Demo</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="form-group">
                <label for="files">Select Image File</label>
                <input type="file" ng-files="setTheFiles($files)" id="image_file" class="form-control">
            </div>

            <ul class="alert alert-danger" ng-if="errors.length > 0">
                <li ng-repeat="error in errors">
                    @{{ error }}
                </li>
            </ul>
            
            <div class="form-group">
                <button ng-click="uploadFile()" class="btn btn-primary">Upload File</button>
            </div>
        </div>
    </div>
</div>
@endsection