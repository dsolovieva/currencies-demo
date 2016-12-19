Ext.define('Currencies.view.main.Main', {
    extend: 'Ext.container.Viewport',
    requires: ['Currencies.view.*', 'Ext.dashboard.*'],
    xtype: 'app-main',
    overflowY: 'auto',
    controller: 'main',
    layout: 'fit',
    listeners: {
        afterrender: 'onAfterRender'
    },

    initComponent: function () {
        this.items = [{
            xtype: 'panel',
            reference: 'cntContent',
            scrollable: true,
            layout: 'border',
            items: [{
                title: 'Currencies Data',
                region: 'east',
                width: "20%",
                height: "100%",
                layout: 'fit',
                items: [{xtype: 'currenciesgrid'}]
            }, {
                title: 'Charts',
                region: 'east',
                reference: 'monitoringCharts',
                width: "80%",
                height: "100%",
                layout: 'fit',
                items: [{xtype: 'line-marked'}]
            }]
        }];

        this.callParent(arguments);
    }
});
