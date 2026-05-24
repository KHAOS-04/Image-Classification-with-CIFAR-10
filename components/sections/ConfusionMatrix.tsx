"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { confusionMatrix } from "@/mock-data";
import { CIFAR10_CLASSES } from "@/constants/cifar10";

function cellBg(v:number, max:number, isMain:boolean):string {
  const t=v/max;
  if (isMain) return `rgba(124,58,237,${0.10+t*0.90})`;
  if (t>0.28)  return `rgba(220,38,38,${t*0.55})`;
  if (t>0.09)  return `rgba(245,158,11,${t*0.48})`;
  return `rgba(124,58,237,${t*0.14})`;
}

export default function ConfusionMatrixSection() {
  const [hov,setHov]=useState<{r:number;c:number}|null>(null);
  const rowMax=confusionMatrix.map(r=>Math.max(...r));

  const info=hov?{
    actual:CIFAR10_CLASSES[hov.r].name,
    pred:CIFAR10_CLASSES[hov.c].name,
    val:confusionMatrix[hov.r][hov.c],
    ok:hov.r===hov.c,
    total:confusionMatrix[hov.r].reduce((a,b)=>a+b,0),
  }:null;

  return (
    <section id="matrix" style={{ padding:"48px 20px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        <motion.div initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Confusion Matrix</p>
          <h2 className="section-title">Where the Model Thinks</h2>
          <p className="section-sub" style={{ marginTop:8,maxWidth:440 }}>
            Rows = actual · Columns = predicted · Diagonal = correct. Hover any cell to inspect.
          </p>
        </motion.div>

        {/* Card — overflow:visible so hover cells pop forward */}
        <motion.div initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.52 }}
          style={{
            background:"#ffffff", border:"1px solid rgba(0,0,0,0.07)",
            borderRadius:22, padding:"20px 18px 18px",
            boxShadow:"0 4px 20px rgba(0,0,0,0.05)",
            overflowX:"auto",
            overflowY:"visible",   /* IMPORTANT: allow hover cells to pop above */
          }}>

          {/* Tooltip */}
          <div style={{ minHeight:34,marginBottom:12,
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <AnimatePresence mode="wait">
              {info ? (
                <motion.div key="tip"
                  initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }}
                  exit={{ opacity:0,y:-4 }} transition={{ duration:0.12 }}
                  style={{
                    background:info.ok?"rgba(16,185,129,0.07)":"rgba(239,68,68,0.07)",
                    border:`1px solid ${info.ok?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)"}`,
                    borderRadius:10,padding:"5px 16px",
                    fontSize:12,fontWeight:500,
                    color:info.ok?"#059669":"#dc2626",
                    whiteSpace:"nowrap",
                  }}>
                  {info.ok
                    ?`✓ ${info.actual} correctly predicted — ${info.val} samples (${((info.val/info.total)*100).toFixed(0)}% recall)`
                    :`${info.actual} → predicted as ${info.pred} — ${info.val} errors`}
                </motion.div>
              ):(
                <motion.span key="hint" initial={{ opacity:0 }} animate={{ opacity:1 }}
                  style={{ fontSize:11,color:"#94a3b8" }}>
                  Hover a cell to inspect
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div style={{ minWidth:500 }}>
            {/* Column headers */}
            <div style={{ display:"flex",marginLeft:62,marginBottom:4 }}>
              {CIFAR10_CLASSES.map(c=>(
                <div key={c.id} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1 }}>
                  <span style={{ fontSize:12 }}>{c.emoji}</span>
                  <span style={{ fontSize:8.5,color:"#94a3b8",lineHeight:1 }}>{c.name.slice(0,4)}</span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {confusionMatrix.map((row,ri)=>(
              <motion.div key={ri}
                initial={{ opacity:0,x:-7 }} whileInView={{ opacity:1,x:0 }}
                viewport={{ once:true }} transition={{ duration:0.26,delay:ri*0.025 }}
                style={{ display:"flex",alignItems:"center",marginBottom:2,
                  position:"relative",zIndex:0 }}>   {/* per-row stacking context */}
                <div style={{ width:60,flexShrink:0,display:"flex",alignItems:"center",gap:3,paddingRight:4 }}>
                  <span style={{ fontSize:12 }}>{CIFAR10_CLASSES[ri].emoji}</span>
                  <span style={{ fontSize:8.5,color:"#94a3b8" }}>{CIFAR10_CLASSES[ri].name.slice(0,4)}</span>
                </div>
                {row.map((val,ci)=>{
                  const isMain=ri===ci;
                  const isHov=hov?.r===ri&&hov?.c===ci;
                  return (
                    <div key={ci}
                      onMouseEnter={()=>setHov({r:ri,c:ci})}
                      onMouseLeave={()=>setHov(null)}
                      style={{
                        flex:1, aspectRatio:"1/1",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        background:cellBg(val,rowMax[ri],isMain),
                        borderRadius:6, margin:"1px",
                        /* Larger font — key fix */
                        fontSize:"0.7rem",
                        fontWeight:700,
                        color:isMain&&val>550?"white":"#111827",
                        cursor:"default",
                        /* Pop FORWARD — isolation + high z-index + no parent clip */
                        position:"relative",
                        zIndex:isHov?30:1,
                        isolation:"isolate",
                        transform:isHov?"scale(1.30) translateZ(0)":"scale(1) translateZ(0)",
                        boxShadow:isHov
                          ?"0 6px 22px rgba(124,58,237,0.50), 0 2px 8px rgba(0,0,0,0.22)"
                          :"none",
                        transition:"transform 0.09s cubic-bezier(0.22,1,0.36,1),box-shadow 0.09s ease",
                        willChange:"transform",
                      }}
                    >
                      {val>0?val:""}
                    </div>
                  );
                })}
              </motion.div>
            ))}

            {/* Legend */}
            <div style={{ display:"flex",gap:18,marginTop:15,flexWrap:"wrap",justifyContent:"center" }}>
              {[["rgba(124,58,237,0.68)","Correct (diagonal)"],
                ["rgba(220,38,38,0.40)","High misclassification"],
                ["rgba(124,58,237,0.07)","Rare errors"],
              ].map(([bg,lbl])=>(
                <span key={lbl} style={{ display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#64748b" }}>
                  <span style={{ width:12,height:12,borderRadius:3,background:bg,display:"inline-block" }}/>
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
