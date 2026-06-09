// SaleSmartly Full Prototype - Figma Scripter Plugin Code
async function main(){
await figma.loadFontAsync({family:"Inter",style:"Regular"});
await figma.loadFontAsync({family:"Inter",style:"Medium"});
await figma.loadFontAsync({family:"Inter",style:"Semi Bold"});
await figma.loadFontAsync({family:"Inter",style:"Bold"});
const W=1440,H=900,GAP=100,COLS=5,frames=[];
const screens=[createChat,createContacts,createContactDetail,createCampaignList,createCampaignEditor,createAutomationList,createFlowEditor,createAIAgent,createAnalytics,createChannels,createTeam,createSettings];
for(let i=0;i<screens.length;i++){const col=i%COLS,row=Math.floor(i/COLS);frames.push(screens[i](col*(W+GAP),row*(H+GAP)));}
figma.viewport.scrollAndZoomIntoView(frames);
figma.closePlugin("完成! 已生成12个SaleSmartly原型页面");
}

// ===== COLORS =====
function c(r,g,b){return{r:r/255,g:g/255,b:b/255};}
const C={pri:c(124,58,237),nav:c(26,16,60),bg:c(248,250,252),card:c(255,255,255),bdr:c(226,232,240),td:c(30,41,59),ts:c(100,116,139),tl:c(148,163,184),ok:c(5,150,105),warn:c(180,83,9),err:c(239,68,68),w:c(255,255,255),priL:c(237,233,254),okL:c(209,250,229),warnL:c(254,243,199),errL:c(254,226,226),navHi:c(55,35,100),inputBg:c(241,245,249),bluL:c(219,234,254),blu:c(59,130,246)};

// ===== HELPERS =====
function r(p,x,y,w,h,color,name){const rect=figma.createRectangle();rect.name=name||"";rect.x=x;rect.y=y;rect.resize(w,h);rect.fills=[{type:"SOLID",color}];p.appendChild(rect);return rect;}
function t(p,x,y,content,size,color,style){const tx=figma.createText();tx.x=x;tx.y=y;tx.fontName={family:"Inter",style:style||"Regular"};tx.fontSize=size;tx.characters=content;tx.fills=[{type:"SOLID",color}];p.appendChild(tx);return tx;}
function ellipse(p,x,y,w,h,color,name){const e=figma.createEllipse();e.name=name||"";e.x=x;e.y=y;e.resize(w,h);e.fills=[{type:"SOLID",color}];p.appendChild(e);return e;}
function frame(name,x,y){const f=figma.createFrame();f.name=name;f.x=x;f.y=y;f.resize(1440,900);f.fills=[{type:"SOLID",color:C.bg}];f.clipsContent=true;return f;}
function rr(p,x,y,w,h,color,rad,name){const rc=r(p,x,y,w,h,color,name);rc.cornerRadius=rad;return rc;}
function line(p,x,y,w,color){return r(p,x,y,w,1,color||C.bdr,"line");}
function badge(p,x,y,w,h,bgC,text,textC,sz){rr(p,x,y,w,h,bgC,h/2,"badge");t(p,x+6,y+Math.floor((h-sz)/2),text,sz||11,textC||C.w,"Medium");}
function btn(p,x,y,w,h,bgC,text,textC,sz){rr(p,x,y,w,h,bgC,6,"btn");t(p,x+Math.floor((w-text.length*(sz||13)*0.55)/2),y+Math.floor((h-(sz||13))/2),text,sz||13,textC||C.w,"Semi Bold");}
function inputBox(p,x,y,w,h,placeholder){rr(p,x,y,w,h,C.w,6,"input");const b=r(p,x,y,w,h,C.bdr,"inputBdr");b.cornerRadius=6;b.strokeWeight=1;b.strokes=[{type:"SOLID",color:C.bdr}];b.fills=[];t(p,x+12,y+Math.floor((h-13)/2),placeholder,13,C.tl,"Regular");}
function card(p,x,y,w,h){const cd=rr(p,x,y,w,h,C.card,8,"card");cd.strokes=[{type:"SOLID",color:C.bdr}];cd.strokeWeight=1;return cd;}

// ===== LEFT NAV =====
const navLabels=["聊天","客户","营销","自动化","AI","报表","渠道","设置"];
function nav(p,activeIdx){
r(p,0,0,64,900,C.nav,"nav");
rr(p,16,16,32,32,C.pri,8,"logo");
t(p,26,23,"S",14,C.w,"Bold");
for(let i=0;i<navLabels.length;i++){
const yy=80+i*56;
if(i===activeIdx){rr(p,4,yy-4,56,48,C.navHi,8,"navHi");r(p,0,yy-4,3,48,C.pri,"indicator");}
t(p,12,yy+2,navLabels[i],9,i===activeIdx?C.w:C.tl,"Medium");
ellipse(p,22,yy-16,20,20,i===activeIdx?C.pri:c(60,40,110),"ico");
t(p,28,yy-13,navLabels[i][0],10,C.w,"Medium");
}}

