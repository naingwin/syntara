$(function() 
{
    var nbInput = $('.input-group-addon').size() + 1;
    
    $('#create-group-form').on('submit', function()
    {
        var sArray = $(this).serializeArray();
        $.ajax({
            "type": "POST",
            "url": 'new',
            data: sArray,
            "dataType": "json"
        }).done(function(result)
        {
            if(result.groupCreated === false)
            {
                if(typeof result.message !== 'undefined')
                {
                    showStatusMessage(result.message, result.messageType);
                }
                else if(typeof result.errorMessages !== 'undefined')
                {
                    showRegisterFormAjaxErrors(result.errorMessages);
                }
            }
            else
            {
                window.location = result.redirectUrl;
            }
        });
        
        return false;
    });

    $('#edit-group-form').on('submit', function()
    {
        var sArray = $(this).serializeArray();

        $.ajax({
            "type": "PUT",
            "url": window.location.href.toString(),
            data: sArray,
            "dataType": "json",
            success: function(result)
            {
                if(typeof result.message !== 'undefined')
                {
                    showStatusMessage(result.message, result.messageType);
                }
                else if(typeof result.errorMessages !== 'undefined')
                {
                    showRegisterFormAjaxErrors(result.errorMessages);
                }
            }
        });

        return false;
    });
    
    $(document).on('click', '.add-input', function()
    {
        var $selected = $('.permissions-select option:selected');
        var permissionId = $selected.val();
        var label = $selected.html();

        if(typeof permissionId !== 'undefined')
        {
            $selected.remove();
            var html = '<div class="form-group"><p class="input-group"><span class="input-group-addon"><span class="glyphicon glyphicon-minus-sign remove-input"></span></span><input readonly type="text" class="form-control" name="'+permissionId+'" value="'+label+'"/></p></div>';
            $('.input-container').append(html);
        }

        return false;
    }).on('click', '.remove-input', function()
    {
        var $selected = $(this).parent().parent().children('input');
        var permissionId = $selected.attr('name');
        var label = $(this).parent().parent().children('input').val();

        $('.permissions-select').prepend('<option value="'+permissionId+'">'+label+'</option>');

        $(this).parent().parent().parent().remove();
        return false;
    }).on('click', '#delete-item.groups', function()
    {
        $('#confirm-modal').modal();
        
    }).on('click', '.delete-group .confirm-action', function()
    {
        $.each($('.table tbody tr td input:checkbox:checked'), function( key, value ) 
        {
            $.ajax(
            {
                url: 'group/'+$(this).data('group-id'),
                type: "DELETE",
                datatype: "json"
            }).done(function(result)
            {
                showStatusMessage(result.message, result.messageType);
                ajaxContent($(this).attr('href'), ".ajax-content", false);
            });
        });

        $('#confirm-modal').modal('hide');

    }).on('click', '#delete-item.users', function()
    {
        $.each($('.table tbody tr td input:checkbox:checked'), function( key, value ) 
        {
            $.ajax(
            {
                url: window.location.href.toString()+'/user/'+$(this).data('user-id'), 
                type: "DELETE"
            })
            .done(function(result)
            {
                showStatusMessage(result.message, result.messageType);
                ajaxContent($(this).attr('href'), ".ajax-content", false);
            });
        });
    }).on('click', '#add-user', function()
    {
        var userId = $("#ungrouped-users-list option:selected").val();
        var groupId = $("#ungrouped-users-list").data('group-id');

        $.ajax(
        {
            url: window.location.href.toString()+'/user/'+userId, 
            type: "POST",
            datatype: "json",
            data: { userId : userId, groupId : groupId }
        }).done(function(result)
        {
            showStatusMessage(result.message, result.messageType);
            ajaxContent($(this).attr('href'), ".ajax-content");
        });
    });
});