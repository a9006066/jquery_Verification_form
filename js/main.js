$(document).ready(function(){

    // 初始化
    var polAge; //投保年齡
    var relAge; //實際年齡
    var rbtnPG_Val;//個人件/團體件項目值
    var rbtnAbbpol_Val;//附加醫療項目值

    var rbtnPG = $("input:radio[name=rbtnPG]");//個人件/團體件
    var rbtnAbbpol = $("input:radio[name=rbtnAbbpol]")//附加醫療項目
    var txbDays = $("#txbDays"); //天數
    var txtMoney = $("#txtMoney");//保險金額
    var txt_tr_birdt = $("#txt_tr_birdt");//被保人生日;
    var txt_tr_effdt = $("#txt_tr_effdt");//生效日期;
    var verifyBtn = $("#submit");//送出紐

    //驗證規則
    // var numReg = new RegExp('^[0-9]{7}$');//驗證7位數字
    var daysReg = new RegExp('^[1-9]\\d?$|^1[0-7]|d$|^180$');//輸入0-180天數


    /**
     **計算實際年齡
     **/
    var getRelAge = function (birdt, effdt) {

        var effdt = parseInt(effdt.substring(0, 3)) + 1911 + '-' + effdt.substring(3, 5) + '-' + effdt.substring(5, 7);

        var iYear = parseInt(birdt / 10000) + 1911;
        var iMon = parseInt(birdt / 100 % 100);
        var iDay = parseInt(birdt % 100);

        var idt = new Date(iYear.toString() + '-' + iMon.toString() + '-' + iDay.toString());
        var ndt = new Date(effdt);

        var nAge = ndt.getFullYear() - idt.getFullYear();
        var a = ndt.getTime() - idt.getTime();

        if (a < 0) {
            nAge = nAge - 1;
        }

        if (nAge < 0)
            nAge = 0;
        return nAge;
    }


    /**
     **計算保險年齡
     **/
    var getCalAge = function (birdt, effdt) {

        var effdt = parseInt(effdt.substring(0, 3)) + 1911 + '-' + effdt.substring(3, 5) + '-' + effdt.substring(5, 7);

        var iYear = parseInt(birdt / 10000);
        var iMon = parseInt(birdt / 100 % 100);
        var iDay = parseInt(birdt % 100);

        if (effdt)
            var date1 = new Date(effdt);
        else
            var date1 = new Date();

        var nYear = date1.getFullYear(); // 紀錄年
        var nMon = date1.getMonth() + 1; // 紀錄月
        var nDay = date1.getDate(); // 紀錄日
        var nAge = parseInt(nYear - iYear - 1911); // 紀錄年齡

        // 判斷輸入的日>系統的日
        if (iDay > nDay) {
            // 判斷系統的月<輸入的月
            if (nMon < iMon) {
                // 判斷系統的月+12-輸入的月-1>=6
                if ((nMon + 12 - iMon - 1) >= 6) {
                    nAge = nYear - iYear - 1911;
                } else {
                    nAge = nYear - iYear - 1911 - 1;
                }
            } else {
                if ((nMon - iMon - 1) >= 6) {
                    nAge = nYear - iYear - 1911 + 1;
                } else {
                    nAge = nYear - iYear - 1911;
                }
            }
        }
        // 判斷輸入的日<系統的日
        else if (iDay < nDay) {
            if (iMon > nMon) {
                if ((nMon + 12 - iMon) >= 6) {
                    nAge = nYear - iYear - 1911;
                } else {

                    nAge = nYear - iYear - 1911 - 1;
                }
            } else {
                if ((nMon - iMon) >= 6) {
                    nAge = nYear - iYear - 1911 + 1;
                } else {
                    nAge = nYear - iYear - 1911;
                }
            }
        }
        // 判斷輸入的日==系統的日
        else if (iDay == nDay) {
            if (iMon > nMon) {
                if ((nMon + 12 - iMon) > 6) {
                    nAge = nYear - iYear - 1911;
                } else {
                    nAge = nYear - iYear - 1911 - 1;
                }
            } else {
                if ((nMon - iMon) > 6) {
                    nAge = nYear - iYear - 1911 + 1;
                } else {
                    nAge = nYear - iYear - 1911;
                }
            }
        }
        if (nAge < 0)
            nAge = 0;
        return nAge;
    };

    /**
     **驗證保險金額
     **/
    var txtMoneyVerify = function (relage, polage) {

        var boolen = false;

        var range = [];

        rbtnPG_Val = $("input:radio:checked[name=rbtnPG]").val();

        var  rbtnPG_Name = rbtnPG_Val === 'AD' ?'個人件':'團體件';

        if (relage < 15) {
            range[0] = rbtnPG_Val === 'AD' ? 200 : 100;
            range[1] = 200;
        }
        else if (relage >= 15) {
            range[0] = rbtnPG_Val === 'AD' ? 100 : 50;
            if (polage <= 20) {
                range[1] = 500;
            }
            else if (polage <= 65 && polage > 20) {
                range[1] = 1500;
            }
            else if (polage <= 80 && polage > 65) {
                range[1] = 300;
            }
            else if (polage > 80) {
                range[1] = 100;
            }
        }

        var bsf = parseInt(txtMoney.val());

        if (isNaN(bsf)) {
            $("#txtMoney_error").text('保險金額請填寫!!').attr('class', 'elem_color_red');
            $("#txtMoney_right").text('').attr('class","elem_color_white');
            return false;
        }

        if ((bsf % 10) != 0) {
            $("#txtMoney_error").text('【保險金額】請以10萬元為級距單位!!').attr('class','elem_color_red');
            $("#txtMoney_right").text('').attr('class","elem_color_white');
            boolen = false;
        }

        if (bsf < range[0] || bsf > range[1]) {
            $("#txtMoney_error").text('【保險金額】有誤，【' + rbtnPG_Name + '】保險金額須介於' + range[0] + '萬~' + range[1] + '萬之間!').attr('class', 'elem_color_red');
            $("#txtMoney_right").text('').attr('class','elem_color_white');
            boolen = false;
        } else {
            $("#txtMoney_error").text('');
            $("#txtMoney_right").text('✔').attr('class','elem_color_green');
            boolen = true;
        }

        return boolen;

    }

    /**
     **rbtnPG 驗證標示清空
     **/
    rbtnPG.on("change",function(){
        $("#txtMoney_error").text('');
        $("#txtMoney_right").text('') ;
    });

    /**
     **驗證
     **/
    verifyBtn.on("click",function(){

        $("#result").empty();

        //天數
        if(daysReg.test(txbDays.val().trim())){
            $("#txbDays_error").text('');
            $("#txbDays_right").text('✔').attr('class','elem_color_green');
        }else{
            $("#txbDays_error").text('請輸入天數!').attr("class","elem_color_red");
            $("#txbDays_right").text('').attr("class","elem_color_white");
            return;
        }

        //被保人生日
        if(txt_tr_birdt.val() !== ""){
            $("#birdt_error").text('');
            $("#birdt_right").text('✔').attr('class','elem_color_green');
        }else{
            $("#birdt_error").text('【被保人生日】請輸入!').attr('class','elem_color_red');
            $("#birdt_right").text('').attr('class','elem_color_white');
            return;
        }

        //生效日
        if(txt_tr_effdt.val() !== ""){
            $("#effdt_error").text('');
            $("#effdt_right").text('✔').attr('class','elem_color_green');
        }else{
            $("#effdt_error").text('【生效日期】請輸入!').attr('class','elem_color_red');
            $("#effdt_right").text('').attr('class','elem_color_white');
            return;
        }
        //保險金額
        polAge = getCalAge(txt_tr_birdt.val(), txt_tr_effdt.val());//保險年齡
        relAge = getRelAge(txt_tr_birdt.val(), txt_tr_effdt.val());//真實年齡
        if (!txtMoneyVerify(relAge, polAge))
            return;

        //附加醫療
        rbtnAbbpol_Val = $("input:radio:checked[name=rbtnAbbpol]").val();
        if(rbtnAbbpol_Val === null && rbtnAbbpol_Val === ""){
            $("#rbtnAbbpol_error").text('請選擇!').attr('class','elem_color_red');
            $("#rbtnAbbpol_right").text('').attr('class','elem_color_white');
            return;
        }else{
            $("#rbtnAbbpol_right").text('');
            $("#rbtnAbbpol_right").text('✔').attr('class','elem_color_green');
        }

        submit();


    });


    /**
     **送出資訊
     **/
    var submit = function(){

        var rbtnInfo = {};
        rbtnInfo.parDays = txbDays.val();//要保天數
        rbtnInfo.parPG = $("input:radio:checked[name=rbtnPG]").val();//個人險/團險
        rbtnInfo.parAddPol = $("input:radio:checked[name=rbtnAbbpol]").val();
        rbtnInfo.parMoney = txtMoney.val();//保險金額
        rbtnInfo.borndt = txt_tr_birdt.val();//出生年月日(民國年月日)
        rbtnInfo.relage = relAge;//實際年齡
        rbtnInfo.startdt = txt_tr_effdt.val()//投保始期(民國年月日)

        serviceCenterService.selectRbtn({rbtnData: JSON.stringify(rbtnInfo)}, function (data) {
            if (data.success) {
                var premium = data.data;
                $("#result").append($("<h4></h4>").css('margin-top','2em')
                 .append($("<span>總保費:</span>").css({'color':'red','float':'left'})
                 .text('總保費:' + premium + '元/每人')));
            }
        })
    }

});