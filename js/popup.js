var name,guid;
var url = "http://test.hunliji.com/p/wedding/Admin/index/";
function _li(key,count){
    var search = key == "done"?"":key;
    _html = '<li class="todo"> \
    <a target="_blank" href="https://tower.im/teams/73b03336b9c84c9ea34dfb889cdeed68/search/?category=2&tag=bug+'+search+'&member_guid='+guid+'"><span>#'
        +key+ '</span>: <label>'+count+'</label></a></li>';
    return _html;
}
$(function(){
    debugger;
    chrome.storage.local.get(['name','guid'],function(obj){
        name = obj.name;
        guid = obj.guid;
        if(name && guid){
            $("#nick").html(name);
            $.ajax({
                url : url + "bug_count?creator="+name,
                type:"GET",
                dataType:"json",
                success:function(r){
                    if(r.status.RetCode == 0){
                        var container = $("ul.todolist");
                        container.html('');
                        container.append(_li("done",r.data.done));
                        for( i in r.data.list){
                            var item = r.data.list[i];
                            container.append(_li("p"+ item.level,item.count));
                        }
                    }
                }
            });
        }
    });


    $("#clear").click(function(){
        chrome.storage.local.set({'bug_nums': 0}, function() {
            // Notify that we saved.
            console.log('bug_nums saved:'+$num);
        });
    });
});