<script>
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ageForm');
  const submitBtn = document.getElementById('submitBtn');
  const responseDiv = document.getElementById('response');

  submitBtn.addEventListener('click', async () => {
    // 1. Récupérer données
    const formData = new FormData(form);
    const data = {
      forceHaut: formData.get('forceHaut'),
      // etc...
    };

    // 2. Envoi des données à la fonction serverless
    try {
      responseDiv.innerHTML = "Envoi en cours...";
      const res = await fetch('/.netlify/functions/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();

      // 3. Afficher la réponse
      if (json.error) {
        responseDiv.innerHTML = `<p style="color:red;">Erreur: ${json.error}</p>`;
      } else {
        responseDiv.innerHTML = `<h3>Réponse AI :</h3><p>${json.reply}</p>`;
      }
    } catch (err) {
      console.error(err);
      responseDiv.innerHTML = `<p style="color:red;">Une erreur s'est produite.</p>`;
    }
  });
});
</script>