// ===== SCREEN 1: CHAT =====
function createChat(ox,oy){
const f=frame("1-Chat",ox,oy);nav(f,0);
// Session list panel
r(f,64,0,320,900,C.card,"sessionPanel");line(f,384,0,1,C.bdr);r(f,384,0,1,900,C.bdr);
// Search
rr(f,80,16,288,36,C.inputBg,8,"search");t(f,100,26,"搜索会话...",12,C.tl,"Regular");
// Tabs
const tabs=["我的","AI","待分配","全部"];
for(let i=0;i<4;i++){t(f,80+i*72,64,tabs[i],12,i===0?C.pri:C.ts,i===0?"Semi Bold":"Regular");if(i===0)r(f,80,80,30,2,C.pri,"tabLine");}
// Conversation cards
const convos=[
{name:"李伟",msg:"你好，我的订单#1234有问题",time:"2分钟前",unread:3,ch:"WA"},
{name:"Emma Wilson",msg:"请问可以查一下物流状态吗？",time:"15分钟前",unread:1,ch:"FB"},
{name:"王思远",msg:"非常感谢你的帮助！",time:"32分钟前",unread:0,ch:"IG"},
{name:"Ahmed Hassan",msg:"这个商品有L码吗？",time:"1小时前",unread:2,ch:"TG"},
{name:"张丽",msg:"我想退这个商品",time:"2小时前",unread:0,ch:"EM"},
{name:"David Brown",msg:"促销活动什么时候开始？",time:"5小时前",unread:0,ch:"LC"}
];
for(let i=0;i<convos.length;i++){
const yy=96+i*80;
const cv=convos[i];
if(i===0)r(f,64,yy,320,80,C.priL,"activeBg");
line(f,80,yy+80,288,C.bdr);
ellipse(f,80,yy+16,40,40,c(180,160,230),"avatar");
t(f,86,yy+26,cv.name[0],16,C.w,"Bold");
t(f,128,yy+18,cv.name,13,C.td,"Semi Bold");
t(f,128,yy+38,cv.msg.substring(0,22)+(cv.msg.length>22?"...":""),11,C.ts,"Regular");
t(f,340,yy+18,cv.time,10,C.tl,"Regular");
if(cv.unread>0)badge(f,340,yy+38,20,18,C.pri,String(cv.unread),C.w,10);
// channel dot
const chColors={WA:c(37,211,102),FB:c(24,119,242),IG:c(225,48,108),TG:c(0,136,204),EM:c(234,179,8),LC:C.pri};
ellipse(f,112,yy+44,8,8,chColors[cv.ch]||C.pri,"chDot");
}
// Message area
r(f,384,0,680,56,C.card,"msgHeader");line(f,384,56,680,C.bdr);
ellipse(f,400,12,32,32,c(180,160,230),"avatar");t(f,406,19,"李",14,C.w,"Bold");
t(f,440,12,"李伟",14,C.td,"Semi Bold");
t(f,440,32,"WhatsApp  |  在线",11,C.ts,"Regular");
badge(f,560,14,48,22,C.okL,"在线",C.ok,10);
// Messages
const msgY=80;
// Customer msg
rr(f,400,msgY,340,48,C.inputBg,12,"custMsg");
t(f,412,msgY+8,"你好，我的订单#1234有问题",12,C.td,"Regular");
t(f,412,msgY+28,"可以退款吗？",12,C.td,"Regular");
t(f,700,msgY+36,"10:23 AM",9,C.tl,"Regular");
// Agent reply
rr(f,580,msgY+70,280,44,C.pri,12,"agentMsg");
t(f,592,msgY+78,"好的！让我查一下您的订单详情。",12,C.w,"Regular");
t(f,820,msgY+96,"10:25 AM",9,c(200,190,240),"Regular");
// Customer msg 2
rr(f,400,msgY+140,300,32,C.inputBg,12,"custMsg2");
t(f,412,msgY+148,"收到的商品有破损",12,C.td,"Regular");
t(f,660,msgY+154,"10:26 AM",9,C.tl,"Regular");
// Agent reply 2
rr(f,620,msgY+195,240,44,C.pri,12,"agentReply2");
t(f,632,msgY+203,"非常抱歉听到这个情况。",12,C.w,"Regular");
t(f,632,msgY+219,"我马上为您处理退款。",12,C.w,"Regular");
// Translation bar
rr(f,400,msgY+260,640,32,C.priL,6,"transBar");
t(f,412,msgY+268,"[翻译] 已从中文翻译",11,C.pri,"Medium");
// AI suggestion bar
rr(f,400,msgY+305,640,36,C.okL,6,"aiSuggest");
t(f,412,msgY+313,"AI建议: 提供下次购买的15%折扣券",11,C.ok,"Medium");
// Input area
r(f,384,780,680,120,C.card,"inputArea");line(f,384,780,680,C.bdr);
// Toolbar
const tools=["B","I","链接","图片","文件","表情","话术"];
for(let i=0;i<tools.length;i++)t(f,400+i*40,790,tools[i],11,C.ts,"Medium");
rr(f,400,816,620,52,C.inputBg,8,"inputField");
t(f,412,834,"输入消息...",13,C.tl,"Regular");
btn(f,960,826,80,32,C.pri,"发送",C.w,12);

// Customer info panel
r(f,1064,0,376,900,C.card,"infoPanel");r(f,1064,0,1,900,C.bdr);
ellipse(f,1212,24,56,56,c(180,160,230),"bigAvatar");
t(f,1230,42,"李",16,C.w,"Bold");
t(f,1210,90,"李伟",16,C.td,"Bold");
t(f,1186,114,"liwei@example.com",12,C.ts,"Regular");
t(f,1202,132,"+86 138-0013",12,C.ts,"Regular");
// Tags
const tags=[{t:"VIP",c:C.pri,bg:C.priL},{t:"高意向",c:C.warn,bg:C.warnL},{t:"美国",c:C.blu,bg:C.bluL}];
for(let i=0;i<tags.length;i++)badge(f,1080+i*80,160,tags[i].t.length*14+12,22,tags[i].bg,tags[i].t,tags[i].c,10);
line(f,1080,194,344,C.bdr);
// Info fields
const fields=[["公司","TechCorp Inc."],["地区","美国 纽约"],["语言","英语"],["时区","EST (UTC-5)"]];
for(let i=0;i<fields.length;i++){
t(f,1080,210+i*40,fields[i][0],11,C.ts,"Medium");
t(f,1200,210+i*40,fields[i][1],12,C.td,"Regular");
}
line(f,1080,380,344,C.bdr);
// Recent order
t(f,1080,394,"最近订单",13,C.td,"Semi Bold");
card(f,1080,416,344,80);
t(f,1096,426,"Order #ORD-2024-1234",12,C.td,"Medium");
t(f,1096,444,"MacBook Pro 16\"",11,C.ts,"Regular");
t(f,1096,462,"$2,499.00",12,C.ok,"Semi Bold");
t(f,1340,426,"已发货",10,C.ok,"Medium");
line(f,1080,510,344,C.bdr);
// Conversation history
t(f,1080,524,"会话历史",13,C.td,"Semi Bold");
const hist=["WhatsApp - 6月5日","Email - 6月3日","在线客服 - 5月28日"];
for(let i=0;i<hist.length;i++){
rr(f,1080,548+i*36,344,30,C.inputBg,4);
t(f,1096,554+i*36,hist[i],11,C.ts,"Regular");
}
return f;
}

// ===== SCREEN 2: CONTACTS =====
function createContacts(ox,oy){
const f=frame("2-Contacts",ox,oy);nav(f,1);
// Header
r(f,64,0,1376,56,C.card,"header");line(f,64,56,1376,C.bdr);
t(f,88,16,"客户管理",20,C.td,"Bold");
btn(f,1260,12,100,32,C.pri,"添加客户",C.w,12);
btn(f,1140,12,50,32,C.inputBg,"导入",C.ts,11);
btn(f,1196,12,50,32,C.inputBg,"导出",C.ts,11);
// Bulk action bar (subtle)
rr(f,88,12,240,32,C.priL,6,"bulkBar");
t(f,100,19,"已选2项: 删除 | 标签 | 导出",10,C.pri,"Medium");
// Filter bar
r(f,64,56,1376,48,C.card,"filterBar");line(f,64,104,1376,C.bdr);
rr(f,88,66,200,28,C.inputBg,6);t(f,100,72,"搜索客户...",11,C.tl,"Regular");
const filters=["渠道","标签","分群","状态"];
for(let i=0;i<4;i++){rr(f,308+i*110,66,100,28,C.card,6,"filter");const fi=r(f,308+i*110,66,100,28,C.card,"fiBdr");fi.cornerRadius=6;fi.strokes=[{type:"SOLID",color:C.bdr}];fi.fills=[];t(f,320+i*110,72,filters[i],11,C.ts,"Regular");}
// Table header
r(f,64,104,1376,36,C.inputBg,"tableHead");
const cols=["","姓名","邮箱","手机","渠道","标签","最近活跃","状态"];
const colX=[88,120,340,520,680,760,960,1120];
for(let i=0;i<cols.length;i++)t(f,colX[i],112,cols[i],11,C.ts,"Semi Bold");
// Checkbox header
rr(f,88,112,14,14,C.card,2);const cb0=r(f,88,112,14,14,C.card);cb0.strokes=[{type:"SOLID",color:C.bdr}];cb0.cornerRadius=2;
// Table rows
const contacts=[
{name:"李伟",email:"liwei@techcorp.com",phone:"+86 138-0013",ch:"WA",tags:["VIP","美国"],active:"2分钟前",status:"活跃"},
{name:"Emma Wilson",email:"emma@mail.com",phone:"+1 555-0123",ch:"FB",tags:["美国"],active:"15分钟前",status:"活跃"},
{name:"王思远",email:"wang@shop.cn",phone:"+86 139-0012",ch:"IG",tags:["新客户"],active:"1小时前",status:"活跃"},
{name:"Ahmed Hassan",email:"ahmed@biz.ae",phone:"+971 50-123",ch:"TG",tags:["中东"],active:"3小时前",status:"未活跃"},
{name:"张丽",email:"zhangli@co.cn",phone:"+86 136-1234",ch:"EM",tags:["VIP"],active:"1天前",status:"活跃"},
{name:"David Brown",email:"david@corp.uk",phone:"+44 20-7946",ch:"LC",tags:["英国"],active:"2天前",status:"活跃"},
{name:"Sophie Martin",email:"sophie@fr.com",phone:"+33 6-1234",ch:"WA",tags:["法国","新客户"],active:"3天前",status:"未活跃"},
{name:"Carlos Silva",email:"carlos@br.com",phone:"+55 11-9876",ch:"FB",tags:["巴西"],active:"1周前",status:"活跃"}
];
for(let i=0;i<contacts.length;i++){
const yy=140+i*56;const ct=contacts[i];
if(i%2===0)r(f,64,yy,1376,56,c(252,253,255),"rowBg");
line(f,64,yy+56,1376,C.bdr);
// Checkbox
const cb=rr(f,88,yy+20,14,14,C.card,2);cb.strokes=[{type:"SOLID",color:C.bdr}];
// Avatar+Name
ellipse(f,120,yy+12,32,32,c(180,160,230));t(f,126,yy+19,ct.name[0],14,C.w,"Bold");
t(f,160,yy+22,ct.name,12,C.td,"Medium");
t(f,340,yy+22,ct.email,11,C.ts,"Regular");
t(f,520,yy+22,ct.phone,11,C.ts,"Regular");
// Channel
const chMap={WA:"WA",FB:"FB",IG:"IG",TG:"TG",EM:"EM",LC:"LC"};
badge(f,680,yy+20,28,18,C.priL,chMap[ct.ch],C.pri,9);
// Tags
for(let j=0;j<ct.tags.length;j++){
const tagColors={VIP:C.pri,"美国":C.blu,"新客户":C.warn,"中东":c(180,83,9),"英国":C.blu,"法国":C.ok,"巴西":c(234,179,8)};
const bgColors={VIP:C.priL,"美国":C.bluL,"新客户":C.warnL,"中东":C.warnL,"英国":C.bluL,"法国":C.okL,"巴西":C.warnL};
badge(f,760+j*64,yy+20,ct.tags[j].length*14+12,18,bgColors[ct.tags[j]]||C.priL,ct.tags[j],tagColors[ct.tags[j]]||C.pri,9);
}
t(f,960,yy+22,ct.active,11,C.ts,"Regular");
badge(f,1120,yy+20,ct.status==="活跃"?48:60,18,ct.status==="活跃"?C.okL:C.inputBg,ct.status,ct.status==="活跃"?C.ok:C.tl,9);
}
// Pagination
r(f,64,860,1376,40,C.card,"pagination");line(f,64,860,1376,C.bdr);
t(f,88,870,"显示 1-8 / 共 1,247 位客户",11,C.ts,"Regular");
const pages=["<","1","2","3","...","156",">"];
for(let i=0;i<pages.length;i++){rr(f,1200+i*30,866,26,24,i===1?C.pri:C.card,4);t(f,1206+i*30,870,pages[i],11,i===1?C.w:C.ts,"Medium");}
return f;
}

