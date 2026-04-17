import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const iframeRef = useRef(null);

  const statuses = [
    "🎨 Design soch raha hai...",
    "✍️ HTML likh raha hai...",
    "💅 CSS bana raha hai...",
    "📱 Mobile responsive kar raha hai...",
    "✨ Final polish ho raha hai...",
  ];

  useEffect(() => {
    if (screen !== "loading") return;
    let i = 0;
    setStatus(statuses[0]);
    const t = setInterval(() => { i=(i+1)%statuses.length; setStatus(statuses[i]); }, 2000);
    return () => clearInterval(t);
  }, [screen]);

  async function generate() {
    if (!prompt.trim()) { alert("Kuch likho pehle!"); return; }
    setScreen("loading");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setHtml(data.html);
      setScreen("result");
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = data.html;
        }
      }, 300);
    } catch(e) {
      setError(e.message);
      setScreen("error");
    }
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], {type:"text/html"}));
    a.download = "website.html";
    a.click();
  }

  return (
    <div style={{minHeight:"100vh",background:"#08080f",color:"#f0f0f5",fontFamily:"sans-serif",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>

      {screen === "home" && (
        <div style={{width:"100%",maxWidth:600,textAlign:"center"}}>
          <h1 style={{fontSize:36,fontWeight:800,marginBottom:8}}>
            ⚡ AI Website Builder
          </h1>
          <p style={{color:"#555",marginBottom:32}}>Prompt likho — website tayar!</p>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Jaise: Dark theme restaurant website with menu and contact form..."
            rows={4}
            style={{width:"100%",background:"#111",border:"2px solid #333",borderRadius:12,color:"#fff",fontSize:15,padding:16,resize:"none",outline:"none",marginBottom:16}}
          />
          <button
            onClick={generate}
            style={{width:"100%",padding:16,background:"linear-gradient(135deg,#7c3aed,#2563eb)",border:"none",borderRadius:12,color:"#fff",fontSize:18,fontWeight:700,cursor:"pointer"}}
          >
            ⚡ Website Banao
          </button>
          <div style={{marginTop:24,display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {["Restaurant website","Photography portfolio","Tech startup","Fitness trainer","Online store"].map(ex => (
              <button key={ex} onClick={() => setPrompt(ex)}
                style={{padding:"8px 16px",background:"#111",border:"1px solid #333",borderRadius:20,color:"#888",fontSize:13,cursor:"pointer"}}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === "loading" && (
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:60,marginBottom:20}}>⏳</div>
          <h2 style={{marginBottom:12}}>Website ban rahi hai...</h2>
          <p style={{color:"#555",fontFamily:"monospace"}}>{status}</p>
        </div>
      )}

      {screen === "error" && (
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:52,marginBottom:16}}>⚠️</div>
          <h2 style={{marginBottom:12}}>Error aa gayi</h2>
          <p style={{color:"#f87171",marginBottom:24,fontFamily:"monospace",fontSize:13}}>{error}</p>
          <button onClick={() => setScreen("home")}
            style={{padding:"12px 28px",background:"#7c3aed",border:"none",borderRadius:10,color:"#fff",fontWeight:700,cursor:"pointer"}}>
            ← Wapas Jao
          </button>
        </div>
      )}

      {screen === "result" && (
        <div style={{width:"100%",maxWidth:1000}}>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <button onClick={download}
              style={{padding:"10px 20px",background:"#059669",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"}}>
              ⬇ Download HTML
            </button>
            <button onClick={() => {setScreen("home");setPrompt("");setHtml("");}}
              style={{padding:"10px 20px",background:"#7c3aed",border:"none",borderRadius:8,color:"#fff",fontWeight:700,cursor:"pointer"}}>
              + Nai Website
            </button>
          </div>
          <iframe ref={iframeRef} style={{width:"100%",height:600,border:"2px solid #222",borderRadius:12,background:"#fff"}} />
        </div>
      )}
    </div>
  );
}
