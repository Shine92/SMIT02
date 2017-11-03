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
        if (!result) {
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

        if (confirmPwd != pwd) {
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
        if (loginAccount == null || loginAccount == "") {
            alert("登入錯誤:請輸入帳號");
            return false;
        } else if (loginPassword == null || loginPassword == "") {
            alert("登入錯誤:請輸入密碼");
            return false;
        } else {
            return true;
        }

        if ($("#LoginRemeber").is(':checked')) {
            $("#LoginRemeberResult").attr("value", "true");
        } else if ($("#LoginRemeber").not(':checked')) {
            $("#LoginRemeberResult").attr("value", "false");
        }
    });
});

/*********************************************************************************/
/* Rey js                                                                   */
/*********************************************************************************/


$(document).ready(function () {
    menu();
    memberMenu();
});

function menu() {
    $("#menu a").each(function (index, element) {
        if (element.href == location.href) {
            $('#menu  li:eq(' + index + ')').addClass("current_page_item");
        }
    });
}

function memberMenu() {
    if (getCookie("FoundCity2017") != "") {
        $("#memberLoginbtn").hide();
        $("#memberLogoutbtn").show();
        $("#memberCenter").show();
    } else {
        $("#memberLoginbtn").show();
        $("#memberLogoutbtn").hide();
        $("#memberCenter").hide();
    }
}

function initHome() {
    $.ajax({
        url: "/Home/Data",
        type: "Post",
        success: function (data) {

            $.each(data.Pet, function (index, vul) {
                var viewID = "viewPet";
                viewHome(viewID, vul);
            });

            $.each(data.Mom, function (index, vul) {
                var viewID = "viewMom";
                viewHome(viewID, vul);
            });
        },
        error: function (error) {

        }
    });
}

function viewHome(viewID, data) {

    var viewTime;
    var viewSite;

    switch (viewID) {
        case "viewPet":
            viewTime = "遺失時間：" + data.LostDate;
            viewSite = "遺失地點：" + data.LostPlace1 + data.LostPlace2 + data.LostPlace3;
            break;
        case "viewMom":
            console.log(data.FindDate);
            viewTime = "拾獲時間：" + data.FindDate;
            viewSite = "拾獲地點：" + data.FindPlace1 + data.FindPlace2 + data.FindPlace3;
            break;
    }

    $('#' + viewID).append(
        $('<div>').addClass('col-xs-3 col-sm-3 col-md-3 col-lg-3').append(
             $('<div>').addClass('panel panel-default').append(
                 $('<div>').addClass('panel-body').append(
                     $('<a>').attr('href', '#').append(
                         $('<img>').attr('src', '../images/' + data.PetPhoto).attr('alt', 'Image'))),
                 $('<div>').addClass('panel-footer').append(
                     $('<div>').addClass('panelFooterTitle').text(viewTime),
                     $('<div>').addClass('panelFooterPrice').text(viewSite))
        )));
}


/*********************************************************************************/
/* Yako js                                                                   */
/*********************************************************************************/