import json,sys
from PIL import Image,ImageDraw
D=json.load(open('./cap_out.json'))
SC=118;CW,CH=330,400
def draw_frame(fr,label,cx_center):
    im=Image.new('RGB',(CW,CH),(28,30,36));d=ImageDraw.Draw(im)
    pts=fr['p']+fr['e']
    d.line((0,CH-30,CW,CH-30),fill=(80,80,80))
    # centre camera on mid point between fighters
    xs=[p[0] for p in fr['p']];mid=(min(xs)+max(xs))/2 if xs else 0
    for grp,dim in((fr['e'],.45),(fr['p'],1.0)):
        for p in sorted(grp,key=lambda q:q[2]):
            x=CW/2+(p[0]-mid)*SC;y=CH-30-p[1]*SC
            c=tuple(int(v*dim) for v in p[3:6])
            d.rectangle((x,y,x+1,y+1),fill=c)
    d.text((6,4),label,fill=(255,255,255))
    return im
def sheet(names,fighter,path,maxf=7):
    rows=[s for s in D if s['name'] in names and s['fighter']==fighter]
    H=len(rows)*CH;W=CW*maxf
    S=Image.new('RGB',(W,H),(20,20,24));
    for r,sc in enumerate(rows):
        for i,fr in enumerate(sc['frames'][:maxf]):
            S.paste(draw_frame(fr,f"{fighter} {sc['name']}: {fr['label']}",0),(i*CW,r*CH))
    S.save(path)
sheet(sys.argv[1].split(','),sys.argv[2],sys.argv[3])
