angular.module('apiLibraryConstants', [])

.constant('API_POST_REGISTER', '/auth/register/')
.constant('API_POST_LOGIN', '/auth/login/')
.constant('API_PUT_RESET_PASSWORD', '/auth/reset/')
.constant('API_GET_UNAME_EXISTS', 'auth/exists/')

.constant('API_POST_COMMON_PROFILE', '/profile/common/')
.constant('API_PUT_COMMON_PROFILE', '/profile/common/')
.constant('API_GET_COMMON_PROFILE', '/profile/common/')
.constant('API_GET_CHAT_HANDLES', '/profile/common/chathandles/chat/')
.constant('API_GET_CHAT_HANDLE_EXISTS', '/profile/common/chathandles/chatexists/')
.constant('API_GET_PROVIDER_LIST', '/profile/common/providers/list/')

.constant('API_POST_CONSUMER_PROFILE', '/profile/consumer/')
.constant('API_PUT_CONSUMER_PROFILE', '/profile/consumer/')
.constant('API_GET_CONSUMER_PROFILE', '/profile/consumer/')

.constant('API_POST_PROVIDER_PROFILE', '/profile/provider/')
.constant('API_PUT_PROVIDER_PROFILE', '/profile/provider/')
.constant('API_GET_PROVIDER_PROFILE', '/profile/provider/')

.constant('API_POST_USER_DIET', '/diet/')
.constant('API_PUT_USER_DIET', '/diet/')
.constant('API_GET_USER_DIET', '/diet/')

.constant('API_POST_MESSAGE', '/message/')
.constant('API_GET_MESSAGE', '/message/')

.constant('API_POST_META_LOC', '/meta/loc/')
.constant('API_GET_META_LOC', '/meta/loc/')

.constant('API_POST_META_LANG', '/meta/lang/')
.constant('API_GET_META_LANG', '/meta/lang/')

.constant('API_GET_EXT_NUTRITIONIX_INSTANT', '/ext/nutritionix/')

/*

/auth
    post('/register'
    post('/login'
    put('/reset/:uname'

/profile/common
    post('/'
    put('/:uname'
    get('/:uname'
    get('/chathandles/chat'
    get('/providers/list'

/profile/consumer
    post('/'
    put('/:uname'
    get('/:uname'
/profile/provider
    post('/'
    put('/:uname'
    get('/:uname'
/message
    post('/'
    get('/:commtype/:uname'
/meta
    post('/loc'
    get('/loc'
    post('/lang'
    get('/lang'
/ext
    get('/nutritionix'

*/
