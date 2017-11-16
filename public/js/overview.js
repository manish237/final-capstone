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
    console.log(ctrl)
    if(ctrl.oCtrl.data.type === 'register')
    {
        //we just have name ... no score
        $('.gauge').attr('data-value',0)
    }
    else if(ctrl.oCtrl.data.type === 'login' || ctrl.oCtrl.data.type === 'reset'){
        if(ctrl.oCtrl.data.data.additionaldata!==undefined && ctrl.oCtrl.data.data.additionaldata.hygenescore !==undefined)
            $('.gauge').attr('data-value',ctrl.oCtrl.data.data.additionaldata.hygenescore)
        else
            $('.gauge').attr('data-value',0)
    }


    var gg2 = new JustGage({
        id: 'gg2',
        title: 'Your Hygene Score',
        titleFontColor:'#CE6D39',
        titleFontSize: 10,
        defaults: dflt
    });
});
