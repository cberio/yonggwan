import moment from 'moment';

// print warring message
export function createWarning(method) {
    console.warn(`@@ ${method} is not defined !`);
}

// return client browser info (IE)
export function getVersionIE() {
    let word;
    let version = 'N/A';
    const agent = navigator.userAgent.toLowerCase();
    const name = navigator.appName;

    // IE old version ( IE 10 or Lower )
    if (name === 'Microsoft Internet Explorer')
        word = 'msie ';

    // IE 11
    else if (agent.search('trident') > -1)
        word = 'trident/.*rv:';
    // Microsoft Edge
    else if (agent.search('edge/') > -1)
        word = 'edge/';

    const reg = new RegExp(`${word}([0-9]{1,})(\\.{0,}[0-9]{0,1})`);
    if (reg.exec(agent) != null)
        version = RegExp.$1 + RegExp.$2;
    return version;
}

/* milliseconds 를 인수로 받아 분단위로 반환 */
export function millisecondsToMinute(ms) {
    const duration = moment.duration(ms, 'milliseconds');
    const fromMinutes = Math.floor(duration.asMinutes());
    return (fromMinutes <= 9 ? `0${fromMinutes}` : fromMinutes);
}

/* int형의 분을, 00시간 00분 형식으로 반환 */
export function minuteToTime(m) {
    const hour = Math.floor(Number(m) / 60);
    const minute = Number(m) % 60;
    if (hour > 0 && minute === 0)
        return `${hour}시간`;
    else if (hour === 0 && minute > 0)
        return `${minute}분`;

    return `${hour}시간 ${minute}분`;
}

/* milliseconds 를 인수로 받아 00시간 00분 형식으로 반환 */
export function millisecondsToTime(ms) {
    const duration = moment.duration(ms, 'milliseconds');
    const fromMinutes = Math.floor(duration.asMinutes());
    const fullMinute = (fromMinutes <= 9 ? `0${fromMinutes}` : fromMinutes);

    const hour = Math.floor(fullMinute / 60);
    const minute = fullMinute % 60;
    if (hour > 0 && minute === 0)
        return `${hour}시간`;
    else if (hour === 0 && minute > 0)
        return `${minute}분`;

    return `${hour}시간 ${minute}분`;
}

/* Return service object*/
export function getService(serviceID, services) {
    if (!serviceID || !services) return {};
    return services.find(service => service.id == serviceID);
}

/* Return staff object*/
export function getStaff(staffID, staffs) {
    if (!staffID || !staffs) return {};
    return staffs.find(staff => staff.id === staffID);
}

/* Return guest object*/
export function getGuest(guestID, guests) {
    if (!guestID || !guests) return {};
    return guests.find(guest => guest.id === guestID);
}

/* Return history array*/
export function getHistory(guestID, histories) {
    const history = [];
    histories.find((his) => {
        const case1 = his.guest_id === guestID;
        const case2 = true;
        const case3 = true;
        if (case1 && case2 && case3) history.push(his);
    });
    return history;
}

/* 숫자를 인수로 받아 3자리단위에 콤마삽입하여 반환 (금액 표현) */
export function numberWithCommas(num) {
    if (num)
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* 숫자를 인수로 받아 하이픈을 삽입하여 반환 (핸드폰번호 표현) */
export function getPhoneStr(num) { // num = 01012345678
    const num_all = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3'); // 010-1234-5678
    const num_first = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1'); // 010
    const num_middle = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$2'); // 1234
    const num_last = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$3'); // 5678
    return num_all;
}
