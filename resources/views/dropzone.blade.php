@extends('layouts.dropzone-app')

@section('content')
<div ng-controller="DropzoneUploadController" ng-clock>
    <div class="container">
        <div class="row">
            <div class="col">
                <br>
                <h1>Laravel AngularJS file Upload with dropzone</h1>
                <hr>

                {{--  Dropzone  --}}
                <div class="dropzone" mydropzone options="options" callbacks="callbacks" methods="methods"></div>

                <br>
                <h2>All Upload Files</h2>
                {{--  File Listing   --}}
                <div class="table-responsive-sm">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="file in allFiles" ng-if="allFiles.length > 0">
                                <td>@{{ $index +1 }}</td>
                                <td><img height="100" ng-src="/images/@{{ file.id }}.@{{ file.type }}"></td>
                                <td>
                                    @{{ file.name }}
                                </td>
                                <td>
                                    <button ng-click="deleteFile(file, $index)" class="btn btn-outline-danger btn-sm">X</button>
                                </td>
                            </tr>
                            <tr ng-if="allFiles.length == 0">
                                <td colspan="5">
                                    Files not found!
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
@endsection