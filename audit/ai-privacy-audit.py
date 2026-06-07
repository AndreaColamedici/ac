#!/usr/bin/env python3
"""
AI Privacy Audit Kit — v1.0

A reproducible protocol for measuring the client exposure surface
of hosted AI conversations. Run inside any AI code execution sandbox.

Full paper: "Inside the Container" (Colamedici, 2026)
Usage: Paste this script into Claude.ai / ChatGPT / Gemini code execution.
License: CC BY 4.0 — Andrea Colamedici, Tlon

Output: JSON report with findings, capability/policy/verifiability table,
and platform detection.
"""

import json,os,re,socket,subprocess,sys,time
from datetime import datetime,timezone

R={"v":"1.0","date":datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),"platform":"unknown","findings":{},"table":[],"errors":[]}

def s(fn,l):
    try: return fn()
    except Exception as e: R["errors"].append({"step":l,"error":str(e)}); return None

# Platform
for p,paths in {"claude":["/container_info.json"],"chatgpt":["/home/sandbox"],"gemini":["/content"]}.items():
    if any(os.path.exists(x) for x in paths): R["platform"]=p; break

# Environment
def f1():
    r={"kernel":s(lambda:subprocess.run(["uname","-a"],capture_output=True,text=True).stdout.strip(),"k")}
    d=s(lambda:subprocess.run(["dmesg"],capture_output=True,text=True).stdout,"d")
    if d: r["virt"]=[k for k in["Firecracker","QEMU","KVM","gVisor","Docker","virtio"]if k.lower()in d.lower()]
    if os.path.exists("/container_info.json"): r["container"]=json.load(open("/container_info.json"))
    return r
R["findings"]["env"]=s(f1,"env")

# Network
def f2():
    r={"endpoints":[]}
    tp="/proc/1/net/tcp"if os.path.exists("/proc/1/net/tcp")else"/proc/self/net/tcp"
    if os.path.exists(tp):
        for l in open(tp).readlines()[1:]:
            p=l.split();rm=p[2];st=p[3]
            ip_h,pt_h=rm.split(":");ip=".".join(str(b)for b in reversed(bytes.fromhex(ip_h)));pt=int(pt_h,16)
            if st=="01"and ip not in["0.0.0.0","127.0.0.1"]:
                dns="unknown"
                try:dns=socket.gethostbyaddr(ip)[0]
                except:pass
                r["endpoints"].append({"ip":ip,"port":pt,"dns":dns})
    return r
R["findings"]["net"]=s(f2,"net")

# TLS
def f3():
    r={}
    for cp in["/etc/ssl/certs/ca-certificates.crt","/etc/ssl/cert.pem"]:
        if not os.path.exists(cp):continue
        c=open(cp).read();cs=c.split("-----END CERTIFICATE-----");r["ca_count"]=len(cs)-1
        if len(cs)>=2:
            open("/tmp/_c.pem","w").write(cs[-2]+"-----END CERTIFICATE-----")
            o=subprocess.run(["openssl","x509","-text","-noout","-in","/tmp/_c.pem"],capture_output=True,text=True)
            if o.returncode==0:
                for ln in o.stdout.split("\n"):
                    ln=ln.strip()
                    if ln.startswith("Issuer:"):r["last_ca_issuer"]=ln
                    if ln.startswith("Subject:"):r["last_ca_subject"]=ln
                r["tls_inspection"]=any(k in r.get("last_ca_issuer","").lower()for k in["inspection","proxy","egress"])
            os.unlink("/tmp/_c.pem")
        break
    return r
R["findings"]["tls"]=s(f3,"tls")

# Storage
def f4():
    r={}
    for rp in["/tmp/rclone-mount-config.json"]:
        if os.path.exists(rp):
            cfg=json.load(open(rp));r["service_url"]=cfg.get("service_url")
            r["mounts"]=[{"dst":m["destination"],"ro":m.get("readonly"),"cache_s":m.get("cache_duration_s")}for m in cfg.get("mounts",[])]
    return r
R["findings"]["storage"]=s(f4,"storage")

# Conversation isolation
def f5():
    r={"searched":False}
    mp="/proc/1/maps";mm="/proc/1/mem"
    if os.path.exists(mp)and os.path.exists(mm):
        tot=0
        for l in open(mp):
            p=l.split()
            if'r'not in p[1]or not any(s in l for s in['[heap]','[stack]']):continue
            a,b=[int(x,16)for x in p[0].split("-")]
            if b-a>50000000:continue
            try:
                f=open(mm,"rb");f.seek(a);tot+=len(f.read(b-a));f.close()
            except:pass
        r={"searched":True,"bytes":tot}
    return r
R["findings"]["memory"]=s(f5,"mem")

# Transcript
def f6():
    r={"found":False}
    for td in["/mnt/transcripts"]:
        if not os.path.exists(td):continue
        r["found"]=True;r["files"]=[]
        for fn in sorted(os.listdir(td)):
            fp=os.path.join(td,fn)
            if not os.path.isfile(fp):continue
            fi={"name":fn,"bytes":os.path.getsize(fp)}
            try:
                t=open(fp,encoding="utf-8",errors="replace").read()
                fi["types"]={k:t.count(k)for k in['"type": "text"','"type": "thinking"','"type": "tool_use"','"type": "tool_result"']}
                ts=sorted(re.findall(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}',t))
                if ts:fi["ts_first"]=ts[0];fi["ts_last"]=ts[-1]
            except:pass
            r["files"].append(fi)
    return r
R["findings"]["transcript"]=s(f6,"transcript")

# MCP
def f7():
    r={"reachable":[]}
    for h in["mcp.notion.com","mcp.canva.com"]:
        try:
            sk=socket.socket();sk.settimeout(3);t0=time.time();sk.connect((h,443))
            r["reachable"].append({"host":h,"ms":round((time.time()-t0)*1000)});sk.close()
        except:pass
    return r
R["findings"]["mcp"]=s(f7,"mcp")

# Table
R["table"]=[{"category":c,"access":"Yes","evidence":e,"policy":p,"verifiable":"No"}for c,e,p in[
    ("Messages","Server-side","Privacy Policy"),("Responses","Server-side","Privacy Policy"),
    ("Thinking","In transcript snapshots","Not addressed"),("Files","Provider servers","Privacy Policy"),
    ("Tool code","Inspected channel","Privacy Policy"),("MCP calls","Server-side","Not addressed"),
    ("Network","TLS inspection","Not addressed")]]

print(json.dumps(R,indent=2,default=str))
for d in["/mnt/user-data/outputs","/tmp"]:
    if os.path.exists(d):open(os.path.join(d,"audit.json"),"w").write(json.dumps(R,indent=2,default=str));break
