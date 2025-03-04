// netlify/functions/ai.js

// Note : Avec Netlify en Node 18, on peut utiliser fetch directement.
// Sinon, installer "node-fetch" si besoin. (Netlify l'intègre déjà)
exports.handler = async (event) => {
  // 1. Vérifier la méthode
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    // 2. Récupérer les données du formulaire (JSON)
    const data = JSON.parse(event.body || '{}');

    // 3. Construire un prompt (texte) en fonction des données reçues
    //    Ici, j'utilise un prompt simple.
    //    Tu peux l'enrichir à ta guise pour avoir un conseil plus précis.
    const prompt = `
      Tu es un coach virtuel de Ma P’tite Salle.
      Voici les âges biologiques saisis par l'utilisateur :

      Force (Haut: ${data.forceHaut}, Milieu: ${data.forceMilieu}, Bas: ${data.forceBas})
      Flexibilité (Cou: ${data.flexCou}, Épaules: ${data.flexEpaules}, Lombaires: ${data.flexLombaires}, Ischios: ${data.flexIschios}, Hanches: ${data.flexHanches})
      Métabolique (Poids: ${data.poids} kg, Masse grasse: ${data.masseGrasse} %, Masse muscu: ${data.masseMuscu} %, Âge métabolique: ${data.ageMetabo})
      Cardio (VO2max: ${data.vo2max}, Âge cardio: ${data.ageCardio})

      Donne un conseil global, bienveillant et synthétique pour aider l'utilisateur à s'améliorer.
      Sois chaleureux, et rappelle l'esprit convivial de Ma P’tite Salle.
    `;

    // 4. Récupérer la clé OpenAI dans les variables d'environnement
    //    (Tu auras mis OPENAI_API_KEY dans Netlify → Site settings → Environment variables)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Clé OpenAI manquante. Configure OPENAI_API_KEY.' })
      };
    }

    // 5. Appeler l’API OpenAI (modèle chat)
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ou "gpt-4" si tu y as accès
        messages: [
          { role: 'system', content: 'Tu es un coach sportif compétent et bienveillant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,       // limite la taille de la réponse
        temperature: 0.7       // un peu de créativité
      })
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `OpenAI Error: ${errorText}` })
      };
    }

    const result = await openaiRes.json();
    const reply = result.choices[0].message.content;

    // 6. Retourner la réponse
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
