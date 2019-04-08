var datas = getDatas($); //費率資料

/** 
@parDays	    --要保天數(1~180)
@parPG		   	--選擇 AD.個人保險 AG.團體保險
@parAddPol  	--選擇 0.不加保 
              --     1. 5%傷害醫療 
              --     2. 10%傷害醫療 								
              --     3. 5%傷害醫療+海外疾病住院醫療 
              --     4. 10%傷害醫療+海外疾病住院醫療
@parMoney	   	--保險金額
@borndt		    --出生年月日
@relage       --實際年齡
@startdt	    --投保始期(民國年月日)	*/


var logic = function(rbtnInfo) {

  var i ;//差異天數
  var parDays = rbtnInfo.parDays;//要保天數
  var parMoney = rbtnInfo.parMoney;//保額
  var borndtt = turnStarTdd(rbtnInfo.borndt); //出生年月日
  var startdd = turnStarTdd(rbtnInfo.startdt); //投保始期西元年
  var enddt = turnEnddt(rbtnInfo.startdt,parDays); //投保結束日
  var age = rbtnInfo.relage; //實際年齡
  var fullage = borndtt;//滿15歲的年月日 borndtt + 150000
  var vfullage = fullage;
  var parPG = changePG(age,rbtnInfo.parPG); //險種
  var parAddPol = rbtnInfo.parAddPol;//附加傷害醫療
  var adbpm;//附加保費
  var adbpm2;//附加保費

  var array = getAdbpm (parAddPol,parMoney,parDays,);//保費計算


/**
 **保費計算
 **/
function getAdbpm (){

  //附加傷害醫療(1=5%,2=10%)
  if(parAddPol==='1' || parAddPol==='2'){

    //MR(MG)保額有0.5萬,則先*2再/2
    if(parAddPol==='1' && parMoney*0.05*10%10 === 5){

     var v = 0.05*2;

     var adbpmTemp = datas.filter((_item)=>{
        return _item.TADAY === parDays && (((parPG === 'AE'|| parPG === 'AF') && _item.TACODE ==='MS')
        || ((parPG === 'AJ'|| parPG === 'AK') && _item.TACODE ==='MF')) && _item.bsf === parMoney*v ;
      });

     var adbpmSUM = adbpmTemp.reduce((accumulator, currentValue) => accumulator + currentValue);

     return adbpm = Math.round(adbpmSUM/2);
    }
  //正常狀態
  else{

     var v = parAddPol === '1'? 0.05 : 0.1;

      var adbpmTemp = datas.filter((_item)=>{
        return _item.TADAY === parDays && (((parPG === 'AE'|| parPG === 'AF') && _item.TACODE ==='MS')
        || ((parPG === 'AJ'|| parPG === 'AK') && _item.TACODE ==='MF')) && _item.bsf === parMoney*v ;
      }) ;

    var adbpmSUM = adbpmTemp.reduce((accumulator, currentValue) => accumulator + currentValue);

    return adbpm = Math.round(adbpmSUM/2);
    }

  }// if

  //--傷害醫療+海外疾病住院醫療(3=5%,4=10%)
  else if(parAddPol==='3' || parAddPol==='4'){

    //MR(MG)保額有0.5萬,則先*2再/2
   if(parAddPol==='3' && parMoney*0.05*10%10 === 5){
     
    var v = 0.05*2;

    var adbpmTemp = datas.filter((_item)=>{
      return _item.TADAY === parDays && (((parPG === 'AE'|| parPG === 'AF') && _item.TACODE ==='MS')
      || ((parPG === 'AJ'|| parPG === 'AK') && _item.TACODE ==='MF')) && _item.bsf === parMoney*v ;
    }) ;

    var adbpmSUM = adbpmTemp.reduce((accumulator, currentValue) => accumulator + currentValue);
    adbpm = Math.round(adbpmSUM/2);


    var adbpm2TempA = datas.filter((_item)=>{
      return _item.TADAY === parDays && (parPG === 'SM' && _item.bsf === parMoney*0.05-0.5) 
    })[0].BPM ; 

    var adbpm2TempB = datas.filter((_item)=>{
      return _item.TADAY === parDays && (parPG === 'SM' && _item.bsf === parMoney*0.05+0.5) 
    })[0].BPM ; 

    adbpm2 = (adbpm2TempA + adbpm2TempB)/2 ;

    return adbpm + Math.round(adbpm2);
  
   }
   //--正常狀態
   else { 

    var v = parAddPol ==='3'? 0.05: 0.1;

    var adbpmTemp = datas.filter((_item)=>{
      return _item.TADAY === parDays && (((parPG === 'AE' || parPG === 'AF') && (_item.TACODE ==='MS'||_item.TACODE ==='SM'))
      || ((parPG === 'AJ'|| parPG === 'AK') &&(_item.TACODE ==='MF' ||_item.TACODE ==='SM'))) && _item.bsf === parMoney*v ;
    }) ;

    var adbpmSUM = adbpmTemp.reduce((accumulator, currentValue) => accumulator + currentValue);
    
    // adbpm = Math.round(adbpmSUM/2);

   }



  }





}




};



/**
 **轉換險種
 **/
function changePG (age,parPG){
   if(age < 15 )//小於15歲,以投保始期(@startdt)為基準
   return parPG === 'AD'? parPG = 'AF': parPG === 'AG' ? parPG = 'AK': '';
   else if(age >= 15)//(15歲以上)
   return parPG === 'AD'? parPG = 'AE': parPG = 'AJ';
}

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
 dat.setDate(dat.getDate() + parseInt(days));
 return dat;
}