// ===== SCREEN 3: CONTACT DETAIL =====
function createContactDetail(ox,oy){
const f=frame("3-ContactDetail",ox,oy);nav(f,1);
// Breadcrumb
r(f,64,0,1376,44,C.card,"breadcrumb");line(f,64,44,1376,C.bdr);
t(f,88,14,"客户管理",12,C.pri,"Medium");t(f,160,14,">",12,C.tl,"Regular");t(f,176,14,"李伟",12,C.td,"Medium");
// Left section
r(f,64,44,400,856,C.card,"leftSec");r(f,464,44,1,856,C.bdr);
ellipse(f,224,70,72,72,c(180,160,230),"bigAvatar");t(f,246,94,"李",20,C.w,"Bold");
t(f,230,154,"李伟",18,C.td,"Bold");
t(f,206,178,"liwei@techcorp.com",12,C.ts,"Regular");
t(f,224,196,"+86 138-0013",12,C.ts,"Regular");
btn(f,232,220,80,28,C.priL,"编辑",C.pri,11);
line(f,88,260,352,C.bdr);
// Custom fields
const cFields=[["公司","TechCorp Inc."],["地址","纽约 Main St 123号"],["语言","英语"],["时区","EST (UTC-5)"],["创建时间","2024年1月15日"],["来源","WhatsApp"]];
for(let i=0;i<cFields.length;i++){
t(f,88,280+i*36,cFields[i][0],11,C.ts,"Medium");
t(f,220,280+i*36,cFields[i][1],12,C.td,"Regular");
}
line(f,88,500,352,C.bdr);
t(f,88,516,"标签",13,C.td,"Semi Bold");
const dtags=[{t:"VIP",bg:C.priL,c:C.pri},{t:"企业客户",bg:C.bluL,c:C.blu},{t:"美国",bg:C.okL,c:C.ok}];
for(let i=0;i<dtags.length;i++)badge(f,88+i*90,542,dtags[i].t.length*14+12,22,dtags[i].bg,dtags[i].t,dtags[i].c,10);
btn(f,88,574,80,24,C.inputBg,"+ 添加标签",C.ts,10);

// Middle section - Activity Timeline
r(f,464,44,600,856,C.card,"midSec");r(f,1064,44,1,856,C.bdr);
t(f,488,60,"动态时间线",16,C.td,"Bold");
const events=[
{type:"msg",icon:"M",ic:C.pri,bg:C.priL,title:"通过WhatsApp发送消息",desc:"\"你好，我的订单有问题\"",time:"6月5日 10:23"},
{type:"order",icon:"O",ic:C.ok,bg:C.okL,title:"订单 #ORD-2024-5678 已下单",desc:"MacBook Pro 16\" - $2,499.00",time:"6月4日 15:15"},
{type:"tag",icon:"T",ic:C.warn,bg:C.warnL,title:"添加标签: VIP",desc:"由客服Sarah添加",time:"6月3日 11:00"},
{type:"msg",icon:"M",ic:C.pri,bg:C.priL,title:"邮件会话",desc:"\"感谢您的快速回复\"",time:"6月2日 14:45"},
{type:"note",icon:"N",ic:C.blu,bg:C.bluL,title:"添加备注",desc:"客户对批发价格感兴趣",time:"6月1日 9:30"},
{type:"msg",icon:"M",ic:C.pri,bg:C.priL,title:"在线客服会话",desc:"产品咨询 - 已解决",time:"5月28日 16:20"},
{type:"order",icon:"O",ic:C.ok,bg:C.okL,title:"订单 #ORD-2024-4321 已送达",desc:"iPhone Case x2 - $59.98",time:"5月25日 10:00"}
];
for(let i=0;i<events.length;i++){
const yy=100+i*96;
// Timeline line
if(i<events.length-1)r(f,504,yy+28,2,72,C.bdr,"tline");
ellipse(f,496,yy,20,20,events[i].bg);t(f,501,yy+4,events[i].icon,10,events[i].ic,"Bold");
t(f,524,yy,events[i].title,12,C.td,"Semi Bold");
t(f,524,yy+18,events[i].desc,11,C.ts,"Regular");
t(f,524,yy+36,events[i].time,10,C.tl,"Regular");
}

// Right section
r(f,1064,44,376,856,C.card,"rightSec");
t(f,1088,60,"快捷操作",14,C.td,"Semi Bold");
btn(f,1088,86,160,32,C.pri,"发送消息",C.w,12);
btn(f,1260,86,160,32,C.inputBg,"创建订单",C.ts,12);
btn(f,1088,126,160,32,C.inputBg,"添加备注",C.ts,12);
line(f,1088,170,332,C.bdr);
// Recent orders
t(f,1088,184,"最近订单",14,C.td,"Semi Bold");
const orders=[
{id:"#ORD-2024-5678",item:"MacBook Pro 16\"",price:"$2,499.00",status:"处理中"},
{id:"#ORD-2024-4321",item:"iPhone Case x2",price:"$59.98",status:"已送达"},
{id:"#ORD-2024-3210",item:"AirPods Pro",price:"$249.00",status:"已送达"}
];
for(let i=0;i<orders.length;i++){
const yy=210+i*72;
card(f,1088,yy,332,64);
t(f,1100,yy+10,orders[i].id,11,C.td,"Medium");
t(f,1100,yy+28,orders[i].item,11,C.ts,"Regular");
t(f,1100,yy+44,orders[i].price,12,C.ok,"Semi Bold");
badge(f,1340,yy+10,orders[i].status.length*14+12,18,orders[i].status==="已送达"?C.okL:C.warnL,orders[i].status,orders[i].status==="已送达"?C.ok:C.warn,9);
}
line(f,1088,440,332,C.bdr);
// Conversation summary
t(f,1088,456,"会话统计",14,C.td,"Semi Bold");
const stats=[["总会话数","12"],["平均响应","2.3分钟"],["满意度","4.8/5"],["待处理","1"]];
for(let i=0;i<stats.length;i++){
const yy=484+i*40;
t(f,1088,yy,stats[i][0],11,C.ts,"Regular");
t(f,1340,yy,stats[i][1],13,C.td,"Semi Bold");
}
return f;
}

