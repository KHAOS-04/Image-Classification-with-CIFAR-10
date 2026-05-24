"use client";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { validationRuns } from "@/mock-data";
import { CIFAR10_CLASSES } from "@/constants/cifar10";

const perClass: Record<string,number>={
  Airplane:83.4,Automobile:89.2,Bird:74.2,Cat:70.2,
  Deer:79.6,Dog:79.4,Frog:83.6,Horse:85.6,Ship:87.6,Truck:87.0,
};
const cc=(c:number)=>c>=85?"#10b981":c>=65?"#f59e0b":"#ef4444";

export default function ValidationRuns() {
  return (
    <section id="validation" style={{ padding:"52px 20px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        <motion.div initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Validation Runs</p>
          <h2 className="section-title">5 Sample Validations</h2>
          <p className="section-sub" style={{ marginTop:8,maxWidth:420 }}>
            One representative image per class — run through the CNN to verify real-world behaviour.
          </p>
        </motion.div>

        {/* 5-card row */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:10,marginBottom:10 }}
          className="max-sm:grid-cols-2 max-md:grid-cols-3">
          {validationRuns.map((run,i)=>{
            const dark=i===0;
            return (
              <motion.div key={run.id}
                initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }}
                viewport={{ once:true }} transition={{ duration:0.38,delay:i*0.07 }}
                whileHover={{ y:-4,transition:{ duration:0.1 } }}
                style={{
                  background:dark?"#0c0c14":"#ffffff",
                  border:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",
                  borderRadius:20,padding:"18px 14px 16px",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:10,
                  textAlign:"center",position:"relative",overflow:"hidden",cursor:"default",
                  boxShadow:dark?"0 8px 24px rgba(0,0,0,0.22)":"0 2px 8px rgba(0,0,0,0.04)",
                }}>
                {dark&&<div style={{ position:"absolute",top:"-25%",left:"-15%",width:"130%",height:"150%",
                  background:"radial-gradient(ellipse,rgba(124,58,237,0.22) 0%,transparent 70%)",
                  pointerEvents:"none",borderRadius:"50%" }}/>}

                <div style={{ position:"relative",
                  width:44,height:44,borderRadius:13,
                  background:dark?"rgba(124,58,237,0.18)":"rgba(124,58,237,0.07)",
                  border:dark?"1px solid rgba(124,58,237,0.28)":"1px solid rgba(124,58,237,0.09)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.55rem" }}>
                  {run.emoji}
                </div>
                <div style={{ position:"relative" }}>
                  <p style={{ fontSize:13,fontWeight:800,letterSpacing:"-0.02em",color:dark?"#ffffff":"#09090e",lineHeight:1 }}>
                    {run.className}
                  </p>
                  <p style={{ fontSize:9.5,color:dark?"rgba(255,255,255,0.3)":"#94a3b8",marginTop:2 }}>Run #{run.id}</p>
                </div>
                <div style={{ position:"relative",width:"100%",
                  background:dark?"rgba(255,255,255,0.06)":"rgba(124,58,237,0.05)",
                  borderRadius:10,padding:"8px 6px",textAlign:"center" }}>
                  <span style={{ fontSize:20,fontWeight:800,letterSpacing:"-0.02em",color:cc(run.confidence) }}>
                    {run.confidence}%
                  </span>
                  <p style={{ fontSize:9,color:dark?"rgba(255,255,255,0.28)":"#94a3b8",marginTop:2 }}>confidence</p>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:3,position:"relative" }}>
                  <Clock size={9} color={dark?"rgba(255,255,255,0.28)":"#94a3b8"}/>
                  <span style={{ fontSize:10,color:dark?"rgba(255,255,255,0.28)":"#94a3b8" }}>{run.inferenceMs} ms</span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:4,position:"relative" }}>
                  {run.status==="correct"
                    ?<CheckCircle2 size={11} color="#10b981"/>
                    :<XCircle size={11} color="#ef4444"/>}
                  <span style={{ fontSize:10,fontWeight:600,
                    color:run.status==="correct"?"#10b981":"#ef4444" }}>
                    {run.status==="correct"?"Correct":"Misclassified"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Per-class recall */}
        <motion.div initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5,delay:0.14 }}
          style={{ background:"#ffffff",border:"1px solid rgba(0,0,0,0.07)",
            borderRadius:20,padding:"20px 24px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,flexWrap:"wrap",gap:6 }}>
            <div>
              <p style={{ fontSize:14,fontWeight:700,color:"#09090e" }}>Per-Class Recall</p>
              <p style={{ fontSize:11,color:"#94a3b8",marginTop:2 }}>
                Classification recall across all 10 CIFAR-10 categories (10,000 test samples)
              </p>
            </div>
            <span style={{ fontSize:12,color:"#7c3aed",fontWeight:600 }}>10 classes</span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px" }}
            className="max-sm:block">
            {CIFAR10_CLASSES.map((cls,i)=>(
              <motion.div key={cls.id}
                initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true }} transition={{ duration:0.3,delay:i*0.04 }}
                style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                <span style={{ fontSize:13,width:17,flexShrink:0 }}>{cls.emoji}</span>
                <span style={{ fontSize:11,color:"#64748b",width:70,flexShrink:0 }}>{cls.name}</span>
                <div style={{ flex:1,height:3.5,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:`${perClass[cls.name]}%` }}
                    viewport={{ once:true }}
                    transition={{ duration:0.75,delay:i*0.05,ease:[0.22,1,0.36,1] }}
                    style={{ height:"100%",borderRadius:99,
                      background:"linear-gradient(90deg,#7c3aed,#a855f7)" }}/>
                </div>
                <span style={{ fontSize:11,fontWeight:700,color:"#374151",width:36,textAlign:"right" }}>
                  {perClass[cls.name]}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
