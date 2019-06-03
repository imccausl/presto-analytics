import moment from "moment";

function totalDailyTransactionBreakdown(
  transactions,
  includeAmountInDomain = false
) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  function getDates(start, stop) {
    const dateObj = {};
    let currentDate = moment(start);
    const stopDate = moment(stop);

    console.log("***", currentDate, stopDate);

    while (currentDate <= stopDate) {
      const formattedDate = currentDate.format("DD/MM/YYYY");

      dateObj[formattedDate] = { amount: 0, trips: 0 };
      currentDate = currentDate.add(1, "days");
    }

    return dateObj;
  }

  if (transactions.length === 0) {
    const currDate = moment();

    return {
      date: currDate.format("DD"),
      dayOfWeek: days[currDate.day()],
      amount: "0.00",
      trips: 0
    };
  }

  const domain = [0, 0];
  const startDate = moment(transactions[0].date)
    .utcOffset(0)
    .format("YYYY-MM-DD");
  const endDate = moment(transactions[transactions.length - 1].date)
    .utcOffset(0)
    .format("YYYY-MM-DD");

  const dataset = getDates(startDate, endDate);

  transactions.forEach(item => {
    const date = moment(item.date)
      .utcOffset(0)
      .format("DD/MM/YYYY");

    console.log("** dataset[date]:", date, dataset[date], dataset);
    const amount = parseFloat(item.amount);
    dataset[date].amount += amount;
    dataset[date].trips += 1;
  });

  const breakdown = Object.keys(dataset).map(key => {
    const currDate = moment(key, "DD/MM/YYYY");

    if (includeAmountInDomain) {
      domain[1] =
        domain[1] < dataset[key].amount
          ? (dataset[key].amount / 100).toFixed(2)
          : domain[1];
    }

    domain[1] = domain[1] < dataset[key].trips ? dataset[key].trips : domain[1];

    return {
      date: currDate.format("DD"),
      dayOfWeek: days[currDate.day()],
      amount: (dataset[key].amount / 100).toFixed(2),
      trips: dataset[key].trips
    };
  });

  return { dataset: breakdown, domain };
}

export { totalDailyTransactionBreakdown };
