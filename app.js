require('dotenv').config();

const Influx = require('influx');
const _ = require('lodash');

const client = new Influx.InfluxDB({
  database: 'iotindb',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

//Aggregate into 1d candles
aggrKline = async ({ location, tf }) => {
  try {
    const a_open = await client.query(
        `select first(value) from tbtest WHERE time >= '2022-02-23T12:14:59Z' AND time <= '2022-02-23T16:14:34Z' AND location = '${location}' GROUP BY time(${tf})`
        //'select * from tbtest'
      );
    /*
    const a_close = await client.query(
      `select last(close) from kline_data WHERE time >= '2021-01-04T00:00:00Z' AND time <= '2021-02-03T00:00:00Z' AND symbol = '${symbol}' GROUP BY time(${tf})`
    );
    const a_high = await client.query(
      `select max(high) from kline_data WHERE time >= '2021-01-04T00:00:00Z' AND time <= '2021-02-03T00:00:00Z' AND symbol = '${symbol}' GROUP BY time(${tf})`
    );
    const a_low = await client.query(
      `select min(low) from kline_data WHERE time >= '2021-01-04T00:00:00Z' AND time <= '2021-02-03T00:00:00Z' AND symbol = '${symbol}' GROUP BY time(${tf})`
    );
    */
    const kline_aggr = a_open.map((o, i) => {
      return {
        location,
        time: o.time.getTime(),
        //timestamp: o.time.toLocaleString(),
        value: o.first,
        //high: a_high[i].max,
        //low: a_low[i].min,
        //close: a_close[i].last,
      };
    });
    console.table(kline_aggr);
  } catch (err) {
    console.log(`Error while processing ${err}`);
  }
};

aggrKline({ location: 'temperature', tf: '1h' });
/*

runQry = async () => {
    try {
      const results = await client.query(`
      select * from tbtest
      limit 10
    `);
      console.table(results);
    } catch (err) {
      console.log(`Error while processing ${err}`);
    }
  };
  
  runQry();
  */