// Keep track of which names are used so that there are no duplicates
var userNames = (function () {
    var names = {};
    var namesNew={};

    var claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    var getGuestName = function () {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    var updateList = function (item) {
        console.log("updateList")
        namesNew[item]=true;
        // nameArr.push(item);
        console.log(namesNew)
    };

    // serialize claimed names as an array
    var get = function () {
        console.log("get")

        var res = [];
        for (user in namesNew) {
            res.push(user);
        }
        console.log(res)

        return res;
        // return nameArr;
    };

    var free = function (name) {
        console.log("free")

        if (names[name]) {
            delete names[name];
        }
        if (namesNew[name]) {
            delete namesNew[name];
        }
        console.log(namesNew)
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuestName: getGuestName,
        updateList:updateList
    };
}());

// export function for listening to the socket
module.exports = function (socket) {
    console.log("connected..."+socket.handshake.query.name)
    // var name = userNames.getGuestName();


    userNames.updateList(socket.handshake.query.name)

    // console.log(socket)
    // console.log(socket.handshake.query.name);
    // send the new user their name and a list of users
    socket.emit('init', {
        name: socket.handshake.query.name,//name,
        users: userNames.get()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: socket.handshake.query.name//name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: socket.handshake.query.name,//name,
            text: data.message
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('send:typing', function () {
        // console.log("typing..."+socket.handshake.query.name)
        // console.log(socket.adapter.rooms)
        // console.log("Curr ID")
        // console.log(socket.id)
        // console.log("Curr rooms")

        // console.log(Object.keys(socket.adapter.rooms))
        // var keys=Object.keys(socket.adapter.rooms);
        // var arr = keys.filter(key=>key!==socket.id);
        // console.log(arr)


            socket.broadcast.emit('some:typing', {});

    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        console.log("disconnected ----"+socket.handshake.query.name);
        socket.broadcast.emit('user:left', {
            name: socket.handshake.query.name//name
        });
        userNames.free(socket.handshake.query.name);
    });
};
