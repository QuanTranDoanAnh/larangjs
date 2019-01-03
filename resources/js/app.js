
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
require('angular');

var dropzoneApp = angular.module('DropzoneApp', [], ['$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
}]);
dropzoneApp.controller('DropzoneUploadController', ['$scope', '$http', function($scope, $http) {
    // Store all files
    $scope.allFiles = [];

    // load files
    $scope.loadAllFiles = function() {
        $http.get('/all-files').then(function success(e) {
            $scope.allFiles = e.data.files;
        });
    };
    $scope.loadAllFiles();

    // dropzone configuration, the url and headers part is important make sure to focus on this
    $scope.options = {
        url: '/upload-file',
        maxFilesize: 100,
        acceptedFiles: 'image/jpeg, images/jpg, image/png',
        headers: { 'X-CSRF-TOKEN': $('meta[name=csrf-token]').attr('content')}
    };

    $scope.callbacks = {
        'addedfile': function (file) {
            // can add more action if needed when user add new file to upload
        },
        'success': function (file, xhr) {
            // file got successfully uploaded
            $scope.allFiles.push(xhr.file);
        },
        'removedfile': function(file){
            // Dropzone remove file event
        },
        uploadprogress: function (file, progress, bytesSent) {
            // Display file uploading progress
        }
    };

    // Remove file from server 
    $scope.deleteFile = function(file, index)
    {
        $http.post('/delete-file', {id: file.id}).then(function success(e) {
            $scope.allFiles.splice(index, 1);
        });
    };
}]);

dropzoneApp.directive('mydropzone', function() {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            options: '=?',
            methods: '=?',
            callbacks: '=?',
        },
        link: function (scope, el) {
            Dropzone.autoDiscover = false;
            var drop = new Dropzone(el[0], scope.options);
 
            scope.methods = scope.methods || {};
 
            scope.methods.getDropzone = function () {
                return drop;
            };
 
            scope.methods.getAllFiles = function () {
                return drop.files;
            };
 
            var controlMethods = [
                'removeFile', 'removeAllFiles', 'processQueue',
                'getAcceptedFiles', 'getRejectedFiles', 'getQueuedFiles', 'getUploadingFiles',
                'disable', 'enable', 'confirm', 'createThumbnailFromUrl'
            ];
 
            angular.forEach(controlMethods, function (methodName) {
                scope.methods[methodName] = function () {
                    drop[methodName].apply(drop, arguments);
                    if (!scope.$$phase && !scope.$root.$$phase) scope.$apply();
                };
            });
 
            if (scope.callbacks) {
                var callbackMethods = [
                    'drop', 'dragstart', 'dragend',
                    'dragenter', 'dragover', 'dragleave', 'addedfile', 'removedfile',
                    'thumbnail', 'error', 'processing', 'uploadprogress',
                    'sending', 'success', 'complete', 'canceled', 'maxfilesreached',
                    'maxfilesexceeded', 'processingmultiple', 'sendingmultiple', 'successmultiple',
                    'completemultiple', 'canceledmultiple', 'totaluploadprogress', 'reset', 'queuecomplete'
                ];
                angular.forEach(callbackMethods, function (method) {
                    var callback = (scope.callbacks[method] || angular.noop);
                    drop.on(method, function () {
                        callback.apply(null, arguments);
                        if (!scope.$$phase && !scope.$root.$$phase) scope.$apply();
                    });
                });
            }
        }
    };
});

var uploadApp = angular.module('UploadApp', [], ['$httpProvider', function($httpProvider){
    $httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
}]);

uploadApp.controller('FileUploadController', ['$scope', '$http', function($scope, $http) {

}]);

uploadApp.directive('ngFiles', ['$parse', function($parse) {
    function file_links(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function(event) {
            onChange(scope, {$files: event.target.files})
        });
    }
    return {
        link: file_links
    }
}]);

uploadApp.controller('FileUploadController', ['$scope', '$http', function($scope, $http) {
    $scope.errors = [];

    $scope.files = [];

    $scope.listFiles = function() {
        var request = {
            method: 'GET',
            url: '/file/list',
            headers: {
                'Content-Type': undefined
            }
        };

        $http(request)
            .then(function success(e) {
                $scope.files = e.data.files;
            }, function error(e) {

            });
    };

    $scope.listFiles();

    var formData = new FormData();
    $scope.uploadFile = function() {
        console.log('Hello');
        var request = {
            method: 'POST',
            url: '/upload/file',
            data: formData,
            headers: {
                'Content-Type': undefined
            }
        };

        $http(request)
            .then(function success(e) {
                $scope.files = e.data.files;
                $scope.errors = [];
                // clear uploaded file
                var fileElement = angular.element('#image_file');
                fileElement.value = '';
                alert("Image has been uploaded successfully!");
            }, function error(e) {
                $scope.errors = e.data.errors;
            });
    };

    $scope.setTheFiles = function($files) {
        angular.forEach($files, function(value, key) {
            formData.append('image_file', value);
        });
        console.log(formData);
    };

    $scope.deleteFile = function(index) {
        var conf = confirm("Do you really want to delete this file?");

        if (conf == true) {
            var request = {
                method: 'POST',
                url: '/delete/file',
                data: $scope.files[index]
            };
 
            $http(request)
                .then(function success(e) {
                    $scope.errors = [];
 
                    $scope.files.splice(index, 1);
 
                }, function error(e) {
                    $scope.errors = e.data.errors;
                });
        }
    };
}]);

var app = angular.module('LaravelCRUD', []
    , ['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
    }]);
app.controller('TaskController', ['$scope', '$http', function($scope, $http) {
    $scope.tasks = [];

    // List tasks
    $scope.loadTasks = function() {
        $http.get('/task')
            .then(function success(e) {
                $scope.tasks = e.data.tasks;
            });
    };
    $scope.loadTasks();

    $scope.errors = [];
    $scope.task = {
        name: '',
        description: ''
    };
    $scope.initTask = function() {
        $scope.resetForm();
        $('#add_new_task').modal('show');
    };
    // Add new Task
    $scope.addTask = function() {
        
        $http.post('/task', {
            name: $scope.task.name,
            description: $scope.task.description
        }).then(function success(e) {
            $scope.resetForm();
            $scope.tasks.push(e.data.task);
            $('#add_new_task').modal('hide');
        }, function error(error) {
            $scope.recordErrors(error);
        });
    };

    $scope.recordErrors = function(error) {
        $scope.errors = [];
        if (error.data.errors.name) {
            $scope.errors.push(error.data.errors.name[0]);
        }

        if (error.data.errors.description) {
            $scope.errors.push(error.data.errors.description[0]);
        }
    };

    $scope.resetForm = function() {
        $scope.task.name = '';
        $scope.task.description = '';
        $scope.errors = [];
    };

    $scope.edit_task = {};
    // initialize update action
    $scope.initEdit = function(index) {
        $scope.errors = [];
        $scope.edit_task = $scope.tasks[index];
        $('#edit_task').modal('show');
    };

    // update the given task
    $scope.updateTask = function() {
        $http.patch('/task/' + $scope.edit_task.id, {
            name: $scope.edit_task.name,
            description: $scope.edit_task.description        
        }).then(function success(e) {
            $scope.errors = [];
            $('#edit_task').modal('hide');
        }, function error(error) {
            $scope.recordErrors(error);
        });
    };

    $scope.deleteTask = function(index) {
        var conf = confirm("Do you really want to delete this task?");

        if (conf === true) {
            $http.delete('/task/' + $scope.tasks[index].id)
                .then(function success(e) {
                    $scope.tasks.splice(index, 1);
                });
        }
    };
}]);