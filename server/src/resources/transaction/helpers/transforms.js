const moment = require('moment');

const { getMonthName } = require('../../../../lib/util/date');
const types = require('../../../../lib/util/types');

function transform(transactions) {
  const data = {};

  // transform the shit out of this data:
  // may be able to do this in a more sql-y way at some point?
  transactions.forEach(item => {
    const itemDate = new Date(item.date);
    const monthNum = moment(itemDate).format('M');
    const transitPassPurchasePeriod =
      moment(itemDate)
        .endOf('month')
        .diff(itemDate, 'days') <= 8;

    let year = moment(itemDate).format('YYYY');
    let month = getMonthName(moment(itemDate).month());

    // if a transit pass was purchased 8 days before the end of the month,
    // move it to the next month because it was for that month that it was
    // purchased.

    // There is a bug here: amount sometimes reverts to 0.

    if (item.type === types.TRANSIT_PASS_LOAD && transitPassPurchasePeriod) {
      const addMonth = moment(itemDate, 'M').add(1, 'months');
      if (monthNum === 12) {
        year += 1;
      }

      month = getMonthName(moment(addMonth).month());
    }

    if (data[year]) {
      if (data[year][month]) {
        if (item.type !== types.TRANSIT_PASS_LOAD) {
          data[year][month].transactions.push(item);
          data[year][month].amount += parseInt(item.amount, 10);
        } else {
          data[year][month].transitPassAmount += parseInt(item.amount, 10);
        }
      } else {
        data[year][month] = {
          transactions: item.type === types.TRANSIT_PASS_LOAD ? [] : [item],
          amount: item.type === types.TRANSIT_PASS_LOAD ? 0 : parseInt(item.amount, 10),
          transitPassAmount: item.type === types.TRANSIT_PASS_LOAD ? parseInt(item.amount, 10) : 0
        };
      }
    } else {
      data[year] = {
        [month]: {
          transactions: item.type === types.TRANSIT_PASS_LOAD ? [] : [item],
          amount: item.type === types.TRANSIT_PASS_LOAD ? 0 : parseInt(item.amount, 10),
          transitPassAmount: item.type === types.TRANSIT_PASS_LOAD ? parseInt(item.amount, 10) : 0
        }
      };
    }
  });

  return data;
}

module.exports = { transform };
