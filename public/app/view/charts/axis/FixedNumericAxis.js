Ext.define('Currencies.view.charts.axis.FixedNumericAxis', {
    extend: 'Ext.chart.axis.Numeric',
    alias: 'axis.fixednumeric',
    config: {
        fixedAxisWidth: undefined
    },
    getThickness: function () {
        var customWidth = this.getFixedAxisWidth();
        if( customWidth ) {
            return customWidth;
        }
        else {
            return this.callParent();
        }
    }
});