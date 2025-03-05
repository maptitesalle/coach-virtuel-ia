// netlify/functions/saveData.js
const admin = require("firebase-admin");

let app; // On évite de réinitialiser si la function est appelée plusieurs fois

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Vérifier l'authentification Netlify Identity
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Non autorisé (pas d’utilisateur)' })
    };
  }

  try {
    // Récupérer la data envoyée par le front
    const data = JSON.parse(event.body || '{}');

    // Initialiser firebase-admin (une seule fois)
    if (!app) {
      // Récupérer la variable d'env
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();

    // Ecrire le document
    const docRef = await db.collection('userData').add({
      ...data,
      userId: user.sub,  // on stocke l'ID netlify Identity
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: 'Data saved successfully',
        docId: docRef.id
      })
    };

  } catch (err) {
    console.error('saveData error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
