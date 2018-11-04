/**
 * Created by buru on 1/19/16.
 */

var name = "";
var content = "";
var url = "http://test.xxx.com/index/";
$(document).on("keyup","textarea.todo-content",function(e){
    var todo_content = $(this);
    var content = todo_content.val();
    var pos = content.indexOf("#bug");
    if(pos!=-1 && content.indexOf("#bug") == (content.length-4) && name!=""){
        $.ajax({
            url: url+"bug",
            type:"POST",
            data:JSON.stringify({"creator":name}),
            contentType: "application/json; charset=utf-8",
            success:function(r){
                content += " ["+ r.data + "] ";
                todo_content.val(content);

            },
            error: function (message) {
                alert(message);
            }
        });
    }
});

$(document).on("submit","form.form-edit-todo",function(e){
    debugger;
    var todo_content = $(this).find("textarea");
    var content = todo_content.val();
    var assignee = $(this).find("span.assignee");
    fix_user  = assignee.text();
    params = {};
    if(fix_user !="未指派")params.fix_user = $.trim(fix_user);
    if($(this).find("button.btn-create-todo").length>0) params.status=1;

    if(params.fix_user || params.status ){
        if(edit_bug(content,params) && params.status == 1){
            _nums_incr(1);
        }
    }

});

$(document).on("click","input.checkbox-input",function(e){
   var div = $(this).parent('div.simple-checkbox'),content = div.next("span.raw").text(),params = {};
    if(div.hasClass("checked")) {
        params.status=1;
        step = 1;
    }else{
        params.status=2;
        step = -1;
    }
    if(edit_bug(content,params))_nums_incr(step);
});

$(document).on("click","div.todo-actions .del",function(e){
    content = $(this).parent("li.todo").find("span.raw").text();
});

$(document).on("click","div.simple-dialog-buttons btn",function(e){
    if($(this).hasClass(".btn-x")) {
        content = "";
        return false; }
    if(edit_bug(content,{status:3})) _nums_incr(-1);
});

//0:init 1:create 2:done 3:delete
function edit_bug(content,params){
    params = params||{};
    var r_level = /#p(\d)/;
    match = r_level.exec(content);
    if(match) params.level = match[1];
    var r_id = /#bug\s\[(\d+)\]/;
    match = r_id.exec(content);
    if(!match) return false;
    params.id = match[1];
    $.ajax({
        url: url+"bug",
        type:"PUT",
        data:JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        success:function(r){}
    });
    return true;
}

function _nums_incr(step){
    chrome.extension.sendMessage({cmd:"nums_incr",step:step},function(res){});
}

$(function(){
    name = $("#member-nickname").val();
    guid = $("#member-guid").val();
    chrome.storage.local.set({'name': name,"guid":guid}, function() {});
});
