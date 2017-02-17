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

/* Product의 item color를 text로 반환*/
export function getProductColor (productName, products) {
  for (let i = 0; i < products.length; i++) {
    if (productName === products[i].product) {
      return products[i].itemColor;
      break;
    }
  }
}
