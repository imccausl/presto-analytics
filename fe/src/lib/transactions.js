import moment from "moment";

function totalDailyTransactionBreakdown(
  transactions,
  includeAmountInDomain = false
) {
  function getDates(start, stop) {
    const dateObj = {};
    let currentDate = moment(start);
    const stopDate = moment(stop);

    while (currentDate <= stopDate) {
      const formattedDate = currentDate.format("DD/MM/YYYY");

      dateObj[formattedDate] = {
        amount: 0,
        trips: 0,
        transfers: 0,
        fares: 0,
        transferLocations: [],
        fareLocations: []
      };
      currentDate = currentDate.add(1, "days");
    }

    return dateObj;
  }

  if (transactions.length === 0) {
    const currDate = moment();

    return {
      date: currDate.format("DD"),
      dayOfWeek: currDate.format("dddd"),
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

    const amount = parseFloat(item.amount);

    if (item.type === "Transfer") {
      dataset[date].transferLocations.push({
        location: item.location,
        time: item.date
      });
    }

    if (item.type === "Fare Payment" || item.type === "Transit Pass Payment") {
      dataset[date].fareLocations.push({
        location: item.location,
        time: item.date
      });
    }

    dataset[date].amount += amount;
    dataset[date].trips += 1;
    dataset[date].transfers += item.type === "Transfer" ? 1 : 0;
    dataset[date].fares +=
      item.type === "Fare Payment" || item.type === "Transit Pass Payment"
        ? 1
        : 0;
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
      label: `${currDate.format("MMM")} ${currDate.format("DD")}`,
      date: currDate.format("DD"),
      dayOfWeek: currDate.format("dddd"),
      month: currDate.format("MMMM"),
      year: currDate.format("YYYY"),
      amount: (dataset[key].amount / 100).toFixed(2),
      trips: dataset[key].trips,
      transfers: {
        count: dataset[key].transfers,
        locations: dataset[key].transferLocations
      },
      fares: {
        count: dataset[key].fares,
        locations: dataset[key].fareLocations
      }
    };
  });

  return { dataset: breakdown, domain };
}

function groupByDate(transactions) {
  const dataset = {};

  transactions.forEach(transaction => {
    const date = moment(transaction.date).format("MM-DD-YYYY");

    if (dataset[date]) {
      dataset[date].push(transaction);
    } else {
      dataset[date] = [transaction];
    }
  });

  return dataset;
}

export { totalDailyTransactionBreakdown, groupByDate };
