module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/frontend/pages/api/inference.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Proxy API route for LSTM panic detection
// This proxies requests to the backend to avoid CORS issues
__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>handler
]);
const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb'
        }
    }
};
async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        const response = await fetch('http://localhost:5001/api/inference/lstm-panic-detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: req.body
        });
        if (!response.ok) {
            console.error(`Backend returned ${response.status}`);
            return res.status(response.status).json({
                error: 'Backend inference failed'
            });
        }
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('Inference proxy error:', error.message);
        return res.status(500).json({
            error: 'Inference request failed',
            message: error.message
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7d9a2c67._.js.map