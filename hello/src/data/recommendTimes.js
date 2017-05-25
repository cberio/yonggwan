import moment from 'moment';

const today = moment();

const recommendTimes = [
    {
        start: today.set({ hour: 10, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        end: today.set({ hour: 11, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
    },
    {
        start: today.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        end: today.set({ hour: 13, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
    },
    {
        start: today.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        end: today.set({ hour: 16, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
    },
    {
        start: today.set({ hour: 18, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        end: today.set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
    },
    {
        start: today.set({ hour: 21, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
        end: today.set({ hour: 22, minute: 0, second: 0, millisecond: 0 }).format('YYYY-MM-DDTHH:mm:ss'),
    }
];

export default recommendTimes;
