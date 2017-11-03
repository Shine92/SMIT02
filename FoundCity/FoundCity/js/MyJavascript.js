/*********************************************************************************/
/* Simon js                                                                   */
/*********************************************************************************/

var cheackResult = 0;

$(document).ready(function () {
    /*驗證帳號 後代選擇器*/
    $("#RegisterAccountCol input[name='Account']").blur(function () {
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
            $("#RegisterAccountCol input[name='Account']").select();
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
    /*驗證密碼格式 後代選擇器*/
    $("#RegisterPasswordCol input[name='Password']").blur(function () {
        var checkUserPwd = new RegExp("^(?=.*\\w)(?=.*[a-z])(?=.*[A-Z]).{6,12}$");
        var data = $.trim($("#UserPwd").val());
        var result = checkUserPwd.test(data);
        if (!result) {
            $("#RegisterPasswordCol input[name='Password']").select();
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
    /*LoginBtn*/
    $("#LoginBtn").click(function () {
        var loginAccount = $.trim($("#LoginAccount").val());
        var loginPassword = $.trim($("#LoginPassword").val());
        if(loginAccount == null || loginAccount == ""){
            alert("登入錯誤:請輸入帳號");
            return false;
        }else if (loginPassword == null || loginPassword == ""){
            alert("登入錯誤:請輸入密碼");
            return false;
        } else {
            return true;
        }

        if ($("#LoginRemeber").is(':checked')) {
            $("#LoginRemeberResult").attr("value", "true");
        } else if($("#LoginRemeber").not(':checked')) {
            $("#LoginRemeberResult").attr("value", "false");
       }
    });
});

/*********************************************************************************/
/* Rey js                                                                   */
/*********************************************************************************/

/*********************************************************************************/
/* Yako js                                                                   */
/*********************************************************************************/

$(document).ready(function () {

    /*驗證手機聯絡電話格式(for聯絡人)*/
    $("input[name='cTelephone']").blur(function () {
        var checkUserTelephome = new RegExp("^[09]{2}[0-9]{8}$");
        var data = $.trim($("#contactTelTextBox").val());
        var result = checkUserTelephome.test(data);
        if (!result) {
            $("input[name='cTelephone']").select();
            $("#cinfo h3 #cinfoMsg").addClass("coninfored");
            $("#cinfo h3 #cinfoMsg").text("電話:輸入格式不符");
            console.log("result:" + result);
        } else {
            $("#cinfoMsg").text("電話:");
            $("#cinfo h3 #cinfoMsg").removeClass("coninfored");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });

    /*驗證日期格式(for聯絡人)*/
    $("input[name='YDateTextBox']").blur(function () {
        var checkUserTelephome = new RegExp("^((19|20)[0-9]{2}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01]))*$");
        var data = $.trim($("#lostDateTextBox").val());
        var result = checkUserTelephome.test(data);
        if (!result) {
            $("input[name='YDateTextBox']").select();
            $("#findinfo h3 #datainfoMsg").addClass("coninfored");
            $("#findinfo h3 #datainfoMsg").text("日期:格式不符");
            console.log("result:" + result);
        } else {
            $("#datainfoMsg").text('走失日期:');
            $("#datainfoMsg").prepend('<span class="glyphicon glyphicon-time"></span>');
            $("#findinfo h3 #datainfoMsg").removeClass("coninfored");
            cheackResult = 0;
            console.log("cheackResult:" + cheackResult);
        }
    });



})