// ===== SCREEN 4: CAMPAIGN LIST =====
function createCampaignList(ox,oy){
const f=frame("4-Campaigns",ox,oy);nav(f,2);
// Header
r(f,64,0,1376,56,C.card,"header");line(f,64,56,1376,C.bdr);
t(f,88,16,"营销群发",20,C.td,"Bold");
btn(f,1300,12,120,32,C.pri,"新建活动",C.w,12);
// Stats cards
const statsData=[
{label:"总发送量",value:"12,450",trend:"本月+2,100"},
{label:"打开率",value:"68.5%",trend:"环比+3.2%"},
{label:"点击率",value:"23.2%",trend:"环比+1.8%"},
{label:"回复率",value:"15.8%",trend:"环比+0.5%"}
];
for(let i=0;i<4;i++){
const xx=88+i*330;
card(f,xx,72,310,80);
t(f,xx+16,86,statsData[i].label,11,C.ts,"Medium");
t(f,xx+16,106,statsData[i].value,24,C.td,"Bold");
t(f,xx+160,116,statsData[i].trend,10,C.ok,"Medium");
}
// Campaign table header
r(f,88,172,1332,36,C.inputBg,"campaignHead");
const cCols=["活动名称","渠道","状态","受众","发送日期","打开率","点击率",""];
const cColX=[104,360,480,600,720,860,980,1100];
for(let i=0;i<cCols.length;i++)t(f,cColX[i],180,cCols[i],11,C.ts,"Semi Bold");
// Campaigns
const campaigns=[
{name:"夏季促销",ch:"WhatsApp",status:"进行中",aud:"3,200",date:"2024年6月1日",open:"72.3%",click:"28.5%"},
{name:"新品发布",ch:"Email",status:"已发送",aud:"8,500",date:"2024年5月28日",open:"65.1%",click:"19.2%"},
{name:"欢迎系列",ch:"WhatsApp",status:"进行中",aud:"1,250",date:"2024年5月20日",open:"78.9%",click:"34.1%"},
{name:"购物车挝回",ch:"SMS",status:"已排期",aud:"450",date:"2024年6月10日",open:"-",click:"-"},
{name:"二次触达",ch:"Email",status:"草稿",aud:"5,600",date:"-",open:"-",click:"-"},
{name:"周末闪购",ch:"Messenger",status:"已发送",aud:"2,100",date:"2024年5月15日",open:"61.4%",click:"21.7%"}
];
const statusColors={"进行中":C.ok,"已发送":C.blu,"已排期":C.warn,"草稿":C.tl};
const statusBg={"进行中":C.okL,"已发送":C.bluL,"已排期":C.warnL,"草稿":C.inputBg};
const chIcons={WhatsApp:"WA",Email:"EM",SMS:"SM",Messenger:"FB"};
for(let i=0;i<campaigns.length;i++){
const yy=208+i*56;const cm=campaigns[i];
if(i%2===0)r(f,88,yy,1332,56,c(252,253,255));
line(f,88,yy+56,1332,C.bdr);
t(f,104,yy+20,cm.name,12,C.td,"Medium");
badge(f,360,yy+20,28,18,C.priL,chIcons[cm.ch],C.pri,9);
t(f,392,yy+20,cm.ch,11,C.ts,"Regular");
badge(f,480,yy+18,cm.status.length*14+14,20,statusBg[cm.status],cm.status,statusColors[cm.status],10);
t(f,600,yy+20,cm.aud,11,C.td,"Regular");
t(f,720,yy+20,cm.date,11,C.ts,"Regular");
t(f,860,yy+20,cm.open,11,C.td,"Medium");
t(f,980,yy+20,cm.click,11,C.td,"Medium");
btn(f,1100,yy+16,60,24,C.inputBg,"查看",C.ts,10);
}
return f;
}

// ===== SCREEN 5: CAMPAIGN EDITOR =====
function createCampaignEditor(ox,oy){
const f=frame("5-CampaignEditor",ox,oy);
// Collapsed nav
r(f,0,0,64,900,C.nav,"nav");rr(f,16,16,32,32,C.pri,8);t(f,26,23,"S",14,C.w,"Bold");
for(let i=0;i<navLabels.length;i++){ellipse(f,22,80+i*56-16,20,20,i===2?C.pri:c(60,40,110));t(f,28,80+i*56-13,navLabels[i][0],10,C.w,"Medium");}
// Step indicator
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
const steps=["1. 受众","2. 内容","3. 排期","4. 审核"];
for(let i=0;i<4;i++){
const sx=300+i*200;
ellipse(f,sx,16,24,24,i===1?C.pri:i<1?C.ok:C.inputBg);
t(f,sx+6,20,String(i+1),12,i<=1?C.w:C.ts,"Bold");
t(f,sx+32,20,steps[i].substring(2),12,i===1?C.td:C.ts,i===1?"Semi Bold":"Regular");
if(i<3)r(f,sx+32+steps[i].length*10,28,200-steps[i].length*10-8,2,i<1?C.ok:C.bdr);
}
// Left panel - Audience
r(f,64,56,360,844,C.card);r(f,424,56,1,844,C.bdr);
t(f,88,76,"受众",16,C.td,"Bold");
t(f,88,104,"客户分群",11,C.ts,"Medium");
rr(f,88,122,320,36,C.card,6,"segSelect");
const seg=r(f,88,122,320,36,C.card);seg.cornerRadius=6;seg.strokes=[{type:"SOLID",color:C.bdr}];seg.fills=[];
t(f,100,130,"高价值客户",12,C.td,"Regular");
t(f,380,130,"v",10,C.ts,"Regular");
rr(f,88,176,320,60,C.priL,8);
t(f,108,186,"预计触达",11,C.pri,"Medium");
t(f,108,204,"3,200 位客户",18,C.pri,"Bold");
line(f,88,252,320,C.bdr);
t(f,88,268,"排除规则",13,C.td,"Semi Bold");
rr(f,88,292,320,32,C.inputBg,6);t(f,100,300,"排除: 已退订用户",11,C.ts,"Regular");
rr(f,88,332,320,32,C.inputBg,6);t(f,100,340,"排除: 退信邮箱",11,C.ts,"Regular");
btn(f,88,376,120,28,C.inputBg,"+ 添加规则",C.ts,11);

// Center panel - Content Editor
r(f,424,56,680,844,C.card);r(f,1104,56,1,844,C.bdr);
t(f,448,76,"消息内容",16,C.td,"Bold");
// Rich text toolbar
r(f,448,104,620,36,C.inputBg,"toolbar");
const tTools=["B","I","U","链接","列表","H1","H2"];
for(let i=0;i<tTools.length;i++)t(f,460+i*36,114,tTools[i],11,C.ts,"Medium");
// Template vars
t(f,448,152,"变量:",11,C.ts,"Medium");
const vars=["{name}","{order_id}","{company}","{link}"];
for(let i=0;i<vars.length;i++)badge(f,520+i*80,148,vars[i].length*7+8,22,C.priL,vars[i],C.pri,10);
// Editor area
rr(f,448,184,320,400,C.inputBg,8,"editorArea");
t(f,464,200,"你好 {name}！",14,C.td,"Semi Bold");
t(f,464,224,"我们很高兴地宣布",12,C.td,"Regular");
t(f,464,242,"夏季大促销，最高享5折优惠！",12,C.td,"Regular");
t(f,464,272,"您的专属优惠码: SUMMER24",12,C.td,"Medium");
t(f,464,302,"立即购物，省得更多！",12,C.td,"Regular");
t(f,464,332,"此致敬礼，",12,C.td,"Regular");
t(f,464,350,"SaleSmartly 团队",12,C.td,"Regular");
// Phone preview
rr(f,800,184,240,440,C.td,24,"phoneMock");
rr(f,808,220,224,396,C.card,4,"phoneScreen");
t(f,820,236,"预览",10,C.ts,"Medium");
line(f,820,252,200,C.bdr);
rr(f,820,264,180,120,C.okL,8);
t(f,830,272,"你好 Emma！",11,C.td,"Semi Bold");
t(f,830,290,"我们很高兴地宣布",10,C.td,"Regular");
t(f,830,304,"夏季大促销，最高",10,C.td,"Regular");
t(f,830,318,"享5折优惠！",10,C.td,"Regular");
t(f,830,340,"优惠码: SUMMER24",10,C.td,"Medium");
t(f,830,360,"立即购物，省得更多！",10,C.td,"Regular");

// Right panel
r(f,1104,56,336,844,C.card);
t(f,1128,76,"渠道",14,C.td,"Semi Bold");
const channels=["WhatsApp","Messenger","Email","SMS"];
for(let i=0;i<channels.length;i++){
rr(f,1128,104+i*44,296,36,i===0?C.priL:C.card,6);
if(i!==0){const bo=r(f,1128,104+i*44,296,36,C.card);bo.cornerRadius=6;bo.strokes=[{type:"SOLID",color:C.bdr}];bo.fills=[];}
ellipse(f,1140,112+i*44,20,20,i===0?C.pri:C.inputBg);
t(f,1168,112+i*44,channels[i],12,i===0?C.pri:C.ts,i===0?"Semi Bold":"Regular");
// toggle
rr(f,1380,112+i*44,36,20,i===0?C.pri:C.inputBg,10);
ellipse(f,i===0?1398:1382,114+i*44,16,16,C.w);
}
line(f,1128,288,296,C.bdr);
t(f,1128,304,"排期",14,C.td,"Semi Bold");
rr(f,1128,328,140,32,C.pri,6);t(f,1148,336,"立即发送",11,C.w,"Semi Bold");
rr(f,1280,328,140,32,C.card,6);const sch=r(f,1280,328,140,32,C.card);sch.cornerRadius=6;sch.strokes=[{type:"SOLID",color:C.bdr}];sch.fills=[];
t(f,1308,336,"定时发送",11,C.ts,"Regular");
line(f,1128,380,296,C.bdr);
t(f,1128,396,"A/B 测试",14,C.td,"Semi Bold");
rr(f,1380,396,36,20,C.inputBg,10);ellipse(f,1382,398,16,16,C.w);
t(f,1128,424,"将受众分为2组对照",11,C.ts,"Regular");
return f;
}

