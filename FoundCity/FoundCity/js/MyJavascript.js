/*********************************************************************************/
/* Simon js                                                                   */
/*********************************************************************************/

var cheackResult = 0;
$(document).ready(function () {
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
});

/*********************************************************************************/
/* Rey js                                                                   */
/*********************************************************************************/

/*********************************************************************************/
/* Yako js                                                                   */
/*********************************************************************************/
