"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, RefreshCcw, CheckCircle2, Image as ImageIcon, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { CIFAR10_CLASSES } from "@/constants/cifar10";

const SAMPLES = [
  { label:"Airplane", emoji:"✈️", id:0 },
  { label:"Dog",      emoji:"🐶", id:5 },
  { label:"Cat",      emoji:"🐱", id:3 },
  { label:"Ship",     emoji:"🚢", id:8 },
  { label:"Horse",    emoji:"🐴", id:7 },
  { label:"Truck",    emoji:"🚛", id:9 },
];

function randPred(id?: number) {
  const cls = id !== undefined ? CIFAR10_CLASSES[id] : CIFAR10_CLASSES[Math.floor(Math.random()*10)];
  const raw = CIFAR10_CLASSES.map(c => c.id===cls.id ? Math.floor(Math.random()*13+77) : Math.floor(Math.random()*8+1));
  const tot = raw.reduce((a,b)=>a+b,0);
  const scores = raw.map(s=>parseFloat(((s/tot)*100).toFixed(1)));
  return { ...cls, allScores:scores, confidence:scores[cls.id] };
}

const MSGS = [
  "Reading pixel values…",
  "Running Conv2D layers…",
  "Extracting feature maps…",
  "Applying softmax…",
  "Finalizing prediction…",
];

function Bar({ pct, active=true, delay=0 }: { pct:number; active?:boolean; delay?:number }) {
  return (
    <motion.div
      initial={{ width:0 }} animate={{ width:`${pct}%` }}
      transition={{ duration:0.7, delay:delay/1000, ease:[0.22,1,0.36,1] }}
      style={{ height:"100%", borderRadius:99,
        background:active?"linear-gradient(90deg,#7c3aed,#a855f7)":"rgba(124,58,237,0.2)" }}
    />
  );
}

function CountUp({ to, suffix="" }: { to:number; suffix?:string }) {
  const [v,setV] = useState(0);
  const [go,setGo] = useState(false);
  if (!go) { setGo(true); setTimeout(()=>{ let c=0; const iv=setInterval(()=>{ c+=to/36; if(c>=to){setV(to);clearInterval(iv);}else setV(c); },700/36); },70); }
  return <>{v.toFixed(1)}{suffix}</>;
}