// ===== SCREEN 6: AUTOMATION LIST =====
function createAutomationList(ox,oy){
const f=frame("6-Automation",ox,oy);nav(f,3);
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
t(f,88,16,"自动化流程",20,C.td,"Bold");
btn(f,1280,12,140,32,C.pri,"新建流程",C.w,12);
// Tabs
const atabs=["全部","欢迎","购物车挝回","二次触达","自定义"];
for(let i=0;i<atabs.length;i++){
const tx=88+i*130;
t(f,tx,68,atabs[i],12,i===0?C.pri:C.ts,i===0?"Semi Bold":"Regular");
if(i===0)r(f,tx,84,atabs[i].length*14,2,C.pri);
}
// Workflow cards (2x3)
const workflows=[
{name:"欢迎系列",desc:"用个性化消息序列迎接新客户",trigger:"新客户",active:true,runs:"2,340",rate:"94%"},
{name:"购物车挝回",desc:"提醒客户购物车中的未付款商品",trigger:"购物车事件",active:true,runs:"1,567",rate:"67%"},
{name:"订单跟进",desc:"订单送达后发送满意度调查",trigger:"订单送达",active:true,runs:"890",rate:"88%"},
{name:"二次触达",desc:"召回30天未访问的客户",trigger:"不活跃",active:false,runs:"456",rate:"42%"},
{name:"VIP升级",desc:"客户达到VIP标准时发送通知",trigger:"消费阈值",active:true,runs:"234",rate:"91%"},
{name:"生日祝福",desc:"发送生日祝福和专属折扣",trigger:"日期匹配",active:false,runs:"789",rate:"85%"}
];
for(let i=0;i<6;i++){
const col=i%3,row=Math.floor(i/3);
const xx=88+col*440,yy=104+row*200;
const wf=workflows[i];
card(f,xx,yy,420,180);
t(f,xx+16,yy+16,wf.name,14,C.td,"Semi Bold");
t(f,xx+16,yy+38,wf.desc,11,C.ts,"Regular");
// Trigger
rr(f,xx+16,yy+64,wf.trigger.length*14+24,24,C.bluL,12);
t(f,xx+28,yy+68,wf.trigger,10,C.blu,"Medium");
// Toggle
rr(f,xx+340,yy+16,60,24,wf.active?C.ok:C.inputBg,12);
ellipse(f,wf.active?xx+378:xx+344,yy+20,16,16,C.w);
t(f,xx+340,yy+44,wf.active?"已启用":"未启用",10,wf.active?C.ok:C.tl,"Medium");
// Stats
line(f,xx+16,yy+100,388,C.bdr);
t(f,xx+16,yy+116,"执行次数",10,C.ts,"Medium");
t(f,xx+16,yy+134,wf.runs,16,C.td,"Bold");
t(f,xx+160,yy+116,"成功率",10,C.ts,"Medium");
t(f,xx+160,yy+134,wf.rate,16,C.td,"Bold");
btn(f,xx+320,yy+130,80,28,C.inputBg,"编辑",C.ts,10);
}
// Template section
line(f,88,520,1332,C.bdr);
t(f,88,540,"从模板开始",16,C.td,"Bold");
const templates=["欢迎流程","购物车挝回","购后跟进","客户召回"];
for(let i=0;i<4;i++){
const xx=88+i*330;
card(f,xx,570,310,80);
rr(f,xx+12,582,44,44,C.priL,8);t(f,xx+24,596,String(i+1),16,C.pri,"Bold");
t(f,xx+68,584,templates[i],13,C.td,"Semi Bold");
t(f,xx+68,604,"预设模板",11,C.ts,"Regular");
btn(f,xx+230,590,64,24,C.priL,"使用",C.pri,10);
}
return f;
}

// ===== SCREEN 7: FLOW EDITOR =====
function createFlowEditor(ox,oy){
const f=frame("7-FlowEditor",ox,oy);
// Collapsed nav
r(f,0,0,48,900,C.nav,"navCollapsed");rr(f,8,12,32,32,C.pri,8);t(f,18,19,"S",14,C.w,"Bold");
for(let i=0;i<navLabels.length;i++){ellipse(f,14,64+i*48,20,20,i===3?C.pri:c(60,40,110));t(f,20,67+i*48,navLabels[i][0],9,C.w,"Medium");}
// Top toolbar
r(f,48,0,1392,48,C.card);line(f,48,48,1392,C.bdr);
t(f,72,14,"< 返回",12,C.pri,"Medium");
rr(f,160,8,240,32,C.inputBg,6);t(f,176,16,"订单客服流程",12,C.td,"Medium");
btn(f,1120,10,60,28,C.inputBg,"保存",C.ts,11);
btn(f,1192,10,60,28,C.inputBg,"测试",C.ts,11);
btn(f,1264,10,80,28,C.pri,"发布",C.w,11);

// Canvas - Flow nodes
const canvasX=48,canvasY=48;
// Trigger node (blue rounded)
rr(f,340,80,200,56,C.bluL,28,"triggerNode");r(f,340,80,4,56,C.blu).cornerRadius=2;
t(f,360,90,"触发器",9,C.blu,"Bold");
t(f,360,106,"收到新消息",12,C.td,"Semi Bold");
// Arrow down
r(f,438,136,2,40,C.bdr);r(f,432,170,14,2,C.bdr);r(f,432,170,7,8,C.ts);
// Condition node (diamond-ish)
rr(f,340,180,200,60,C.warnL,8,"condNode");r(f,340,180,4,60,C.warn).cornerRadius=2;
t(f,360,190,"条件",9,C.warn,"Bold");
t(f,360,206,"包含关键词？",12,C.td,"Semi Bold");
// Yes branch - left
r(f,340,240,2,30,C.bdr);
t(f,316,248,"是",10,C.ok,"Medium");
// Action: Send Auto Reply
rr(f,240,274,200,56,C.priL,28,"actionNode1");r(f,240,274,4,56,C.pri).cornerRadius=2;
t(f,260,284,"动作",9,C.pri,"Bold");
t(f,260,300,"发送自动回复",12,C.td,"Semi Bold");
// Arrow down
r(f,338,330,2,30,C.bdr);
// Action: Assign to Agent
rr(f,240,364,200,56,C.priL,28,"actionNode2");r(f,240,364,4,56,C.pri).cornerRadius=2;
t(f,260,374,"动作",9,C.pri,"Bold");
t(f,260,390,"分配给客服",12,C.td,"Semi Bold");

// No branch - right
r(f,540,210,60,2,C.bdr);r(f,600,210,2,70,C.bdr);
t(f,548,198,"否",10,C.err,"Medium");
// Delay node
rr(f,500,274,200,56,C.warnL,28,"delayNode");r(f,500,274,4,56,C.warn).cornerRadius=2;
t(f,520,284,"延时",9,C.warn,"Bold");
t(f,520,300,"等待5分钟",12,C.td,"Semi Bold");
// Arrow down
r(f,598,330,2,30,C.bdr);
// Condition: Customer replied?
rr(f,500,364,200,60,C.warnL,8,"condNode2");r(f,500,364,4,60,C.warn).cornerRadius=2;
t(f,520,374,"条件",9,C.warn,"Bold");
t(f,520,390,"客户是否回复？",12,C.td,"Semi Bold");
// Arrow down from condition
r(f,598,424,2,30,C.bdr);
t(f,574,432,"否",10,C.err,"Medium");
// Action: Close Conversation
rr(f,500,458,200,56,C.errL,28,"closeNode");r(f,500,458,4,56,C.err).cornerRadius=2;
t(f,520,468,"动作",9,C.err,"Bold");
t(f,520,484,"关闭会话",12,C.td,"Semi Bold");
// Yes label from last condition
r(f,700,394,40,2,C.bdr);
t(f,710,382,"是",10,C.ok,"Medium");
rr(f,740,374,160,48,C.okL,28);r(f,740,374,4,48,C.ok).cornerRadius=2;
t(f,760,382,"动作",9,C.ok,"Bold");
t(f,760,396,"发送跟进消息",12,C.td,"Semi Bold");

// Right panel - Node properties
r(f,1140,48,300,852,C.card);r(f,1140,48,1,852,C.bdr);
t(f,1160,68,"节点属性",14,C.td,"Bold");
line(f,1160,92,260,C.bdr);
rr(f,1160,104,260,32,C.priL,6);
t(f,1176,112,"发送自动回复",12,C.pri,"Semi Bold");
t(f,1160,152,"类型",11,C.ts,"Medium");t(f,1280,152,"动作",11,C.td,"Regular");
t(f,1160,180,"渠道",11,C.ts,"Medium");t(f,1280,180,"与触发器相同",11,C.td,"Regular");
line(f,1160,206,260,C.bdr);
t(f,1160,220,"消息模板",12,C.td,"Semi Bold");
rr(f,1160,244,260,100,C.inputBg,6);
t(f,1172,256,"你好 {name}！感谢您",11,C.td,"Regular");
t(f,1172,274,"的来信。我们已收到",11,C.td,"Regular");
t(f,1172,292,"您的消息，将尽快",11,C.td,"Regular");
t(f,1172,310,"为您回复。",11,C.td,"Regular");
line(f,1160,360,260,C.bdr);
t(f,1160,376,"发送前延迟",11,C.ts,"Medium");
rr(f,1160,396,260,32,C.card,6,"delayInput");
const di=r(f,1160,396,260,32,C.card);di.cornerRadius=6;di.strokes=[{type:"SOLID",color:C.bdr}];di.fills=[];
t(f,1176,404,"0 秒",12,C.td,"Regular");
btn(f,1160,450,120,32,C.pri,"保存节点",C.w,11);
btn(f,1296,450,120,32,C.inputBg,"删除",C.err,11);
return f;
}

