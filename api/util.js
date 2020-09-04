
const formDate = date=>{
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var seconds =date.getSeconds();
    month=month.toString().length>1?month:"0"+month;
    day =day.toString().length>1?day:"0"+day;
    hours =hours.toString().length>1?hours:"0"+hours;
    seconds =seconds.toString().length>1?seconds:"0"+seconds;

    return [year,month,day].join("-")+" "+[hours,seconds].join(":");
}

const formDateToDay=date=>{
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hours = date.getHours();
    var seconds =date.getSeconds();
    month=month.toString().length>1?month:"0"+month;
    day =day.toString().length>1?day:"0"+day;
    hours =hours.toString().length>1?hours:"0"+hours;
    seconds =seconds.toString().length>1?seconds:"0"+seconds;

    return [year,month,day].join("-");
}


module.exports={formDate:formDate}