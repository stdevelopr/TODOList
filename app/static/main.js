$(document).ready(function(){
	//create a new todo
	$("#create").click(function(){
		var todo = $('#todo').val();
		var count = $("#count").text();
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "CREATE"},
			data: {todo:todo},
			success:function(resp){
				if(typeof(resp) != 'string'){
					new_id = resp['new_id'];
					new_entry = [{'id': new_id, 'item': todo, 'status': false}];
					//append the result if tbody is all or pending
					if($('tbody').attr('orig') != 'completed'){
						append(new_entry);
						$("#todo").val('');
						count++;
						$("#count").html(count);
						$("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
					}
					else{
						alert('Todo created!');
						$("#todo").val('');
					}
				}
				else{
					alert(resp)
				}
			}
		});
	});

	$("#all").click(function(event){
		$("#modal_update").attr('orig', 'all');
		$("tbody").attr('orig', 'all');
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "ALL"},
			success:function(resp){
				$('tbody').empty()
				append(resp)
				$('#test').html('All')
			}
		});
	});

	$("#completed").click(function(event){
		$("#modal_update").attr('orig', 'rel');
		$("tbody").attr('orig', 'completed');
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "COMPLETED"},
			success:function(resp){
				$('tbody').empty()
				append(resp)
				$('#test').html('Completed')
			}
		});
	});

	$("#pending").click(function(event){
		$("#modal_update").attr('orig', 'rel');
		$("tbody").attr('orig', 'pending');
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "PENDING"},
			success:function(resp){
				$('tbody').empty()
				append(resp)
				$('#test').html('Pending')
			}
		});
	});


	//UPDATE Button - AJAX update infomation from modal.
	$("#modal_update").click(function(){
		var id= $("#modal_update").attr('num');
		var modal_status = $("#modal_update").attr('status');
		var todo = $('#modal_input').val();
		var count = $("#count").text();
		//call orign
		var origin = $("#modal_update").attr('orig');
		//new defined status
		var status = $("#radio_completed:checked").val();
		$("#EditModal .close").click();
		// if taks is completed
		if(status == 'on'){
			$.ajax({
				url:'/',
				type:'POST',
				headers: {"CRUD": "UP"},
				data: {id:id, todo:todo, status:true},
				success:function(resp){
					if(resp=='success'){
						$('#todo_'+id).text(todo);
						//delete row is modal_status differs from new status and orign is not all
						if(modal_status == 'false' && origin !='all'){
							$("#"+id).remove();
							count--;
							$("#count").html(count);
						}
						else{
							$("#"+id).attr('class', true);
						}
					}
					else{
						alert(resp)
					}
				}
			});
		}
		else{
			$.ajax({
				url:'/',
				type:'POST',
				headers: {"CRUD": "UP"},
				data: {id:id, todo:todo, status:false},
				success:function(resp){
					if(resp=='success'){
						$('#todo_'+id).text(todo);
						//delete row is modal_status differs from new status and orign is not all
						if(modal_status == 'true' && origin !='all'){
							$("#"+id).remove();
							count--;
							$("#count").html(count);
						}
						else{
							$("#"+id).attr('class', false);
						}
					}
					else{
						alert(resp)
					}
				}
			});
		}		
	});


	// AJAX delete from table 
	$('table').on("click", "button.delete",function(){
		var id= $(this).closest('tr').attr('id');
		var count = $("#count").text();
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "DEL"},
			data: {id:id},
			success:function(resp){
				if(resp=='success'){
					$("#"+id).remove()
					count--;
					$("#count").html(count);
				}
				else{
					alert(resp)
				}
			}
		});			
	});

	// AJAX mark as complete
	$('table').on("click", "button.ok",function(){
		var origin = $("tbody").attr('orig');
		var id= $(this).closest('tr').attr('id');
		var todo = $('#todo_'+id).text();
		var count = $("#count").text();
		$.ajax({
			url:'/',
			type:'POST',
			headers: {"CRUD": "UP"},
			data: {id:id, todo:todo, status:true},
			success:function(resp){
				if(resp=='success'){
					$("#"+id).attr('class', true);
					if(origin=='pending'){
						$("#"+id).remove();
						count--;
						$("#count").html(count);

					}
				}
				else{
					alert(resp)
				}
			}
		});			
	});

	// atualize modal with row information
	$('table').on("click", "button.edit",function(){
		var id= $(this).closest('tr').attr('id');
		var status= $(this).closest('tr').attr('class');
		var todo = $('#todo_'+id).text();
		$('#modal_input').val(todo);
		$("#modal_update").attr('num', id);
		$("#modal_update").attr('status', status);
		if(status == 'true'){
			$("#radio_completed").prop('checked', true)
		}
		else{
			$("#radio_pending").prop('checked', true)
		}
	});

	//receives JSON object {id: number, item: string, status: boolean}, loop and and appends to tbody
	var append = function(resp){
		var c = 0;
		$.each(resp, function(key, value) {
			mark= '<th class=ok><button id=ok_'+value['id']+' class="ok btn btn-warning"><i class="fas fa-check"></i></button></th>'
			todo = '<th id=todo_'+value['id']+'>'+value['item']+'</th>'
			edit_button= '<th class=edit><button id=edit_'+value['id']+' type="button" class="btn btn-primary edit" data-toggle="modal" data-target="#EditModal"><i class="fas fa-edit"></i></button></th>'
			del_button= '<th class="delete"><button id=del_'+value['id']+' class="delete btn btn-danger"><i class="fas fa-backspace"></i></button></th>'
		    $('tbody').append($("<tr id='"+value['id']+"' class='"+value['status']+"'>"+mark+todo+edit_button+del_button+"</tr>"));
		    $('#modal_input').attr('value', value['id'])
		    c++;
		});
		$("#count").html(c);
	}
})

$(window).on('load', function() {
	$(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("show");
        //condition to not collapse navbar when click create with no entry;
        var condition = (clickover.text() == 'CREATE' && $('#todo').val() == '');
        if (_opened === true && event.target.nodeName != 'INPUT' &&  !condition && !clickover.hasClass("navbar-toggler")) {
             $(".navbar-toggler").click();
        }
    });
})

