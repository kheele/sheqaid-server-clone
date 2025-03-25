const {OPEN_ROUTER_AI_API} = process.env;

const aiGen = async (message) => {
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPEN_ROUTER_AI_API}`,
            "HTTP-Referer": "sheqintel.com", // Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "SHEQ Aid", // Optional. Site title for rankings on openrouter.ai.
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1:free",
            "plugins": [{ "id": "web" }],
            "include_reasoning": true,
            // "stop": "</think>",
            // "stream": true,
            // "response_format": {
            //     type: 'json_schema',
            //     json_schema: {
            //         name: 'weather',
            //         strict: true,
            //         schema: {
            //             type: 'object',
            //             properties: {
            //                 location: {
            //                     type: 'string',
            //                     description: 'City or location name',
            //                 },
            //                 temperature: {
            //                     type: 'number',
            //                     description: 'Temperature in Celsius',
            //                 },
            //                 conditions: {
            //                     type: 'string',
            //                     description: 'Weather conditions description',
            //                 },
            //             },
            //             required: ['location', 'temperature', 'conditions'],
            //             additionalProperties: false,
            //         },
            //     },
            // },
            "messages": [
                {
                    "role": "user",//role: 'user' | 'assistant' | 'system';
                    "content": message,
                }
            ]
        })
    });
};

// exports.aiGenAsText = async (message) => {
//     return aiGen(message).then(res => res.text());
// };

exports.aiGenAsJson = aiGenAsJson = async (message) => {
    return aiGen(message).then(res => res.json()).then(res => res);
    // return aiGen(message).then(res => res.json()).then(res => res.choices[0].message.content);
    // return aiGen(message).then(res => res.json()).then(res => res.choices[0].message.reasoning);
};

// aiGenAsJson("Search HSE consultants in Pretoria South Africa on maps.google.com and their contacts in table format").then(res => {
//     console.log("---", res);
// });