import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{role:'assistant', content:'GIDEON Autonomous actif. Donne-moi un ordre.'}]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages(p => [...p, {role:'user', content:msg}]);
    setLoading(true);
    try {
      const r = await fetch('/api/gideon', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message: msg})});
      const d = await r.json();
      setMessages(p => [...p, {role:'assistant', content:d.reply}]);
    } catch(e) {
      setMessages(p => [...p, {role:'assistant', content:'Erreur connexion.'}]);
    }
    setLoading(false);
  }

  return (
    <div style={{background:'#0a0a0f',minHeight:'100vh',color:'#e8e6df',fontFamily:'Inter,sans-serif',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'16px 24px',borderBottom:'1px solid #1e1e2e',display:'flex',alignItems:'center',gap:'12px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>⚡</div>
        <div>
          <div style={{fontWeight:600}}>GIDEON Autonomous</div>
          <div style={{fontSize:'12px',color:'#00d68f'}}>● Actif H24</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'20px',display:'flex',flexDirection:'column',gap:'16px'}}>
        {messages.map((m,i) => (
          <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={{maxWidth:'80%',padding:'12px 16px',borderRadius:m.role==='user'?'16px 16px 4px 16px':'4px 16px 16px 16px',background:m.role==='user'?'#6c5ce7':'#13131f',border:m.role==='assistant'?'1px solid #1e1e2e':'none',whiteSpace:'pre-wrap',lineHeight:1.6}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{padding:'12px 16px',background:'#13131f',border:'1px solid #1e1e2e',borderRadius:'4px 16px 16px 16px',width:'60px'}}>...</div>}
      </div>
      <div style={{padding:'16px',borderTop:'1px solid #1a1a2a',display:'flex',gap:'10px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Donne un ordre à GIDEON..." style={{flex:1,padding:'12px 16px',borderRadius:'12px',border:'1px solid #2a2a3e',background:'#13131f',color:'#e8e6df',fontSize:'14px',outline:'none'}}/>
        <button onClick={send} style={{padding:'12px 20px',borderRadius:'12px',border:'none',background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',color:'#fff',fontSize:'14px',cursor:'pointer',fontWeight:600}}>↑</button>
      </div>
    </div>
  );
}