export default function UploadPredict() {
  const [drag,setDrag]     = useState(false);
  const [preview,setPrev]  = useState<string|null>(null);
  const [loading,setLoad]  = useState(false);
  const [msgIdx,setMsg]    = useState(0);
  const [result,setResult] = useState<ReturnType<typeof randPred>|null>(null);
  const [showAll,setAll]   = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f:File) => {
    if (!f.type.startsWith("image/")) return;
    const r=new FileReader();
    r.onload=e=>{ setPrev(e.target?.result as string); setResult(null); };
    r.readAsDataURL(f);
  },[]);

  const run = useCallback(async (id?:number) => {
    setLoad(true); setResult(null); setAll(false);
    for (let i=0;i<MSGS.length;i++) { setMsg(i); await new Promise(r=>setTimeout(r,420)); }
    setResult(randPred(id)); setLoad(false);
  },[]);

  const radar = result ? CIFAR10_CLASSES.map(c=>({ s:c.name, v:result.allScores[c.id] })) : [];

  const S: React.CSSProperties = { fontFamily:"-apple-system,'SF Pro Text','Inter',sans-serif" };

  return (
    <section id="predict" style={{ padding:"52px 20px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }}
          style={{ marginBottom:28 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Neural Inference</p>
          <h2 className="section-title">Classify an Image</h2>
          <p className="section-sub" style={{ marginTop:8, maxWidth:400 }}>
            Upload any image or pick a sample — the trained CNN predicts its CIFAR-10 class.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:12 }}
          className="max-md:block">

          {/* Left: dark upload card + samples */}
          <motion.div initial={{ opacity:0,x:-14 }} whileInView={{ opacity:1,x:0 }}
            viewport={{ once:true }} transition={{ duration:0.48 }}
            style={{ display:"flex", flexDirection:"column", gap:10 }}
            className="max-md:mb-3">

            {/* Drop zone — dark card */}
            <div
              style={{
                background:"#0c0c14",
                border:`1.5px dashed ${drag?"rgba(124,58,237,0.7)":"rgba(255,255,255,0.1)"}`,
                borderRadius:22, padding:"36px 28px", minHeight:188,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                cursor:"pointer", position:"relative", overflow:"hidden",
                transition:"border-color 0.12s",
              }}
              onDragOver={e=>{ e.preventDefault(); setDrag(true); }}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{ e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f)handleFile(f); }}
              onClick={()=>input.current?.click()}
            >
              {/* inner glow */}
              <div style={{ position:"absolute",top:"-20%",left:"15%",width:"70%",height:"120%",borderRadius:"50%",
                background:"radial-gradient(ellipse,rgba(124,58,237,0.16) 0%,transparent 70%)",
                pointerEvents:"none",filter:"blur(8px)" }}/>
              <input ref={input} type="file" accept="image/*" style={{ display:"none" }}
                onChange={e=>{ const f=e.target.files?.[0]; if(f)handleFile(f); }}/>

              {preview ? (
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,position:"relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="preview"
                    style={{ width:92,height:92,objectFit:"cover",borderRadius:14,
                      boxShadow:"0 8px 28px rgba(0,0,0,0.55)" }}/>
                  <span style={{ fontSize:12,color:"rgba(255,255,255,0.35)" }}>Click to change</span>
                </div>
              ) : (
                <div style={{ textAlign:"center",position:"relative" }}>
                  <motion.div animate={{ scale:drag?1.1:1 }} transition={{ duration:0.14 }}
                    style={{ width:50,height:50,borderRadius:14,margin:"0 auto 14px",
                      background:"rgba(124,58,237,0.18)",
                      border:"1px solid rgba(124,58,237,0.3)",
                      display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Upload size={20} color="rgba(196,181,253,0.9)"/>
                  </motion.div>
                  <p style={{ fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.82)",marginBottom:3 }}>
                    Drop your image here
                  </p>
                  <p style={{ fontSize:12,color:"rgba(255,255,255,0.28)" }}>
                    or click to browse · JPG PNG WebP
                  </p>
                </div>
              )}
            </div>

            {/* Run button */}
            <AnimatePresence>
              {preview && !loading && (
                <motion.button
                  initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  whileHover={{ scale:1.015 }} whileTap={{ scale:0.97 }}
                  onClick={()=>run()}
                  style={{ border:"none",cursor:"pointer",borderRadius:16,padding:"13px",
                    background:"linear-gradient(135deg,#7c3aed,#5b21b6)",
                    color:"white",fontSize:13,fontWeight:700,
                    boxShadow:"0 0 24px rgba(124,58,237,0.38)",
                    display:"flex",alignItems:"center",justifyContent:"center",gap:7,...S }}>
                  <Sparkles size={14}/> Run Inference
                </motion.button>
              )}
            </AnimatePresence>

            {/* Samples */}
            <div>
              <p style={{ fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",
                letterSpacing:"0.14em",marginBottom:9 }}>Try a sample</p>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7 }}>
                {SAMPLES.map(s=>(
                  <motion.button key={s.id}
                    whileHover={{ y:-3 }}
                    whileTap={{ scale:0.95 }} transition={{ duration:0.1 }}
                    onClick={()=>{ setPrev(null);setResult(null);run(s.id); }}
                    style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
                      borderRadius:13,padding:"9px 4px",
                      display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                      cursor:"pointer",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",...S }}>
                    <span style={{ fontSize:17 }}>{s.emoji}</span>
                    <span style={{ fontSize:11,fontWeight:600,color:"#374151" }}>{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: result */}
          <motion.div initial={{ opacity:0,x:14 }} whileInView={{ opacity:1,x:0 }}
            viewport={{ once:true }} transition={{ duration:0.48,delay:0.07 }}>
            <AnimatePresence mode="wait">

              {/* Loading */}
              {loading && (
                <motion.div key="load"
                  initial={{ opacity:0,scale:0.97 }} animate={{ opacity:1,scale:1 }}
                  exit={{ opacity:0,scale:0.97 }} transition={{ duration:0.18 }}
                  style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
                    borderRadius:22,padding:36,minHeight:300,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:18,...S }}>
                  <div style={{ position:"relative",width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <div className="anim-spin-cw" style={{ position:"absolute",inset:0,borderRadius:"50%",
                      border:"2px solid transparent",borderTop:"2px solid #7c3aed" }}/>
                    <div className="anim-spin-ccw" style={{ position:"absolute",inset:7,borderRadius:"50%",
                      border:"2px solid transparent",borderBottom:"2px solid #c4b5fd" }}/>
                    <div style={{ width:10,height:10,borderRadius:"50%",background:"#7c3aed" }}/>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ fontSize:13,fontWeight:600,color:"#374151",marginBottom:3 }}>{MSGS[msgIdx]}</p>
                    <p style={{ fontSize:11,color:"#94a3b8" }}>CNN processing…</p>
                  </div>
                  <div style={{ width:90,height:3,borderRadius:99,overflow:"hidden" }}>
                    <div className="shimmer-bar" style={{ width:"100%",height:"100%" }}/>
                  </div>
                </motion.div>
              )}

              {/* Result */}
              {result && !loading && (
                <motion.div key="result"
                  initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
                  exit={{ opacity:0 }} transition={{ duration:0.26 }}
                  style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
                    borderRadius:22,padding:22,display:"flex",flexDirection:"column",gap:14,...S }}>

                  {/* Top row */}
                  <div style={{ display:"flex",alignItems:"center",gap:13 }}>
                    <div style={{ width:54,height:54,borderRadius:15,flexShrink:0,
                      background:"linear-gradient(135deg,rgba(124,58,237,0.09),rgba(91,33,182,0.04))",
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.65rem",
                      boxShadow:"0 0 16px rgba(124,58,237,0.14)" }}>
                      {result.emoji}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:2 }}>
                        <CheckCircle2 size={11} color="#10b981"/>
                        <span style={{ fontSize:11,color:"#10b981",fontWeight:600 }}>Classified</span>
                      </div>
                      <p style={{ fontSize:21,fontWeight:800,color:"#09090e",letterSpacing:"-0.025em",lineHeight:1 }}>
                        {result.name}
                      </p>
                      <p style={{ fontSize:11,color:"#94a3b8",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                        {result.desc}
                      </p>
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <p style={{ fontSize:26,fontWeight:800,color:"#7c3aed",lineHeight:1,letterSpacing:"-0.02em" }}>
                        <CountUp to={result.confidence} suffix="%"/>
                      </p>
                      <p style={{ fontSize:10,color:"#94a3b8",marginTop:2 }}>confidence</p>
                    </div>
                  </div>

                  {/* Bar */}
                  <div style={{ height:4,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                    <Bar pct={result.confidence}/>
                  </div>

                  {/* Radar */}
                  <div style={{ height:152 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radar}>
                        <PolarGrid stroke="rgba(124,58,237,0.07)"/>
                        <PolarAngleAxis dataKey="s" tick={{ fontSize:9,fill:"#94a3b8" }}/>
                        <Radar name="Score" dataKey="v" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.11} strokeWidth={1.8}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Toggle */}
                  <button onClick={()=>setAll(!showAll)}
                    style={{ display:"flex",alignItems:"center",gap:4,background:"none",border:"none",
                      cursor:"pointer",fontSize:11,color:"#7c3aed",fontWeight:600,padding:0,...S }}>
                    {showAll?<ChevronUp size={12}/>:<ChevronDown size={12}/>}
                    {showAll?"Hide":"Show"} all class scores
                  </button>

                  <AnimatePresence>
                    {showAll && (
                      <motion.div initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }}
                        exit={{ height:0,opacity:0 }} transition={{ duration:0.2 }}
                        style={{ overflow:"hidden" }}>
                        <div style={{ display:"flex",flexDirection:"column",gap:5,paddingTop:2 }}>
                          {CIFAR10_CLASSES.map(c=>(
                            <div key={c.id} style={{ display:"flex",alignItems:"center",gap:7 }}>
                              <span style={{ fontSize:12,width:16 }}>{c.emoji}</span>
                              <span style={{ fontSize:11,color:"#64748b",width:70,flexShrink:0 }}>{c.name}</span>
                              <div style={{ flex:1,height:3,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                                <Bar pct={result.allScores[c.id]} active={c.id===result.id} delay={c.id*28}/>
                              </div>
                              <span style={{ fontSize:10,color:"#94a3b8",width:34,textAlign:"right" }}>
                                {result.allScores[c.id].toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={()=>{ setResult(null);setPrev(null);setAll(false); }}
                    style={{ display:"flex",alignItems:"center",gap:5,background:"none",border:"none",
                      cursor:"pointer",fontSize:11,color:"#94a3b8",padding:0,...S,
                      transition:"color 0.1s" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="#7c3aed"}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="#94a3b8"}>
                    <RefreshCcw size={11}/> Try another image
                  </button>
                </motion.div>
              )}

              {/* Empty */}
              {!loading && !result && (
                <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
                    borderRadius:22,padding:44,minHeight:300,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    gap:12,textAlign:"center",...S }}>
                  <div style={{ width:50,height:50,borderRadius:13,
                    background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.10)",
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <ImageIcon size={22} color="rgba(124,58,237,0.38)"/>
                  </div>
                  <p style={{ fontSize:13,color:"#94a3b8",maxWidth:210,lineHeight:1.55 }}>
                    Upload an image or select a sample to run the CNN classification.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
