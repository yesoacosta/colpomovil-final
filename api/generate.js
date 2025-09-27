// generate.js
import fetch from 'node-fetch'; // Aseguramos la importación

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    try {
        const requestBody = req.body;
        const apiKey = process.env.GEMINI_API_KEY; 

        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor.' });
        }

        const model = "gemini-2.5-flash-preview-05-20"; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody), 
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
};
