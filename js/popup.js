var name,guid;
var url = "http://www.example.com/index/";
var tower_short_url = "https://tower.im/projects/3d15b77c131a4b0292f543c2c1b07115/todos/28a66467a74145b3babf042a867416a3/comments";
function _li(key,count){
    var search = key == "done"?"":"+"+key;
    _html = '<li class="todo"> \
    <a target="_blank" href="https://tower.im/teams/73b03336b9c84c9ea34dfb889cdeed68/search/?category=2&tag=bug'+search+'&member_guid='+guid+'"><span>#'
        +key+ '</span>: <label>'+count+'</label></a></li>';
    return _html;
}
$(function(){
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
    $("#url").click(function(){
        var activeTabUrl;
        var shortUrl;
        chrome.tabs.query({active : true, currentWindow: true}, function (tabs) {
            var tab = (tabs.length === 0 ? tabs : tabs[0]);
            activeTabUrl = tab.url;
            if(!activeTabUrl) return;
            var decoded = jsonDecode(localStorage.getItem('tower_url')) || {};
            if(!decoded[activeTabUrl]){
                chrome.storage.local.get(['csrf'],function(obj){
                    csrf = obj.csrf;
                    getShortUrl(activeTabUrl,csrf,function(shortUrl){
                        decoded[activeTabUrl] = shortUrl;
                        var encoded = jsonEncode(decoded);
                        localStorage.setItem('tower_url', encoded);
                        showUrl(shortUrl);
                    });
                });
            }else{
                shortUrl = decoded[activeTabUrl];
                showUrl(shortUrl);
            }
        });
    });
});

function getShortUrl(activeTabUrl,csrf,callback){
    reg = /\[<a\shref=\"(.*?)\"\>/;
    $.ajax({
        url : tower_short_url,
        type:"POST",
        data:{comment_content:'['+activeTabUrl+']'},
        dataType:"json",
        beforeSend:function(request){
            request.setRequestHeader("X-CSRF-Token",csrf);
        },
        success:function(r){
            var m = r.html.match(reg);
            if(m)callback(m[1]);
        }
    });
}

function showUrl(shortUrl){
    var textarea = $("#short_url").show().find('textarea');
    textarea.val(shortUrl).select();
    document.execCommand('copy');
    textarea.blur();
}

function jsonEncode(string) {
    try {
        return JSON.stringify(string);
    } catch (e) {
        return JSON.encode(string);
    }
}

function jsonDecode(obj) {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return JSON.decode(obj);
    }
}

function copy(str) {
    var sandbox = $('#sandbox').val(str).select();
    document.execCommand('copy');
    sandbox.val('');
}
