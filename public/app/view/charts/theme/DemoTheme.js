Ext.define('Currencies.view.charts.theme.DemoTheme', {
    extend: 'Ext.chart.theme.Base',
    singleton: true,
    alias: ['chart.theme.demo-theme'],

    config: {
        axis: {
            defaults: {
                style: {
                    strokeStyle: '#7F8C8D'
                },
                label: {
                    fillStyle: '#7F8C8D',
                    fontSize: 18
                }
            }
        },
        colors: ['#4dc3ff', '#f2abb3', '#3498DB', '#C0392B', '#9B59B6'],
        seriesThemes: [{
            opacity: 0.5
        }]
    }

});