// ===== SCREEN 8: AI AGENT =====
function createAIAgent(ox,oy){
const f=frame("8-AIAgent",ox,oy);nav(f,4);
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
t(f,88,16,"AI 客服",20,C.td,"Bold");
badge(f,200,18,60,24,C.okL,"已启用",C.ok,11);

// Left - AI Settings
r(f,64,56,420,844,C.card);r(f,484,56,1,844,C.bdr);
t(f,88,76,"AI 配置",14,C.td,"Semi Bold");
t(f,88,106,"模型",11,C.ts,"Medium");
rr(f,88,124,380,36,C.card,6);const md=r(f,88,124,380,36,C.card);md.cornerRadius=6;md.strokes=[{type:"SOLID",color:C.bdr}];md.fills=[];
t(f,100,134,"GPT-4 Turbo",12,C.td,"Regular");t(f,440,134,"v",10,C.ts,"Regular");
t(f,88,176,"语言",11,C.ts,"Medium");
rr(f,88,194,380,36,C.card,6);const lg=r(f,88,194,380,36,C.card);lg.cornerRadius=6;lg.strokes=[{type:"SOLID",color:C.bdr}];lg.fills=[];
t(f,100,204,"自动识别(多语言)",12,C.td,"Regular");
t(f,88,246,"语气风格",11,C.ts,"Medium");
rr(f,88,264,380,36,C.card,6);const tn=r(f,88,264,380,36,C.card);tn.cornerRadius=6;tn.strokes=[{type:"SOLID",color:C.bdr}];tn.fills=[];
t(f,100,274,"专业友好",12,C.td,"Regular");
// Max tokens slider
t(f,88,316,"最大Token数",11,C.ts,"Medium");t(f,400,316,"2048",11,C.td,"Medium");
rr(f,88,336,380,6,C.inputBg,3);rr(f,88,336,260,6,C.pri,3);ellipse(f,342,332,14,14,C.pri);
// Temperature slider
t(f,88,368,"温度系数",11,C.ts,"Medium");t(f,400,368,"0.7",11,C.td,"Medium");
rr(f,88,388,380,6,C.inputBg,3);rr(f,88,388,200,6,C.pri,3);ellipse(f,282,384,14,14,C.pri);
// Toggles
line(f,88,420,380,C.bdr);
const toggles=[
{label:"自动回复消息",on:true},
{label:"转接人工客服",on:true},
{label:"从会话中学习",on:false},
{label:"显示置信度分数",on:true}
];
for(let i=0;i<toggles.length;i++){
const yy=440+i*44;
t(f,88,yy,toggles[i].label,12,C.td,"Regular");
rr(f,420,yy-2,36,20,toggles[i].on?C.pri:C.inputBg,10);
ellipse(f,toggles[i].on?438:422,yy,16,16,C.w);
}

// Center - Knowledge Base
r(f,484,56,480,844,C.card);r(f,964,56,1,844,C.bdr);
t(f,508,76,"知识库",14,C.td,"Semi Bold");
// Upload area
rr(f,508,104,440,100,C.card,8,"uploadArea");
const ua=r(f,508,104,440,100,C.card);ua.cornerRadius=8;ua.strokes=[{type:"SOLID",color:C.bdr}];ua.strokeWeight=2;ua.fills=[];ua.dashPattern=[8,4];
t(f,640,134,"拖拽文件到此处",13,C.ts,"Medium");
t(f,668,156,"或点击浏览",11,C.tl,"Regular");
// Stats
rr(f,508,220,210,48,C.priL,8);
t(f,520,230,"总文档数",10,C.pri,"Medium");
t(f,520,246,"24 个文件",16,C.pri,"Bold");
rr(f,728,220,220,48,C.okL,8);
t(f,740,230,"就绪",10,C.ok,"Medium");
t(f,740,246,"21 / 24",16,C.ok,"Bold");
// File list
const files=[
{name:"产品目录2024.pdf",status:"就绪",size:"2.4 MB"},
{name:"常见问题.docx",status:"就绪",size:"890 KB"},
{name:"退换货政策.pdf",status:"就绪",size:"1.1 MB"},
{name:"物流指南.pdf",status:"处理中",size:"3.2 MB"},
{name:"尺码表.xlsx",status:"错误",size:"456 KB"},
{name:"品牌规范.pdf",status:"就绪",size:"5.8 MB"}
];
const fStatusC={"就绪":C.ok,"处理中":C.warn,"错误":C.err};
const fStatusBg={"就绪":C.okL,"处理中":C.warnL,"错误":C.errL};
for(let i=0;i<files.length;i++){
const yy=284+i*48;
line(f,508,yy+48,440,C.bdr);
t(f,508,yy+10,files[i].name,12,C.td,"Regular");
t(f,508,yy+28,files[i].size,10,C.tl,"Regular");
badge(f,840,yy+10,files[i].status.length*14+12,18,fStatusBg[files[i].status],files[i].status,fStatusC[files[i].status],9);
}

// Right - Test Chat
r(f,964,56,476,844,C.card);
t(f,988,76,"测试对话",14,C.td,"Semi Bold");
line(f,988,100,432,C.bdr);
// Test messages
rr(f,988,120,280,36,C.inputBg,12);
t(f,1000,128,"你们的退换货政策是什么？",12,C.td,"Regular");
rr(f,1144,172,280,72,C.priL,12);
t(f,1156,180,"我们的退换货政策允许在",11,C.pri,"Regular");
t(f,1156,196,"购买后30天内退货。",11,C.pri,"Regular");
t(f,1156,212,"商品须未使用且保持",11,C.pri,"Regular");
t(f,1156,228,"原包装。",11,C.pri,"Regular");
badge(f,1156,250,100,18,C.okL,"置信度: 94%",C.ok,9);
rr(f,988,280,240,36,C.inputBg,12);
t(f,1000,288,"你们支持国际发货吗？",12,C.td,"Regular");
rr(f,1164,332,260,56,C.priL,12);
t(f,1176,340,"支持！我们发货到超50个国家。",11,C.pri,"Regular");
t(f,1176,356,"物流时间因地区而异，",11,C.pri,"Regular");
t(f,1176,372,"通常5-15个工作日。",11,C.pri,"Regular");
// Input
r(f,964,844,476,56,C.card);line(f,964,844,476,C.bdr);
rr(f,988,856,380,32,C.inputBg,6);
t(f,1000,864,"输入测试消息...",12,C.tl,"Regular");
btn(f,1380,856,44,32,C.pri,"发送",C.w,11);
return f;
}

