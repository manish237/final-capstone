var dflt = {
    min: 0,
    max: 5,
    donut: true,
    gaugeWidthScale: 1,
    counter: true,
    hideInnerShadow: true,
    decimals: 1,
    customSectors: [{
        color : "#ff0000",
        lo : 0,
        hi : 2.9
    },{
        color : "#f39c12",
        lo : 2.9,
        hi : 3.9
    },{
        color : "#00ff00",
        lo : 3.9,
        hi : 5
    }],
    relativeGaugeSize: true
}




$(document).ready(function() {

    console.log("inside overview jquery")
    angular.element($('.section-tabs')).scope()
    console.log(angular.element($('.section-tabs')).scope())
    let ctrl = angular.element($('.section-tabs')).scope();
    console.log(ctrl.oCtrl.data.data[2][0].hygenescore)
    $('.gauge').attr('data-value',ctrl.oCtrl.data.data[2][0].hygenescore);
    var gg2 = new JustGage({
        id: 'gg2',
        title: 'Hygene Score',
        defaults: dflt
    });
});
