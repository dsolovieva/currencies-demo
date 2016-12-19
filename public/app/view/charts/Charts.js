Ext.define('Currencies.view.charts.Charts', {
    extend: 'Ext.panel.Panel',
    xtype: 'line-marked',
    controller: 'line-marked',
    requires: ["Currencies.store.Chart", "Ext.chart.plugin.ItemEvents", "Ext.chart.CartesianChart", "Ext.chart.interactions.PanZoom",
        "Currencies.view.charts.theme.DemoTheme", "Currencies.view.charts.axis.FixedNumericAxis"],
    layout: "fit",
    items: [{
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        itemId: 'dynamic',
        tbar: ['->', {
            xtype: 'segmentedbutton',
            width: 170,
            defaults: {
                ui: 'default-toolbar'
            },
            items: [{
                text: 'Pan',
                pressed: true
            }, {
                text: 'Zoom'
            }],
            listeners: {
                toggle: 'onModeToggle'
            }
        }, {
            text: 'Reset pan/zoom',
            handler: 'onPanZoomReset'

        }],
        defaults: {
            xtype: 'cartesian',
            flex: 1,
            theme: 'demo-theme',
            width: '100%',
            legend: {
                docked: 'bottom',
                border: false
            },
            plugins: {
                ptype: 'chartitemevents',
                moveEvents: true
            },
            interactions: [{
                type: 'panzoom',
                zoomOnPanGesture: false,
                axes: {
                    left: {
                        allowPan: true,
                        allowZoom: true,
                        minZoom: 0.10
                    },
                    bottom: {
                        allowPan: true,
                        allowZoom: true,
                        minZoom: 0.10
                    }
                }
            }],
            axes: [{
                type: 'fixednumeric',
                fixedAxisWidth: 40,
                grid: true,
                position: 'left',
                label: {
                    fontSize: 10,
                    textAlign: 'right'
                }
            }, {
                type: 'time',
                dateFormat: 'd M Y',
                label: {
                    fontSize: 10
                },
                grid: true,
                position: 'bottom',
                fields: ['date']
            }],
            listeners: {
                afterrender: 'onTimeChartRendered',
                destroy: 'onTimeChartDestroy'
            }
        },
        items: [{
            store: Ext.create('Ext.data.Store')
        }],
        listeners: {
            dropRecord: 'onDropRecord'
        }
    }]
});
