// netlify/functions/ai.js

exports.handler = async (event) => {
  // 1. Vérifier la méthode (optionnel, mais préférable)
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  // 2. Récupérer les données JSON envoyées par le formulaire
  const data = JSON.parse(event.body || '{}');

  // 3. Retourner un message basique
  return {
    statusCode: 200,
    body: JSON.stringify({
      reply: `Données reçues: ${JSON.stringify(data)}`
    })
  };
};
