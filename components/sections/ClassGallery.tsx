"use client";
import { motion } from "framer-motion";
import { CIFAR10_CLASSES } from "@/constants/cifar10";

const perClass: Record<string,number>={
  Airplane:83.4,Automobile:89.2,Bird:74.2,Cat:70.2,
  Deer:79.6,Dog:79.4,Frog:83.6,Horse:85.6,Ship:87.6,Truck:87.0,
};

const stats=[
  { label:"Total Images", val:"60,000" },
  { label:"Training Set",  val:"50,000" },
  { label:"Test Set",      val:"10,000" },
  { label:"Image Size",    val:"32 × 32 × 3" },
];

export default function ClassGallery() {
  return (
    <section id="classes" style={{ padding:"52px 20px 72px" }}>
      <div style={{ maxWidth:1040, margin:"0 auto" }}>

        <motion.div initial={{ opacity:0,y:14 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }} style={{ marginBottom:28 }}>
          <p className="section-label" style={{ marginBottom:8 }}>Dataset</p>
          <h2 className="section-title">CIFAR-10 Categories</h2>
          <p className="section-sub" style={{ marginTop:8,maxWidth:380 }}>
            10 balanced object classes · 6,000 training images each.
          </p>
        </motion.div>

        {/* 5-col grid — first dark */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:9,marginBottom:9 }}
          className="max-sm:grid-cols-2 max-md:grid-cols-3">
          {CIFAR10_CLASSES.map((cls,i)=>{
            const dark=i===0;
            const acc=perClass[cls.name];
            return (
              <motion.div key={cls.id}
                initial={{ opacity:0,scale:0.93 }} whileInView={{ opacity:1,scale:1 }}
                viewport={{ once:true }} transition={{ duration:0.38,delay:i*0.05 }}
                whileHover={{ y:-5,transition:{ duration:0.1 } }}
                style={{
                  background:dark?"#0c0c14":"#ffffff",
                  border:dark?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.07)",
                  borderRadius:18,padding:"16px 13px 14px",
                  display:"flex",flexDirection:"column",alignItems:"center",gap:9,
                  textAlign:"center",position:"relative",overflow:"hidden",cursor:"default",
                  boxShadow:dark?"0 8px 24px rgba(0,0,0,0.22)":"0 2px 8px rgba(0,0,0,0.04)",
                }}>
                {dark&&<div style={{ position:"absolute",top:"-25%",left:"-15%",width:"130%",height:"150%",
                  background:"radial-gradient(ellipse,rgba(124,58,237,0.22) 0%,transparent 70%)",
                  pointerEvents:"none",borderRadius:"50%" }}/>}

                <motion.div
                  whileHover={{ rotate:[0,-5,5,0],transition:{ duration:0.32 } }}
                  style={{ width:42,height:42,borderRadius:12,
                    background:dark?"rgba(124,58,237,0.2)":"rgba(124,58,237,0.07)",
                    border:dark?"1px solid rgba(124,58,237,0.26)":"1px solid rgba(124,58,237,0.09)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"1.4rem",position:"relative" }}>
                  {cls.emoji}
                </motion.div>
                <div style={{ position:"relative" }}>
                  <p style={{ fontSize:12.5,fontWeight:700,color:dark?"#ffffff":"#09090e",letterSpacing:"-0.01em" }}>
                    {cls.name}
                  </p>
                  <p style={{ fontSize:10,color:dark?"rgba(255,255,255,0.32)":"#94a3b8",marginTop:2,lineHeight:1.4 }}>
                    {cls.desc}
                  </p>
                </div>
                <div style={{ width:"100%",position:"relative" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
                    <span style={{ fontSize:9,color:dark?"rgba(255,255,255,0.28)":"#94a3b8",
                      textTransform:"uppercase",letterSpacing:"0.08em" }}>Recall</span>
                    <span style={{ fontSize:11,fontWeight:700,color:dark?"#c4b5fd":"#7c3aed" }}>{acc}%</span>
                  </div>
                  <div style={{ height:3,background:dark?"rgba(255,255,255,0.08)":"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                    <motion.div
                      initial={{ width:0 }}
                      whileInView={{ width:`${acc}%` }}
                      viewport={{ once:true }}
                      transition={{ duration:0.75,delay:i*0.06,ease:[0.22,1,0.36,1] }}
                      style={{ height:"100%",borderRadius:99,
                        background:dark?"linear-gradient(90deg,#7c3aed,#c4b5fd)":"linear-gradient(90deg,#7c3aed,#a855f7)" }}/>
                  </div>
                </div>
                <span style={{ fontSize:9,fontWeight:700,letterSpacing:"0.1em",
                  textTransform:"uppercase",
                  color:dark?"rgba(196,181,253,0.55)":"#94a3b8",position:"relative" }}>
                  Class {cls.id}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Dark stats bar */}
        <motion.div initial={{ opacity:0,y:10 }} whileInView={{ opacity:1,y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5,delay:0.2 }}
          style={{
            background:"#0c0c14",border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:18,padding:"18px 24px",
            display:"grid",gridTemplateColumns:"repeat(4,1fr)",
            boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
            position:"relative",overflow:"hidden",
          }}
          className="max-sm:grid-cols-2 max-sm:gap-y-4">
          <div style={{ position:"absolute",top:"-30%",left:"25%",width:"50%",height:"160%",
            background:"radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 70%)",
            pointerEvents:"none",filter:"blur(24px)",borderRadius:"50%" }}/>
          {stats.map(({ label,val })=>(
            <div key={label} style={{ textAlign:"center",position:"relative" }}>
              <p style={{ fontSize:20,fontWeight:800,color:"#ffffff",letterSpacing:"-0.03em" }}>{val}</p>
              <p style={{ fontSize:11,color:"rgba(255,255,255,0.32)",marginTop:3 }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
