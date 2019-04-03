var datas = getDatas($); //費率資料

var logic = function(rbtnInfo) {
  var parDays = rbtnInfo.parDays
  var borndtt = turnStarTdd(rbtnInfo.borndt); //出生年月日
  var startdd = turnStarTdd(rbtnInfo.startdt); //投保始期
  var enddt = turnEnddt(rbtnInfo.startdt,parDays); //投保結束日
  var age = rbtnInfo.relage; //實際年齡
  var fullage = borndtt + 150000;
  var vfullage = fullage;
  var parPG = rbtnInfo.parPG === "AD" ? "AF" : "AK"; //險種
};

/**
 **取得費率
 **/

function getDatas($) {
  $.get("data.json", function(response) {
    return response;
  });
}

/**
 **轉換投保始期
 **/

function turnStarTdd(date) {
  return parseInt(date.substring(0, 3)) +  1911 + "" + date.substring(3, 5) + "" + date.substring(5, 7); 
}

/**
 **轉換投保終期
 **/

function turnEnddt(date,days) {
 var date = parseInt(date.substring(0, 3)) +  1911 + "-" + date.substring(3, 5) + "-" + date.substring(5, 7); 
 var dat = new Date(date);
 dat.setDate(dat.getDate()+days);
 return dat;
}
