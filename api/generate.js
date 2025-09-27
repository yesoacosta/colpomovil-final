import fetch from 'node-fetch'; // Asegúrate de que 'node-fetch' está instalado si usas CommonJS

// Función que maneja las solicitudes a la ruta /api/generate
export default async function handler(req, res) {
    // 1. Verificación de Método
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Solo POST.' });
    }

    // 2. Extracción y Verificación de la Clave
    // ESTA LÍNEA ES LA QUE DA EL ERROR SI LA CLAVE NO ESTÁ EN VERCEL
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
        // Devolvemos un error claro al frontend si Vercel no cargó la clave
        console.error("Error del Servidor: GEMINI_API_KEY no está configurada en las Variables de Entorno de Vercel.");
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

        // 3. Llamada segura a la API de Gemini desde el servidor
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
        // 4. Devolvemos la respuesta de Gemini al frontend
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en la función serverless /api/generate:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.', details: error.message });
    }
}
