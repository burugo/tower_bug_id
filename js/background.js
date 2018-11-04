/**
 * Created by buru on 1/19/16.
 */
chrome.storage.onChanged.addListener(function(changes, namespace){
    var storageChange = changes['bug_nums'];
    val = storageChange.newValue || "";
    chrome.browserAction.setBadgeText({text:val.toString()});
});

chrome.extension.onMessage.addListener(function(req,sender,sendResponse){
    if(req.cmd == "nums_incr"){
        nums_incr(req.step);
    }
});

function nums_incr(step){
    chrome.storage.local.get('bug_nums',function(obj){
        $num = obj.bug_nums || 0;
        $num = $num + step;
        if($num < 0) $num = 0;
        chrome.storage.local.set({'bug_nums': $num}, function() {
            // Notify that we saved.
            console.log('bug_nums saved:'+$num);
        });
    });
}