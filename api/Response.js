var defaultHeaders = {
    "Content-Type": "application/json"
};
var CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
};

const mergeOptions = (defaultOptions, customOptions) => {
    const merged = { ...defaultOptions };
    for (const key in customOptions) {
        if (typeof customOptions[key] === 'object' && customOptions[key] !== null) {
            merged[key] = mergeOptions(merged[key], customOptions[key]);
        } else {
            merged[key] = customOptions[key];
        }
    }
    return merged;
};

var Response_default = (body, options) => {
    let _BODY, _OPTIONS;
    if (typeof body === 'object' && body !== null)
        _BODY = JSON.stringify(body);
    _OPTIONS = mergeOptions({
        status: 200,
        headers: {
            ...defaultHeaders,
            ...CORS_HEADERS
        }
    }, options);
    return new Response(_BODY, _OPTIONS);
};
export default Response_default;