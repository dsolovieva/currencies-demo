var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var restler = require('restler');
var dailyQuotesUrl = 'http://www.cbr.ru/scripts/XML_daily.asp';
var quoteDynamicUrl = 'http://www.cbr.ru/scripts/XML_dynamic.asp';
var bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use(express.static(__dirname + '/public'));

app.listen(port);

app.get('/dailyQuotes', function (req, res) {
    var date = new Date();
    restler.request(dailyQuotesUrl, {
        query: {date_req: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()},
        parser: restler.parsers.xml
    }).on('complete', function (result) {
        if (result instanceof Error) {
            console.log('Error:', result.message);
        } else {
            res.send(result);
        }
    });
});

app.post('/quoteDynamic', function (req, res) {
    var params = req.body,
        dateStart = new Date(params.dateStart),
        dateEnd = new Date(params.dateEnd),
        graphParamList = params.graphParamList,
        resList = [];

    for (var i = 0; i < graphParamList.length; i++) {
        var code = graphParamList[i].hashKey;
        var resCount = 0;
        console.log("code " + code);
        restler.request(quoteDynamicUrl, {
            query: {
                date_req1: dateStart.getDate() + "/" + dateStart.getMonth() + "/" + dateStart.getFullYear(),
                date_req2: dateEnd.getDate() + "/" + dateEnd.getMonth() + "/" + dateEnd.getFullYear(), VAL_NM_RQ: code
            },
            parser: restler.parsers.xml
        }).on('complete', function (result) {
            resCount++;
            if (result instanceof Error) {
                console.log('Error:', result.message);
            } else {
                var dataList = [];
                if (result.ValCurs.Record) {
                    for (var j = 0; j < result.ValCurs.Record.length; j++) {
                        var dateParts = result.ValCurs.Record[j].$.Date.split('.');
                        dataList.push({
                            date: new Date(dateParts[2], dateParts[1], dateParts[0]).getTime(),
                            value: result.ValCurs.Record[j].Value[0].replace(",", ".")
                        });
                    }
                }
                resList.push({
                    hashKey: result.ValCurs.$.ID,
                    dataList: dataList
                });
                if (resCount == graphParamList.length) {
                    res.send({
                        dateStart: params.dateStart,
                        dateEnd: params.dateEnd,
                        graphParamList: resList
                    });
                }
            }
        });
    }

});

