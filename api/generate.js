import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
    }

    // La clave es cargada por Vercel desde las Environment Variables
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        // Esto verifica si Vercel cargó la clave
        console.error("Error del Servidor: GEMINI_API_KEY no está configurada.");
        return res.status(500).json({ 
            error: 'GEMINI_API_KEY is not defined', 
            details: 'La clave API no está configurada correctamente en el entorno del servidor.'
        });
    }

    try {
        const { contents } = req.body;

        if (!contents) {
            return res.status(400).json({ error: 'Faltan datos de contenido (prompt y partes de imagen).' });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Gemini:', errorData);
            return res.status(response.status).json({ 
                error: 'Error de la API de Gemini al generar contenido', 
                details: errorData.error.message 
            });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en la función serverless /api/generate:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.', details: error.message });
    }
}
