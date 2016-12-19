Ext.define('Currencies.store.Chart', {
    extend: 'Ext.data.Store',
    proxy: {
        type: 'rest',
        paramsAsJson: true,
        actionMethods: {
            read: 'POST'
        },
        url: AppConfig.server_url + AppConfig.chart_service_url,
        extraParams: {
            "sessionId": "sessionId",
            "graphParamList": []
        }
    },
    reader: {
        type: 'json',
        rootProperty: 'ValCurs.Record'
    }
});