const server = "http://127.0.0.1:9080/api"

async function checkAlarmState() {
    const alarm = await chrome.alarms.get("bookmark-alarm");
    if (!alarm) {
        await chrome.alarms.create('bookmark-alarm', {
            delayInMinutes: 1,
            periodInMinutes: 1
        });
    }
}

function sync() {
    console.log("sync 开始！")
    chrome.bookmarks.getTree(function (bookmarkArray) {
        console.log(bookmarkArray);
        fetch(server + "/sync.api", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',  // 指定内容类型
                'Content-Length': JSON.stringify(bookmarkArray).length
            },
            body: JSON.stringify(bookmarkArray),
        }).then((resp) => {
            resp.json()
        }).then((data) => {
        }).catch((error) => {
        }).finally(() => {
            console.log("sync 结束！")
        })
        // let xmlHttpRequest = new XMLHttpRequest()
        // xmlHttpRequest.open("PUT", "http://127.0.0.1:9080/api/oss/upload/test.api", true)
        // xmlHttpRequest.send(JSON.stringify(bookmarkArray))
        // xmlHttpRequest.onreadystatechange = function () {
        //             console.log("推送成功！")
        //     //0:请求未初始化;1:服务器连接已建立;2:请求已接收;3:请求处理中;4:请求已完成
        //     if (xmlHttpRequest.readyState === 4) {
        //         //200:ok;404:not found
        //         if (xmlHttpRequest.status === 200) {
        //             console.log("推送成功！")
        //         }
        //     }
        // }
    });
}

(function () {
    checkAlarmState();
    chrome.alarms.onAlarm.addListener((alarm) => {
        sync()
    });
})()