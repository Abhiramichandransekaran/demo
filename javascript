@extends('essential.main', [
    'breadcum' => 'Add',
    'route' => 'managements.index',
    'class' => 'px-4 py-1.5',
    'super_route' => 'ID Management',
])
@section('content')
    <div class="w-full flex flex-row justify-between">
        <div class="flex flex-row space-x-4">
            <select id="status" name="status"
                class='bg-white border  border-gray-300 text-fillcolor text-sm placeholder-placeholdercolor rounded-md focus:ring-blue-500 focus:border-blue-500 block w-56 p-2.5'>
                <option value="100">All Status</option>
                <option value="0">ACTIVE</option>
                <option value="1">IN ACTIVE</option>
                <option value="2">OFFBOARDED</option>
            </select>
            <button type='button' onclick="toggleModal('modal-add')"
                class ='p-2 w-auto text-white bg-primary border border-primary hover:border-primary hover:bg-muted hover:text-primary font-medium rounded-lg text-sm text-center'>
                <div id="add" class="">Add Management</div>
                <div id="sgv" hidden>
                    <svg aria-hidden="true" role="status" class="inline w-9 h-4 text-primary animate-spin"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor" />
                    </svg>
                </div>
            </button>
        </div>
        <div class="flex flex-row space-x-4">
            <div class="w-56">
                <x-custom.select-without-label label="Station" prefix="All" :options="$branches" id="branch_id"
                    name="branch_id" />
            </div>
            @include('management.filter')
        </div>
    </div>
    <div class="pt-2" id="managementTable"></div>
@endsection


@push('scripts')
    <script>
        $(document).ready(function() {
            $('#branch_id').change(function(e) {
                e.preventDefault();
                getDataTable();
            });

            $('#status').change(function(e) {
                e.preventDefault();
                getDataTable();
            });

            $('#add_id_managment').submit(function(e) {
                e.preventDefault();
                var form_data = new FormData(this);
                $.ajax({
                    type: "POST",
                    url: "managements",
                    data: form_data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: "json",
                    success: function(response) {
                        console.log(response);
                        if (response.status == true) {
                            getDataTable();
                            toggleModal('modal-add');
                            $('#add_id_managment')[0].reset();
                            toastr.success(response.message);
                            $("#addbutton").attr("disabled", false);
                            $("#addbuttonid").show();
                            $("#addload").hide();
                        } else {
                            toastr.error(response.message);
                            $("#addbutton").attr("disabled", false);
                            $("#addbuttonid").show();
                            $("#addload").hide();
                        }
                    }
                });
            });

            $('#importexcel_student').submit(function(e) {
                e.preventDefault();
                var form_data = new FormData(this);
                $.ajax({
                    type: "POST",
                    url: "{{ route('import_management') }}",
                    data: form_data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    dataType: "datatype",
                    success: function(response) {
                        console.log(response);
                        if (response.status == true) {
                            toastr.success(response.message);
                            toggleModal('modal-import');
                            $("#importexcel_student")[0].reset();
                            getDataTable();
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error: function(e) {
                        var response = $.parseJSON(e.responseText);
                        if (response.status == true) {
                            toastr.success(response.message);
                            toggleModal('modal-import');
                            $("#importexcel_student")[0].reset();
                            getDataTable();
                        } else {
                            toastr.error(response.message);
                        }
                    }
                });
            });

            $('#downloadexcel').click(function(e) {
                e.preventDefault();
                $status = $('#status').val();
                $branch_id = $('#branch_id').val();
                return window.location.href = "exceldownload_management?status=" + $status + '&branch_id=' +
                    $branch_id
            });

            $('#downloadpdf').click(function(e) {
                e.preventDefault();
                $status = $('#status').val();
                $branch_id = $('#branch_id').val();
                return window.location.href = "pdfdownload_management?status=" + $status + '&branch_id=' +
                    $branch_id
            });
        });


        function status(id) {
            $status = $('#status_' + id).val();
            $.ajax({
                type: "GET",
                url: "management_status",
                data: {
                    id: id,
                    status: $status,
                    _token: "{{ csrf_token() }}"
                },
                success: function(response) {
                    getDataTable();
                    toastr.success(response.message);
                }

            });
        }

        function getDataTable(page) {
            $status = $('#status').val();
            $branch = $('#branch_id').val();
            $page_count = $("#page_count").val();
            $search = $('#search').val();
            $.ajax({
                type: "GET",
                url: "managements" + "?page=" + page,
                data: {

                    search: $search,
                    status: $status,
                    page_count: $page_count,
                    branch_id: $branch,
                    token: "{{ csrf_token() }}"
                },
                success: function(response) {
                    $('#managementTable').html(response);
                }
            });
        }


        function showEdit($id) {
            $.ajax({
                type: "GET",
                url: "managements/" + $id + "/edit",
                success: function(response) {
                    $('#editManagemment').html(response);
                    toggleModal('modal-edit');
                }
            });
        }
    </script>
@endpush

@section('extras')
    @include('management.import')
    @include('management.store')

    <div class="hidden overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center"
        id="modal-edit">
        <div class="relative w-96">
            <!--content-->
            <div class="border-0 rounded-lg shadow-lg relative flex flex-col bg-white  outline-none focus:outline-none">

                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 border-b">
                    <h3 class="text-2xl">
                        Edit Management
                    </h3>
                    <button type="button" onclick="toggleModal('modal-edit')"
                        class="text-gray-400 bg-transparent hover:bg-primary hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <div id="editManagemment">
                </div>
            </div>
        </div>
    </div>
    <div class="hidden opacity-25 fixed inset-0 z-40 bg-black" id="modal-edit-backdrop"></div>
@endsection
