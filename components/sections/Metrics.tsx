"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { mockMetrics, trainingHistory } from "@/mock-data";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const CARDS = [
  { key:"testAccuracy",   label:"Test Accuracy",   suffix:"%",   accent:"#7c3aed", dark:true  },
  { key:"precision",      label:"Precision",        suffix:"%",   accent:"#a855f7", dark:false },
  { key:"recall",         label:"Recall",           suffix:"%",   accent:"#7c3aed", dark:false },
  { key:"f1Score",        label:"F1 Score",         suffix:"%",   accent:"#a855f7", dark:false },
  { key:"inferenceSpeed", label:"Inference Time",   suffix:" ms", accent:"#7c3aed", dark:false },
  { key:"totalParams",    label:"Parameters",       suffix:"",    accent:"#a855f7", dark:false, str:true },
];

function Num({ to, suffix }: { to:number; suffix:string }) {
  const [v,setV]=useState(0);
  const ref=useRef<HTMLSpanElement>(null);
  const inView=useInView(ref,{once:true});
  useEffect(()=>{
    if(!inView) return;
    let c=0; const inc=to/48;
    const iv=setInterval(()=>{ c+=inc; if(c>=to){setV(to);clearInterval(iv);}else setV(c); },980/48);
    return ()=>clearInterval(iv);
  },[inView,to]);
  return <span ref={ref}>{Number.isInteger(to)?Math.round(v).toString():v.toFixed(1)}{suffix}</span>;
}

const chartData=trainingHistory.accuracy.map((a,i)=>({
  e:i+1,
  train:(a*100).toFixed(1),
  val:(trainingHistory.valAccuracy[i]*100).toFixed(1),
}));

export default function Metrics() {
  return (
    <section id="metrics" style={{ padding:"52px 20px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        <motion.div initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Model Evaluation</p>
          <h2 className="section-title">Performance Metrics</h2>
          <p className="section-sub" style={{ marginTop:8,maxWidth:380 }}>
            Trained 20 epochs on 50,000 images · evaluated on 10,000 held-out samples.
          </p>
        </motion.div>

        {/* 3-col bento */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:10, marginBottom:10 }}
          className="max-sm:grid-cols-2">
          {CARDS.map(({ key,label,suffix,accent,dark,str },i)=>{
            const raw=mockMetrics[key as keyof typeof mockMetrics];
            return (
              <motion.div key={key}
                initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }}
                viewport={{ once:true }} transition={{ duration:0.4,delay:i*0.06 }}
                whileHover={{ y:-3,transition:{ duration:0.1 } }}
                style={{
                  background:dark?"#0c0c14":"#ffffff",
                  border:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",
                  borderRadius:20,padding:"20px 20px 18px",
                  position:"relative",overflow:"hidden",cursor:"default",
                  boxShadow:dark?"0 8px 24px rgba(0,0,0,0.22)":"0 2px 8px rgba(0,0,0,0.04)",
                }}>
                {dark&&<div style={{ position:"absolute",top:"-35%",left:"-5%",width:"110%",height:"170%",
                  background:"radial-gradient(ellipse,rgba(124,58,237,0.22) 0%,transparent 70%)",
                  pointerEvents:"none",borderRadius:"50%",filter:"blur(4px)" }}/>}

                <p style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",
                  color:dark?"rgba(255,255,255,0.32)":"#94a3b8",marginBottom:9,position:"relative" }}>
                  {label}
                </p>
                <p style={{ fontSize:"clamp(1.45rem,2.2vw,1.9rem)",fontWeight:800,
                  color:dark?"#ffffff":"#09090e",
                  letterSpacing:"-0.03em",lineHeight:1,position:"relative" }}>
                  {str?String(raw):<Num to={Number(raw)} suffix={suffix}/>}
                </p>
                <div style={{ marginTop:11,height:3,
                  background:dark?"rgba(255,255,255,0.06)":"#f1f5f9",
                  borderRadius:99,overflow:"hidden",position:"relative" }}>
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:`${str?78:Math.min(Number(raw),100)}%` }}
                    viewport={{ once:true }}
                    transition={{ duration:0.9,delay:i*0.07,ease:[0.22,1,0.36,1] }}
                    style={{ height:"100%",borderRadius:99,
                      background:`linear-gradient(90deg,${accent},${accent}80)` }}/>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Training curve */}
        <motion.div initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5,delay:0.16 }}
          style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
            borderRadius:20,padding:"20px 22px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:8 }}>
            <div>
              <p style={{ fontSize:14,fontWeight:700,color:"#09090e" }}>Training History</p>
              <p style={{ fontSize:11,color:"#94a3b8",marginTop:2 }}>
                Accuracy over 20 epochs · Adam · lr=0.001 · batch=64
              </p>
            </div>
            <div style={{ display:"flex",gap:14 }}>
              {[["#7c3aed","Train"],["#c4b5fd","Validation"]].map(([c,l])=>(
                <span key={l} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b" }}>
                  <span style={{ width:18,height:2,borderRadius:1,background:c,display:"inline-block" }}/>{l}
                </span>
              ))}
            </div>
          </div>
          <div style={{ height:168 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(0,0,0,0.04)" strokeDasharray="3 3"/>
                <XAxis dataKey="e" tick={{ fontSize:10,fill:"#94a3b8" }} tickLine={false} axisLine={false}/>
                <YAxis domain={[40,85]} tick={{ fontSize:10,fill:"#94a3b8" }} tickLine={false} axisLine={false}
                  tickFormatter={v=>`${v}%`}/>
                <Tooltip contentStyle={{ background:"rgba(255,255,255,0.96)",border:"1px solid rgba(0,0,0,0.08)",
                  borderRadius:10,fontSize:11,boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}
                  formatter={v=>[`${v}%`]}/>
                <Line type="monotone" dataKey="train" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Train"/>
                <Line type="monotone" dataKey="val" stroke="#c4b5fd" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Val"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
