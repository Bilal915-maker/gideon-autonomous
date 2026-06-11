export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { message } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `Tu es GIDEON Autonomous, le co-PDG opérationnel de Bilal. Tu as accès aux outils suivants via des APIs :
- GitHub API (token: ${process.env.GITHUB_TOKEN}) : créer des repos, pusher du code
- Vercel API (token: ${process.env.VERCEL_TOKEN}) : déployer des projets
- Make Webhook : ${process.env.MAKE_WEBHOOK_URL} : créer des scénarios d'automatisation
- Supabase : ${process.env.SUPABASE_URL} : stocker des données

Quand Bilal te donne un ordre, tu l'exécutes immédiatement. Tu décris ce que tu fais étape par étape. Tu es autonome, direct, et tu rapportes les résultats.

PayFlow AI est la priorité absolue. Stack : GitHub repo Bilal915-maker/payflow-ai, déployé sur Vercel.`,
      messages: [{ role: 'user', content: message }]
    })
  });
  
  const data = await response.json();
  res.json({ reply: data.content[0].text });
}
