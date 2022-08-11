const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const res = require('express/lib/response');

const condb = require('./db');

//API Allow Access
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3003',//Allow client
    credentials: true,
};
app.use(cors());
// app.use(cors(corsOptions));
// End Api

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res) => {
    return res.send({
        //error: false,
        massage: 'This is RESTFULL CRUD API'
    })
});

//*****************************************
//Alarm
//*****************************************
app.get('/alarm/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, start, end }) => {
        try {
            const results = await condb.query(`SELECT "time","tag","sensor","value" FROM "tbalarm"  
            WHERE ("time" >= '${start}' AND "time" <= '${end}') AND "tag" = '${prod}' ORDER BY time`);
            return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, start: `${startTime}`, end: `${endTime}` });     
});

//*****************************************
//Brix Get All data
//*****************************************
app.get('/sensor/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, start, end }) => {
        try {
            const results = await condb.query(`SELECT "time","tag","sensor","value","target","min","max" FROM "tbbrix" 
            WHERE ("time" >= '${start}' AND "time" <= '${end}') AND "tag" = '${prod}' ORDER BY time`);
            return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, start: `${startTime}`, end: `${endTime}` });     
});

//*****************************************
//Brix Sensor
//*****************************************
//Brix Line
app.get('/brixline/:product/:start/:end/:gt',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;
    const groupTime = req.params.gt;

    querystr = async ({ prod, sensor, start, end, tf }) => {
        try {
            const results = await condb.query(`SELECT mean("value") AS value FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' GROUP BY time(${tf}) Fill(none)`);
            return res.send({
                //error: false,
                data: results
            });
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}`, tf: `${groupTime}`});     
});

//Brix Line Min
app.get('/brixlinemin/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "min" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}`}); 
});

//Brix Line Max
app.get('/brixlinemax/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "max" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}`}); 
});

//Brix Line Target
app.get('/brixlinetarget/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "target" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}`}); 
});

//Brix Current
app.get('/brix/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "value" FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}`});      
});

//Brix Max
app.get('/brixmax/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT max("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}` });       
});

//Brix Min
app.get('/brixmin/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT min("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}` });   
    
});

//Brix Avg
app.get('/brixavg/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT mean("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'brix', start: `${startTime}`, end: `${endTime}` });       
});


//*****************************************
//Temperature Sonser
//*****************************************

//Temp Line
app.get('/templine/:product/:start/:end/:gt',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;
    const groupTime = req.params.gt;

    querystr = async ({ prod, sensor, start, end, tf }) => {
        try {
            const results = await condb.query(`SELECT mean("value") AS value FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' GROUP BY time(${tf}) Fill(none)`);
            return res.send({
                //error: false,
                data: results
            });
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}`, tf: `${groupTime}`});     
});

//Temp Line Min
app.get('/templinemin/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "min" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}`}); 
});

//Temp Line Max
app.get('/templinemax/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "max" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}`}); 
});

//Temp Line Target
app.get('/templinetarget/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "target" FROM "tbbrix" WHERE ("time" >= '${start}' AND "time" <= '${end}')
            AND "tag" = '${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}`}); 
});

//Temp Current
app.get('/temp/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT "value" FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' ORDER BY time DESC Limit 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}`});      
});

//Temp Max
app.get('/tempmax/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT max("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}` });   
});

//Temp Min
app.get('/tempmin/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT min("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}` });    
});

//Temp Avg
app.get('/tempavg/:product/:start/:end',(req,res) => {
    const prodType = req.params.product;
    const startTime = req.params.start;
    const endTime = req.params.end;

    querystr = async ({ prod, sensor, start, end }) => {
        try {
            const results = await condb.query(`SELECT mean("value") AS value FROM "tbbrix" WHERE "time" >= '${start}' AND "time" <= '${end}' 
            AND "tag"='${prod}' AND "sensor" = '${sensor}' LIMIT 1`);
            return res.send({
                //error: false,
                data: results
            });
            //return res.json(results);
        } catch (err) {
            console.log(`Error while processing ${err}`);
        }
    };
    querystr({ prod: `${prodType}`, sensor: 'temp', start: `${startTime}`, end: `${endTime}` });    
});


app.listen(5001,() => {
    console.log('Node Js Running')
});

module.exports = app;