// ===== SCREEN 9: ANALYTICS =====
function createAnalytics(ox,oy){
const f=frame("9-Analytics",ox,oy);nav(f,5);
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
t(f,88,16,"数据报表",20,C.td,"Bold");
// Date picker
rr(f,1240,12,180,32,C.card,6);const dp=r(f,1240,12,180,32,C.card);dp.cornerRadius=6;dp.strokes=[{type:"SOLID",color:C.bdr}];dp.fills=[];
t(f,1256,20,"6月1日 - 6月7日, 2024",11,C.td,"Regular");

// KPI Cards
const kpis=[
{label:"总会话数",value:"2,456",trend:"+12%",up:true},
{label:"平均响应时间",value:"45s",trend:"-8%",up:true},
{label:"满意度评分",value:"4.6/5",trend:"+3%",up:true},
{label:"解决率",value:"89%",trend:"+5%",up:true}
];
for(let i=0;i<4;i++){
const xx=88+i*330;
card(f,xx,72,310,88);
t(f,xx+16,86,kpis[i].label,11,C.ts,"Medium");
t(f,xx+16,110,kpis[i].value,28,C.td,"Bold");
badge(f,xx+200,86,kpis[i].trend.length*7+12,20,kpis[i].up?C.okL:C.errL,kpis[i].trend,kpis[i].up?C.ok:C.err,10);
}

// Charts area
// Left chart - Conversation Volume
card(f,88,180,660,320);
t(f,108,196,"会话量 - 7日趋势",14,C.td,"Semi Bold");
// Bar chart
const barData=[180,240,320,280,350,290,310];
const days=["周一","周二","周三","周四","周五","周六","周日"];
const maxBar=350,barW=60,barGap=24,chartBase=460,chartTop=240;
for(let i=0;i<7;i++){
const bh=Math.round((barData[i]/maxBar)*(chartBase-chartTop));
const bx=140+i*(barW+barGap);
rr(f,bx,chartBase-bh,barW,bh,C.pri,4);
t(f,bx+18,chartBase+8,days[i],10,C.ts,"Regular");
t(f,bx+14,chartBase-bh-16,String(barData[i]),10,C.td,"Medium");
}
// Y-axis labels
for(let i=0;i<=4;i++){
const yy=chartTop+i*55;
t(f,104,yy,String(350-i*87),9,C.tl,"Regular");
r(f,136,yy+5,580,1,C.bdr);
}

// Right chart - Channel Distribution
card(f,768,180,660,320);
t(f,788,196,"渠道分布",14,C.td,"Semi Bold");
// Colored rectangles as pie-chart substitute
const chData=[
{name:"WhatsApp",pct:"38%",val:"934",color:c(37,211,102)},
{name:"Messenger",pct:"24%",val:"589",color:c(24,119,242)},
{name:"Email",pct:"18%",val:"442",color:c(234,179,8)},
{name:"在线客服",pct:"12%",val:"295",color:C.pri},
{name:"Instagram",pct:"5%",val:"123",color:c(225,48,108)},
{name:"其他",pct:"3%",val:"73",color:C.tl}
];
// Stacked horizontal bar
const barTotalW=580;let barOffset=0;
for(let i=0;i<chData.length;i++){
const w=Math.round(parseInt(chData[i].pct)/100*barTotalW);
rr(f,788+barOffset,240,w,32,chData[i].color,i===0?4:i===chData.length-1?4:0);
barOffset+=w;
}
// Legend
for(let i=0;i<chData.length;i++){
const col=i%3,row=Math.floor(i/3);
const lx=788+col*200,ly=296+row*60;
r(f,lx,ly,12,12,chData[i].color);
t(f,lx+18,ly,chData[i].name,11,C.td,"Medium");
t(f,lx+18,ly+18,chData[i].pct+" ("+chData[i].val+")",11,C.ts,"Regular");
}

// Agent performance table
card(f,88,520,1340,360);
t(f,108,536,"客服绩效",14,C.td,"Semi Bold");
r(f,108,560,1300,32,C.inputBg);
const aCols=["客服","会话数","平均响应","CSAT","解决率"];
const aColX=[124,400,620,820,1020];
for(let i=0;i<aCols.length;i++)t(f,aColX[i],568,aCols[i],11,C.ts,"Semi Bold");
const agents=[
{name:"Sarah Johnson",conv:"456",resp:"32s",csat:"4.8",res:"92%"},
{name:"Mike Chen",conv:"389",resp:"41s",csat:"4.7",res:"90%"},
{name:"Ana Rodriguez",conv:"367",resp:"38s",csat:"4.6",res:"88%"},
{name:"James Wilson",conv:"312",resp:"52s",csat:"4.5",res:"86%"},
{name:"Priya Patel",conv:"298",resp:"45s",csat:"4.4",res:"85%"}
];
for(let i=0;i<agents.length;i++){
const yy=596+i*48;
line(f,108,yy+48,1300,C.bdr);
ellipse(f,124,yy+8,32,32,c(180,160,230));t(f,130,yy+15,agents[i].name[0],14,C.w,"Bold");
t(f,164,yy+18,agents[i].name,12,C.td,"Medium");
t(f,400,yy+18,agents[i].conv,12,C.td,"Regular");
t(f,620,yy+18,agents[i].resp,12,C.td,"Regular");
t(f,820,yy+18,agents[i].csat,12,C.td,"Regular");
t(f,1020,yy+18,agents[i].res,12,C.td,"Regular");
// Mini bar for resolution
rr(f,1070,yy+20,100,8,C.inputBg,4);
rr(f,1070,yy+20,parseInt(agents[i].res),8,C.ok,4);
}
return f;
}

// ===== SCREEN 10: CHANNELS =====
function createChannels(ox,oy){
const f=frame("10-Channels",ox,oy);nav(f,6);
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
t(f,88,16,"渠道集成",20,C.td,"Bold");
btn(f,1300,12,120,32,C.pri,"添加渠道",C.w,12);

// Channel cards (4x2)
const chs=[
{name:"WhatsApp Business",abbr:"WA",color:c(37,211,102),connected:true,msgs:"12,450"},
{name:"Facebook Messenger",abbr:"FB",color:c(24,119,242),connected:true,msgs:"8,230"},
{name:"Instagram DM",abbr:"IG",color:c(225,48,108),connected:true,msgs:"5,670"},
{name:"Telegram",abbr:"TG",color:c(0,136,204),connected:true,msgs:"3,120"},
{name:"LINE",abbr:"LN",color:c(6,199,85),connected:false,msgs:"0"},
{name:"Email",abbr:"EM",color:c(234,179,8),connected:true,msgs:"9,870"},
{name:"在线客服",abbr:"LC",color:C.pri,connected:true,msgs:"6,540"},
{name:"WeChat",abbr:"WC",color:c(9,187,7),connected:false,msgs:"0"}
];
for(let i=0;i<8;i++){
const col=i%4,row=Math.floor(i/4);
const xx=88+col*330,yy=76+row*200;
card(f,xx,yy,310,180);
// Channel icon
rr(f,xx+16,yy+16,48,48,chs[i].color,12);
t(f,xx+24,yy+28,chs[i].abbr,16,C.w,"Bold");
t(f,xx+76,yy+20,chs[i].name,14,C.td,"Semi Bold");
// Status
ellipse(f,xx+76,yy+44,8,8,chs[i].connected?C.ok:C.tl);
t(f,xx+90,yy+42,chs[i].connected?"已连接":"未连接",11,chs[i].connected?C.ok:C.tl,"Medium");
line(f,xx+16,yy+76,278,C.bdr);
t(f,xx+16,yy+92,"消息量",10,C.ts,"Medium");
t(f,xx+16,yy+110,chs[i].msgs,20,C.td,"Bold");
t(f,xx+120,yy+92,"状态",10,C.ts,"Medium");
badge(f,xx+120,yy+110,chs[i].connected?48:48,20,chs[i].connected?C.okL:C.inputBg,chs[i].connected?"启用":"停用",chs[i].connected?C.ok:C.tl,10);
btn(f,xx+200,yy+140,94,28,C.priL,"配置",C.pri,11);
}

// API & Webhook section
line(f,88,490,1332,C.bdr);
card(f,88,510,1340,160);
t(f,108,530,"API 与 Webhook 配置",16,C.td,"Bold");
t(f,108,556,"API 密钥",11,C.ts,"Medium");
rr(f,108,574,500,32,C.inputBg,6);
t(f,120,582,"sk-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",12,C.td,"Regular");
btn(f,620,574,80,32,C.inputBg,"复制",C.ts,10);
btn(f,710,574,100,32,C.inputBg,"重新生成",C.ts,10);
t(f,108,620,"Webhook 地址",11,C.ts,"Medium");
rr(f,108,638,500,32,C.inputBg,6);
t(f,120,646,"https://api.salesmartly.com/webhook/v1/...",12,C.td,"Regular");
btn(f,620,638,80,32,C.inputBg,"复制",C.ts,10);
btn(f,710,638,100,32,C.pri,"测试",C.w,10);
return f;
}

