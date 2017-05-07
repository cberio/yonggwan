import moment from 'moment';

/* milliseconds 를 인수로 받아 분단위로 반환 */
export function millisecondsToMinute (ms) {
  let duration = moment.duration(ms, 'milliseconds');
  let fromMinutes = Math.floor(duration.asMinutes());
  return (fromMinutes<= 9 ? '0'+ fromMinutes : fromMinutes);
}

/* int형의 분을, 00시간 00분 형식으로 반환 */
export function minuteToTime (m) {
  var hour = Math.floor(m/60);
  var minute = m % 60;
  if (hour > 0 && minute === 0) {
    return hour + '시간';
  } else if (hour === 0 && minute > 0) {
   return minute + '분';
  } else {
    return hour + '시간 '+ minute +'분';
  }
}

/* milliseconds 를 인수로 받아 00시간 00분 형식으로 반환  (위의 두개의 함수를 병합한 셈)*/
export function millisecondsToTime (ms) {
   let duration = moment.duration(ms, 'milliseconds');
   let fromMinutes = Math.floor(duration.asMinutes());
   let fullMinute = (fromMinutes<= 9 ? '0'+ fromMinutes : fromMinutes);

   var hour = Math.floor(fullMinute/60);
   var minute = fullMinute % 60;
   if (hour > 0 && minute === 0) {
     return hour + '시간';
   } else if (hour === 0 && minute > 0) {
    return minute + '분';
   } else {
     return hour + '시간 '+ minute +'분';
   }
}

/* Return service object*/
export function getService (serviceID, services) {
  if(!services) return '';
  return services.find((service) => service.id == serviceID );
}

/* Return staff object*/
export function getStaff (staffID, staffs) {
  if(!staffs) return '';
  return staffs.find((staff) => staff.id === staffID );
}

/* Return guest object*/
export function getGuest (guestID, guests) {
  if(!guests) return '';
  return guests.find((guest) => guest.id === guestID );
}

/* Return history array*/
export function getHistory (guestID, histories) {
  var history = [];
  histories.find(his => {
    let case1 = his.guest_id === guestID;
    let case2 = true;
    let case3 = true;
    if (case1 && case2 && case3) history.push(his);
  })
  return history;
}

/* 숫자를 인수로 받아 3자리단위에 콤마삽입하여 반환 (금액 표현) */
export function numberWithCommas (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 숫자를 인수로 받아 하이픈을 삽입하여 반환 (핸드폰번호 표현) */
export function getPhoneStr (num) { // num = 01012345678
  var num_all = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3"); // 010-1234-5678
  var num_first  = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1"); // 010
  var num_middle = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$2"); // 1234
  var num_last   = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$3"); // 5678
  return num_all;
}
