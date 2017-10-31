/*********************************************************************************/
/* Simon js                                                                   */
/*********************************************************************************/

var cheackResult = 0;

$(document).ready(function () {
    /*驗證帳號*/
    $("input[name='Account']").blur(function () {
        /*宣告格式*/
        var checkEmailRegex = new RegExp("\\w+([.-]\\w+)*@\\w+([.-]\\w+)+", "gi");
        /*欄位資料*/
        var data = $.trim($("#UserAccount").val());
        console.log("data:" + data);
        /*判斷是否符合格式*/
        var result = checkEmailRegex.test(data);
        console.log("result:" + result);
        /*格式不符時 cheackResult為1*/
        if (!result) {
            cheackResult = 1;
            $("input[name='Account']").select();
            $("#info #infoMsg").text("電子信箱格式不符");
            console.log("cheackResult:" + cheackResult);
        }
        else {
            $("#info p").text("");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });
    /*驗證姓氏不得超過10個中文字*/
    $("input[name='UserFirstName']").blur(function () {
        var checkUserFirstNameRegex = new RegExp("^\\D{1,10}$");
        var data = $.trim($("#UserFirstName").val());
        var result = checkUserFirstNameRegex.test(data);
        console.log("cheackResult:" + cheackResult);

        if (!result) {
            $("input[name='UserFirstName']").select();
            $("#info #infoMsg").text("姓氏輸入格式不符");
            console.log("result:" + result);
        } else {
            $("#info p").text("");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }

    });
    /*驗證名字不得超過10個中文字*/
    $("input[name='UserLastName']").blur(function () {
        var checkUserLastName = new RegExp("^\\D{1,10}$");
        var data = $.trim($("#UserLastName").val());
        var result = checkUserLastName.test(data);
        if(!result){
            $("input[name='UserLastName']").select();
            $("#info #infoMsg").text("名字輸入格式不符");
            console.log("result:" + result);
        } else {
            $("#info p").text("");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });
    /*驗證手機聯絡電話格式*/
    $("input[name='Telephone']").blur(function () {
        var checkUserTelephome = new RegExp("^[09]{2}[0-9]{8}$");
        var data = $.trim($("#UserTelephome").val());
        var result = checkUserTelephome.test(data);
        if (!result) {
            $("input[name='Telephone']").select();
            $("#info #infoMsg").text("連絡電話輸入格式不符");
            console.log("result:" + result);
        } else {
            $("#info p").text("");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });
    /*驗證密碼格式*/
    $("input[name='Password']").blur(function () {
        var checkUserPwd = new RegExp("^(?=.*\\w)(?=.*[a-z])(?=.*[A-Z]).{6,12}$");
        var data = $.trim($("#UserPwd").val());
        var result = checkUserPwd.test(data);
        if (!result) {
            $("input[name='Password']").select();
            $("#info #infoMsg").text("密碼輸入格式不符");
            console.log("result:" + result);
        } else {
            $("#info p").text("");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });
    /*確認密碼是否正確*/
    $("#ConfirmPwd").blur(function () {
        var pwd = $("#UserPwd").val();
        var confirmPwd = $("#ConfirmPwd").val();
        
        if(confirmPwd != pwd){
            $("#info #infoMsg").text("確認密碼錯誤,請重新輸入");
        }
    });
    /*確認資料是否都有填寫 否則不能建立帳號*/
    $("#RegisterBtn").click(function () {
        var userFirstName = $.trim($("#UserFirstName").val());
        var userLastName = $.trim($("#UserLastName").val());
        var userTelephome = $.trim($("#UserTelephome").val());
        var userAccount = $.trim($("#UserAccount").val());
        var userPwd = $.trim($("#UserPwd").val());
        var confirmPwd = $.trim($("#ConfirmPwd").val());
        if (userFirstName == null || userFirstName == "") {
            alert("請填寫姓名欄位");
            return false;
        } else if (userLastName == null || userLastName == "") {
            alert("請填寫名字欄位");
            return false;
        } else if (userTelephome == null || userTelephome == "") {
            alert("請填寫電話欄位");
            return false;
        } else if (userAccount == null || userAccount == "") {
            alert("請填寫帳號欄位");
            return false;
        } else if (userPwd == null || userPwd == "") {
            alert("請填寫密碼欄位");
            return false;
        } else if (confirmPwd == null || confirmPwd == "") {
            alert("請填寫確認密碼欄位");
            return false;
        } else {
            return true;
        };
    });
});

/*********************************************************************************/
/* Rey js                                                                   */
/*********************************************************************************/

/*********************************************************************************/
/* Yako js                                                                   */
/*********************************************************************************/