// ===== SCREEN 11: TEAM =====
function createTeam(ox,oy){
const f=frame("11-Team",ox,oy);nav(f,7);
r(f,64,0,1376,56,C.card);line(f,64,56,1376,C.bdr);
t(f,88,16,"团队管理",20,C.td,"Bold");
btn(f,1280,12,140,32,C.pri,"邀请成员",C.w,12);

// Table
r(f,88,72,1040,36,C.inputBg);
const tCols=["成员","邮箱","角色","状态","会话数","操作"];
const tColX=[104,340,540,700,860,980];
for(let i=0;i<tCols.length;i++)t(f,tColX[i],80,tCols[i],11,C.ts,"Semi Bold");
const members=[
{name:"Sarah Johnson",email:"sarah@company.com",role:"管理员",status:"在线",conv:"45"},
{name:"Mike Chen",email:"mike@company.com",role:"主管",status:"在线",conv:"38"},
{name:"Ana Rodriguez",email:"ana@company.com",role:"客服",status:"离开",conv:"32"},
{name:"James Wilson",email:"james@company.com",role:"客服",status:"离线",conv:"28"},
{name:"Priya Patel",email:"priya@company.com",role:"主管",status:"在线",conv:"35"},
{name:"Tom Baker",email:"tom@company.com",role:"客服",status:"在线",conv:"22"}
];
const statusDot={"在线":C.ok,"离开":C.warn,"离线":C.tl};
const roleBg={"管理员":C.priL,"主管":C.bluL,"客服":C.inputBg};
const roleC={"管理员":C.pri,"主管":C.blu,"客服":C.ts};
for(let i=0;i<members.length;i++){
const yy=112+i*56;const m=members[i];
if(i%2===0)r(f,88,yy,1040,56,c(252,253,255));
line(f,88,yy+56,1040,C.bdr);
ellipse(f,104,yy+12,32,32,c(180,160,230));t(f,110,yy+19,m.name[0],14,C.w,"Bold");
t(f,144,yy+22,m.name,12,C.td,"Medium");
t(f,340,yy+22,m.email,11,C.ts,"Regular");
badge(f,540,yy+20,m.role.length*14+12,22,roleBg[m.role],m.role,roleC[m.role],10);
ellipse(f,700,yy+24,8,8,statusDot[m.status]);
t(f,714,yy+22,m.status,11,C.td,"Regular");
t(f,860,yy+22,m.conv,12,C.td,"Regular");
t(f,980,yy+22,"编辑",11,C.pri,"Medium");
t(f,1020,yy+22,"|",11,C.bdr,"Regular");
t(f,1034,yy+22,"移除",11,C.err,"Medium");
}

// Right sidebar
r(f,1148,56,292,844,C.card);r(f,1148,56,1,844,C.bdr);
t(f,1168,76,"团队概览",14,C.td,"Semi Bold");
// Role cards
const roles=[{r:"管理员",n:"2",c:C.pri,bg:C.priL},{r:"主管",n:"3",c:C.blu,bg:C.bluL},{r:"客服",n:"8",c:C.ts,bg:C.inputBg}];
for(let i=0;i<3;i++){
const yy=104+i*72;
card(f,1168,yy,252,60);
rr(f,1176,yy+12,36,36,roles[i].bg,8);
t(f,1186,yy+20,roles[i].n,16,roles[i].c,"Bold");
t(f,1224,yy+16,roles[i].r,13,C.td,"Semi Bold");
t(f,1224,yy+34,roles[i].n+"位成员",10,C.ts,"Regular");
}
line(f,1168,330,252,C.bdr);
t(f,1168,346,"在线状态",14,C.td,"Semi Bold");
// Status summary
const statSum=[{s:"在线",n:"4",c:C.ok},{s:"离开",n:"1",c:C.warn},{s:"离线",n:"1",c:C.tl}];
for(let i=0;i<3;i++){
const yy=374+i*36;
ellipse(f,1168,yy+4,10,10,statSum[i].c);
t(f,1186,yy,statSum[i].s,12,C.td,"Regular");
t(f,1380,yy,statSum[i].n,13,C.td,"Semi Bold");
}
return f;
}

// ===== SCREEN 12: SETTINGS =====
function createSettings(ox,oy){
const f=frame("12-Settings",ox,oy);nav(f,7);
// Settings sidebar
r(f,64,0,240,900,C.card);r(f,304,0,1,900,C.bdr);
t(f,88,20,"设置",16,C.td,"Bold");
const sNavItems=["通用","通知","安全","账单","API","操作日志"];
for(let i=0;i<sNavItems.length;i++){
const yy=56+i*40;
if(i===0)rr(f,76,yy,216,32,C.priL,6);
t(f,92,yy+8,sNavItems[i],12,i===0?C.pri:C.ts,i===0?"Semi Bold":"Regular");
}

// Main content
r(f,304,0,1136,56,C.card);line(f,304,56,1136,C.bdr);
t(f,328,16,"通用设置",18,C.td,"Bold");

// Company Info
t(f,328,76,"公司信息",14,C.td,"Semi Bold");
line(f,328,100,1080,C.bdr);
t(f,328,116,"公司名称",11,C.ts,"Medium");
rr(f,328,136,400,36,C.card,6);const cn=r(f,328,136,400,36,C.card);cn.cornerRadius=6;cn.strokes=[{type:"SOLID",color:C.bdr}];cn.fills=[];
t(f,340,146,"SaleSmartly 科技有限公司",12,C.td,"Regular");
t(f,760,116,"Logo",11,C.ts,"Medium");
rr(f,760,136,120,60,C.card,6);const lo=r(f,760,136,120,60,C.card);lo.cornerRadius=6;lo.strokes=[{type:"SOLID",color:C.bdr}];lo.strokeWeight=2;lo.dashPattern=[6,4];lo.fills=[];
t(f,784,160,"上传",11,C.tl,"Medium");
t(f,328,188,"时区",11,C.ts,"Medium");
rr(f,328,208,400,36,C.card,6);const tz=r(f,328,208,400,36,C.card);tz.cornerRadius=6;tz.strokes=[{type:"SOLID",color:C.bdr}];tz.fills=[];
t(f,340,218,"(UTC-5) 美东时间",12,C.td,"Regular");

// Business Hours
t(f,328,268,"工作时间",14,C.td,"Semi Bold");
line(f,328,292,1080,C.bdr);
const bDays=["周一","周二","周三","周四","周五","周六","周日"];
for(let i=0;i<7;i++){
const yy=308+i*32;
t(f,328,yy,bDays[i],11,C.td,"Regular");
rr(f,500,yy-2,36,20,i<5?C.pri:C.inputBg,10);
ellipse(f,i<5?518:502,yy,16,16,C.w);
if(i<5){
t(f,550,yy,"09:00 - 18:00",11,C.ts,"Regular");
}else{
t(f,550,yy,"休息",11,C.tl,"Regular");
}
}

// Auto-reply
t(f,328,540,"自动回复消息",14,C.td,"Semi Bold");
line(f,328,564,1080,C.bdr);
t(f,328,580,"离线消息",11,C.ts,"Medium");
rr(f,328,600,600,60,C.card,6);const am=r(f,328,600,600,60,C.card);am.cornerRadius=6;am.strokes=[{type:"SOLID",color:C.bdr}];am.fills=[];
t(f,340,610,"感谢您的来信！我们当前不在线，",12,C.td,"Regular");
t(f,340,628,"将在24小时内为您回复。",12,C.td,"Regular");
t(f,328,674,"工作时间消息",11,C.ts,"Medium");
rr(f,328,694,600,40,C.card,6);const bm=r(f,328,694,600,40,C.card);bm.cornerRadius=6;bm.strokes=[{type:"SOLID",color:C.bdr}];bm.fills=[];
t(f,340,706,"您好！请问有什么可以帮到您的？",12,C.td,"Regular");

// Data section
t(f,328,752,"数据管理",14,C.td,"Semi Bold");
line(f,328,776,1080,C.bdr);
t(f,328,792,"数据保留",11,C.ts,"Medium");
rr(f,328,812,200,32,C.card,6);const dr=r(f,328,812,200,32,C.card);dr.cornerRadius=6;dr.strokes=[{type:"SOLID",color:C.bdr}];dr.fills=[];
t(f,340,820,"12个月",12,C.td,"Regular");t(f,504,820,"v",10,C.ts,"Regular");
btn(f,560,812,100,32,C.inputBg,"导出数据",C.ts,11);

// Danger zone
card(f,328,856,600,36);
const dz=r(f,328,856,600,36,C.card);dz.cornerRadius=8;dz.strokes=[{type:"SOLID",color:C.err}];dz.fills=[];
t(f,344,864,"危险操作:",11,C.err,"Semi Bold");
btn(f,740,860,160,28,C.card,"删除账户",C.err,11);
const db=r(f,740,860,160,28,C.card);db.cornerRadius=6;db.strokes=[{type:"SOLID",color:C.err}];db.fills=[];
t(f,770,866,"删除账户",11,C.err,"Semi Bold");
return f;
}

main();
