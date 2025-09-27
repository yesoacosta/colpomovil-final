import { MongoClient } from 'mongodb';

// Asegúrate de configurar MONGODB_URI en las variables de entorno de Vercel
const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    try {
        // 1. Conexión a la DB
        await client.connect();
        const database = client.db('ColpoDB'); // Nombre de tu base de datos
        const reports = database.collection('reports'); // Nombre de tu colección

        // 2. Datos del informe (deben venir del frontend)
        const reportData = {
            ...req.body,
            timestamp: new Date(),
            // Aquí puedes añadir el ID de usuario si implementas autenticación (paso 3)
            // userId: req.headers['x-user-id']
        };

        // 3. Inserción en la colección
        const result = await reports.insertOne(reportData);

        res.status(200).json({ 
            message: 'Informe guardado exitosamente', 
            id: result.insertedId 
        });

    } catch (error) {
        console.error('Error al guardar el informe:', error);
        res.status(500).json({ error: 'Fallo interno del servidor al guardar.' });
    } finally {
        // Cierra la conexión
        await client.close();
    }
}
