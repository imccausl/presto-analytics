import moment from 'moment';

function totalDailyTransactionBreakdown(transactions, includeAmountInDomain = false) {
  const dataset = {};
  const domain = [0, 0];
  const currYear = new Date(transactions[0].date).getFullYear();
  const currMonth = new Date(transactions[0].date).getMonth() + 1;
  const lastDay = moment(transactions[0].date)
    .utcOffset(0)
    .date();

  for (let i = 1; i <= lastDay; i += 1) {
    const dateString = `${i < 10 ? `0${i}` : i}/${
      currMonth < 10 ? `0${currMonth}` : currMonth
    }/${currYear}`;
    dataset[dateString] = { amount: 0, trips: 0 };
  }

  transactions.forEach((item) => {
    const date = moment(item.date)
      .utcOffset(0)
      .format('DD/MM/YYYY');

    const amount = parseFloat(item.amount);
    console.log(date);
    dataset[date].amount += amount;
    dataset[date].trips += 1;
  });

  const breakdown = Object.keys(dataset).map((key) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currDate = moment(key, 'DD/MM/YYYY');

    if (includeAmountInDomain) {
      domain[1] = domain[1] < dataset[key].amount ? dataset[key].amount : domain[1];
    }
    domain[1] = domain[1] < dataset[key].trips ? dataset[key].trips : domain[1];

    return {
      date: currDate.format('DD'),
      dayOfWeek: days[currDate.day()],
      amount: dataset[key].amount,
      trips: dataset[key].trips,
    };
  });

  console.log(breakdown);
  return { dataset: breakdown, domain };
}

export { totalDailyTransactionBreakdown };
