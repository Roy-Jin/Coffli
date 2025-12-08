var defaultHeaders = {
    "Content-Type": "application/json",
};
var CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
};

interface Options {
    [key: string]: any;
}

const mergeOptions = (
    defaultOptions: Options,
    customOptions: Options,
): Options => {
    const merged = { ...defaultOptions };

    for (const key in customOptions) {
        if (customOptions.hasOwnProperty(key)) {
            if (
                typeof customOptions[key] === "object" &&
                customOptions[key] !== null &&
                !Array.isArray(customOptions[key]) &&
                Object.prototype.toString.call(customOptions[key]) ===
                    "[object Object]"
            ) {
                merged[key] = mergeOptions(
                    merged[key] || {},
                    customOptions[key],
                );
            } else {
                merged[key] = customOptions[key];
            }
        }
    }

    return merged;
};

var Response_default = (body: BodyInit | object, options: Options) => {
    if (typeof body === "object") {
        body = JSON.stringify(body);
    }
    const mergedOptions = mergeOptions({
        status: 200,
        headers: {
            ...defaultHeaders,
            ...CORS_HEADERS,
        },
    }, options);

    return new Response(body, mergedOptions);
};

export default Response_default;
