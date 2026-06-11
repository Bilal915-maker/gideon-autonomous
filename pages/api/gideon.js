export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { message } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY?.trim(),
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Tu es GIDEON Autonomous, le co-PDG opérationnel de Bilal. Tu gères son empire de SaaS de façon autonome.

Tu as accès à :
- GitHub (repo: Bilal915-maker/payflow-ai et Bilal915-maker/gideon-autonomous)
- Vercel (déploiement automatique)
- Make webhook: https://hook.eu1.make.com/wa8mtmbw2pssgqg7ay8fu2gm07seufvx
- Supabase: https://hjmslfzlobputvkwrajv.supabase.co

PayFlow AI est la priorité absolue (Solo 49€/Pro 129€/Business 299€/mois, PME France).
Tu es direct, autonome, tu proposes des actions concrètes et tu les exécutes.`,
        messages: [{ role: 'user', content: message }]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic error:', error);
      return res.status(500).json({ reply: 'Erreur API Anthropic: ' + error });
    }
    
    const data = await response.json();
    res.json({ reply: data.content[0].text });
  } catch(e) {
    console.error('Error:', e);
    res.status(500).json({ reply: 'Erreur: ' + e.message });
  }
}
