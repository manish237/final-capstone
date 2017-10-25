angular.module('filterLibrary', [])

.filter('propsFilter', function() {
    return function(items, props) {
        /*        console.log(items)
                console.log(props)*/
        var out = [];

        if (angular.isArray(items)) {
            // console.log("here 01")
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;
                /*console.log("outer--")
                console.log(item)
                console.log(keys)*/
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    /*                    console.log(text)
                                        console.log(item[prop])
                                        console.log(item[prop].toString().toLowerCase().indexOf(text))*/
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        // console.log(out)

        return out;
    };
})
