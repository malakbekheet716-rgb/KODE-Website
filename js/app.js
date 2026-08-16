const content=document.getElementById('content'), toast=document.getElementById('toast'), drawer=document.getElementById('drawer'), modal=document.getElementById('modal');
let page='home', dark=false, arabic=false, filter='All Club';
let feedIndex=0;

const feedItems=[
  {type:'Club news',icon:'◫',title:'New Club Operating Schedule',dept:'All Club',time:'Posted 10 minutes ago',summary:'Updated operating hours and staff procedures are now available for every KODE employee.',details:'From Sunday, May 17, the club will open at 7:00 AM and close at 11:00 PM. Please review the updated handover, attendance and guest-support procedures before your next shift.',action:'Read announcement'},
  {type:'Department update',icon:'◌',title:'New Campaign Guidelines',dept:'Marketing Department',time:'Posted 1 hour ago',summary:'Please review the Q3 campaign guidelines and share your feedback with the Marketing team.',details:'The refreshed guidelines include audience segments, brand voice examples, the campaign calendar and the approval process. Your feedback is requested by Thursday at 3:00 PM.',action:'Open department update'},
  {type:'Event',icon:'◷',title:'KODE Staff Event',dept:'All Club',time:'Wednesday, May 20 · 3:00 PM',summary:'An afternoon for the full club team at the Main Stadium.',details:'Join the staff event at the Main Stadium from 3:00 PM to 6:00 PM. Light refreshments and team activities will be provided. Please confirm your attendance with your manager.',action:'View event'},
  {type:'Department event',icon:'◷',title:'Digital Marketing Training',dept:'Marketing Department',time:'Wednesday, May 27 · 11:00 AM',summary:'A practical workshop on the new digital campaign toolkit in Training Room 2.',details:'This Marketing-only session covers asset workflows, reporting dashboards and campaign handoff. Bring your laptop and the current campaign brief.',action:'View event'},
  {type:'Club update',icon:'▣',title:'Employee Handbook v2.1',dept:'All Club',time:'Updated 3 hours ago',summary:'The latest handbook includes updated safety and leave guidance.',details:'Version 2.1 clarifies the annual leave request process, emergency response roles and staff benefits. Please acknowledge the revised handbook by the end of the month.',action:'Open handbook'}
];

const notifications=[
 ['purple','◈','New announcement','Company-wide meeting on May 20 at 10:00 AM.','10m ago'],
 ['purple','◌','Marketing Department','New update posted in your department.','1h ago'],
 ['green','✓','Question answered','Your question has been answered by Ahmed Samy.','2h ago'],
 ['yellow','▣','Document updated','Employee Handbook was updated to v2.1.','3h ago']
];

function toastMsg(t,duration=2200){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),duration)}
function go(p){page=p;document.querySelectorAll('.nav[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===p));render()}
function stat(icon,n,label,cls){return `<div class="stat ${cls}"><div class="s-icon">${icon}</div><strong>${n}</strong><label>${label}</label><a href="#" onclick="event.preventDefault();toastMsg('Opening ${label}')">View ${label.toLowerCase()} →</a></div>`}
function head(k,sub){return `<div class="page-title">${k}</div><div class="sub">${sub}</div>`}
function newsCard(title,dept,desc,tag='New'){return `<div class="news-item"><div class="news-img"></div><div class="news-copy"><span class="pill ${dept==='Marketing'?'primary':''}">${dept}</span><h3>${title}</h3><p>${desc}</p><div class="meta">Marketing Department · 1h ago ${tag?`· <span class="pill new">${tag}</span>`:''}</div></div></div>`}
function eventRow(date,title,time,place,type){let [m,d]=date.split(' ');return `<div class="event"><div class="datebox"><small>${m}</small><b>${d}</b></div><div class="event-main"><b>${title}</b><span>◷ ${time} · ⌖ ${place}</span></div><span class="pill ${type==='Department'?'primary':''}">${type}</span></div>`}
function notificationHtml(){return notifications.map(n=>`<div class="notif"><div class="nicon ${n[0]}">${n[1]}</div><div><b>${n[2]}</b><p>${n[3]}</p><time>${n[4]}</time></div></div>`).join('')}
function feedDeck(){
 const item=feedItems[feedIndex], dots=feedItems.map((_,i)=>`<span class="feed-dot ${i===feedIndex?'active':''}"></span>`).join('');
 return `<section class="feed-section"><div class="section-head feed-heading"><div><span class="eyebrow">YOUR DAILY FEED</span><h2>Today at KODE</h2></div><span class="feed-count">${feedIndex+1} of ${feedItems.length}</span></div>
 <div class="feed-stage" id="feedStage" aria-label="Swipeable updates feed"><article class="feed-card" id="feedCard" tabindex="0"><div class="feed-top"><span class="feed-kind"><b>${item.icon}</b>${item.type}</span><span class="pill ${item.dept.includes('Marketing')?'primary':''}">${item.dept}</span></div><div class="feed-art"><span>${item.icon}</span><i>KODE</i></div><div class="feed-body"><time>${item.time}</time><h3>${item.title}</h3><p>${item.summary}</p></div><div class="feed-hint feed-hint-next">Next <b>←</b></div><div class="feed-hint feed-hint-open"><b>→</b> Details</div></article></div>
 <div class="feed-dots" aria-label="${feedItems.length} feed items">${dots}</div><p class="feed-instructions">Swipe left for the next update · Swipe right to open details</p></section>`;
}
function advanceFeed(){feedIndex=(feedIndex+1)%feedItems.length;render()}
function openFeedDetails(){const item=feedItems[feedIndex],action=item.dept.includes('Marketing')?"go('department')":`toastMsg('Opening ${item.action}')`;modal.classList.add('show');document.getElementById('modalBody').innerHTML=`<span class="pill ${item.dept.includes('Marketing')?'primary':''}">${item.dept}</span><h2 class="feed-modal-title">${item.title}</h2><p class="feed-modal-meta">${item.type} · ${item.time}</p><p class="feed-modal-copy">${item.details}</p><button class="btn" onclick="document.getElementById('closeModal').click();${action}">${item.action}</button>`}
function bindFeedSwipe(){const card=document.getElementById('feedCard');if(!card)return;let startX=0,deltaX=0,dragging=false;const reset=()=>{card.style.transform='';card.classList.remove('dragging')};const move=e=>{if(!dragging)return;deltaX=e.clientX-startX;card.style.transform=`translateX(${deltaX}px) rotate(${deltaX/28}deg)`};const finish=()=>{if(!dragging)return;dragging=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',cancel);if(deltaX<=-55){card.classList.add('leaving-left');setTimeout(advanceFeed,180)}else if(deltaX>=55){card.classList.add('leaving-right');setTimeout(openFeedDetails,180);setTimeout(reset,190)}else reset()};const cancel=()=>{dragging=false;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',cancel);reset()};card.addEventListener('pointerdown',e=>{startX=e.clientX;deltaX=0;dragging=true;card.classList.add('dragging');window.addEventListener('pointermove',move);window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',cancel)});card.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')advanceFeed();if(e.key==='ArrowRight')openFeedDetails()})}
function home(){
return `${feedDeck()}`;
}
function doc(i,t,s){return `<div class="doc"><div class="doc-icon">${i}</div><div class="doc-main"><b>${t}</b><span>${s}</span></div><span>›</span></div>`}
function quick(t,i){return `<button class="quick" onclick="toastMsg('Opening ${t}')"><div class="qicon">${i}</div><b>${t}</b><span>Open →</span></button>`}

function newsPage(){return `${head('News','Stay up to date with official club announcements and information relevant to your department.')}<div class="toolbar">${['All Club','Marketing'].map(x=>`<button class="filter ${filter===x?'active':''}" onclick="filter='${x}';render()">${x}</button>`).join('')}</div><div class="page-grid"><div class="card large-card"><div class="news-img" style="width:100%;height:150px"></div><span class="pill">All Club</span><h3>New Club Operating Schedule</h3><p>Updated operating hours and staff procedures are now available. Official club news does not have comments or chat.</p><button class="btn" onclick="toastMsg('Announcement opened')">Read announcement</button></div><div class="card large-card"><div class="news-img" style="width:100%;height:150px"></div><span class="pill primary">Marketing</span><h3>New Campaign Guidelines</h3><p>Department members can discuss this update and ask questions in the private department space.</p><button class="btn" onclick="go('department')">Discuss with department</button></div></div>`}

function eventsPage(){return `${head('Events','Your personalized calendar combines club events with events from your department.')}<div class="page-grid"><div class="card event-list">${eventRow('MAY 16','Marketing Team Meeting','10:00 AM - 11:30 AM','Marketing Room','Department')}${eventRow('MAY 20','KODE Staff Event','03:00 PM - 06:00 PM','Main Stadium','Club')}${eventRow('MAY 27','Digital Marketing Training','11:00 AM - 01:00 PM','Training Room 2','Department')}</div><div class="card calendar">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="day"><b>${d}</b></div>`).join('')}${Array.from({length:31},(_,i)=>`<div class="day"><b>${i+1}</b>${[16,20,27].includes(i+1)?'<small>● event</small>':''}</div>`).join('')}</div></div>`}

function departmentPage(){return `<div class="welcome"><div><div class="eyebrow">PRIVATE WORKSPACE</div><h1 class="page-title">Marketing Department</h1><p class="sub">Private content for employees assigned to Marketing. Other departments are not visible here.</p></div><button class="btn" onclick="openAsk()">+ Ask a question</button></div>
<div class="stat-grid">${stat('▤','8','Department Updates','purple')}${stat('▣','3','Upcoming Events','green')}${stat('?','12','Knowledge Base','blue')}${stat('◌','2','Open Questions','red')}</div>
<div class="two-col section"><div><div class="section-head"><h2>Department News</h2></div><div class="card news-list">${newsCard('New Campaign Guidelines','Marketing','Please review the new campaign guidelines for Q3 and share your feedback.')}${newsCard('Updated Brand Resources','Marketing','New logos, templates and brand assets are now available.','')}</div></div>
<div><div class="section-head"><h2>Ask Your Department</h2></div><div class="card form"><input id="q" placeholder="What do you need help with?"><textarea placeholder="Add more details (optional)"></textarea><button class="btn" onclick="ask()">Submit Question</button><small style="color:var(--muted)">Your question is visible only to Marketing employees and department admins.</small></div></div></div>
<div class="section-head"><h2>Department Questions</h2><span class="pill">Marketing only</span></div><div class="card qa">${qa('Where can I find the new campaign template?','Answered by Ahmed Samy · 1h ago','Answered')}${qa('When is the next team briefing?','2 replies · Today','Open')}${qa('How do I request new marketing materials?','Answered yesterday','Answered')}</div>`}
function qa(q,s,st){return `<div class="qa-row"><span class="pill ${st==='Answered'?'primary':''} status">${st}</span><h4>${q}</h4><p>${s}</p></div>`}

function resourcesPage(){return `${head('Resources','Policies, procedures, forms and department resources — filtered by your permissions.')}<div class="toolbar"><button class="filter active">All</button><button class="filter">Policies</button><button class="filter">Procedures</button><button class="filter">Forms</button><button class="filter">Marketing</button></div><div class="page-grid">${[['PDF','Employee Handbook v2.1','Policy','Updated 2h ago'],['DOC','Marketing Guidelines v3.0','Department','Updated 1d ago'],['PDF','Safety Procedures v2.4','Training','Updated 2d ago'],['FORM','Leave Request Form','Forms','Updated Aug 10'],['DOC','Brand Request Template','Marketing','Updated Aug 8'],['PDF','Emergency Procedure','Safety','Updated Aug 1']].map(x=>`<div class="card large-card"><div class="doc" style="border:0"><div class="doc-icon">${x[0]}</div><div class="doc-main"><b>${x[1]}</b><span>${x[2]} · ${x[3]}</span></div></div><button class="btn light" onclick="toastMsg('Document opened')">Open resource</button></div>`).join('')}</div>`}

function contactsPage(){return `${head('Who do I contact?','Find the right person without searching through the whole organization.')}<div class="card form" style="margin-bottom:14px"><input id="contactSearch" placeholder="Search by team, service or person..." oninput="contactFilter()"></div><div class="contact-grid" id="contacts">${[['HR','Payroll','Payroll Team'],['Tech','IT Support','IT Helpdesk'],['Operations','Operations Support','Operations Team'],['Security','Security Desk','Security Team'],['Food Safety','Food Safety','Food Safety Team'],['Marketing','Marketing Manager','Marketing Team']].map(c=>`<div class="card contact" data-key="${c.join(' ').toLowerCase()}"><span class="pill">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p><small style="color:var(--muted)">Available · Internal contact</small><br><br><button class="btn light" onclick="toastMsg('Contact options opened')">Contact</button></div>`).join('')}</div>`}
function faqsPage(){return `${head('FAQs','General answers plus questions relevant to your Marketing Department.')}<div class="page-grid">${[['General','How do I request annual leave?','Use the Leave Request Form in Resources.'],['General','Where can I find the employee handbook?','Open Resources → Policies.'],['Marketing','How do I request marketing materials?','Use the Marketing Request Form.'],['Marketing','Where are the brand guidelines?','Open My Department → Resources.']].map(f=>`<div class="card large-card"><span class="pill ${f[0]==='Marketing'?'primary':''}">${f[0]}</span><h3>${f[1]}</h3><p>${f[2]}</p><button class="view" onclick="toastMsg('Answer opened')">Read answer →</button></div>`).join('')}</div>`}
function feedbackPage(){return `${head('Employee Feedback','Your voice matters. Submit a suggestion, problem or improvement idea.')}<div class="two-col"><div class="card form"><select><option>Suggestion</option><option>Problem</option><option>Improvement idea</option><option>General feedback</option></select><textarea id="feedback" placeholder="Tell us what you think..."></textarea><label style="font-size:9px;color:var(--muted)"><input type="checkbox"> Submit anonymously</label><button class="btn" onclick="submitFeedback()">Submit Feedback</button></div><div class="card qa"><div class="qa-row"><span class="pill status">Under Review</span><h4>Improve staff event reminders</h4><p>Submitted Aug 12</p></div><div class="qa-row"><span class="pill primary status">In Progress</span><h4>More department templates</h4><p>Submitted Aug 5</p></div></div></div>`}
function recognitionPage(){return `${head('KODE Recognition','Celebrate colleagues who make a difference.')}<div class="page-grid">${[['AH','Ahmed Hassan','Great Teamwork!','Supported Operations during the weekend event.'],['SA','Sara Ali','Customer Excellence','Delivered an outstanding member experience.'],['OK','Omar Khaled','Innovation','Introduced a smarter team workflow.']].map(x=>`<div class="card large-card"><div style="display:flex;gap:10px;align-items:center"><div class="avatar">${x[0]}</div><div><b style="font-size:11px">${x[1]}</b><div><span class="pill primary">★ ${x[2]}</span></div></div></div><p>${x[3]}</p></div>`).join('')}</div><div class="section"><button class="btn" onclick="toastMsg('Recognition form opened')">Recognize a colleague</button></div>`}

function render(){
  const pages={home,news:newsPage,events:eventsPage,department:departmentPage,resources:resourcesPage,contacts:contactsPage,faqs:faqsPage,feedback:feedbackPage,recognition:recognitionPage};
  content.innerHTML=pages[page]();
  if(page==='home')bindFeedSwipe();
}
function contactFilter(){let q=document.getElementById('contactSearch').value.toLowerCase();document.querySelectorAll('.contact').forEach(x=>x.style.display=x.dataset.key.includes(q)?'block':'none')}
function ask(){let q=document.getElementById('q').value.trim();if(!q)return toastMsg('Please write your question first');toastMsg('Question submitted to Marketing')}
function submitFeedback(){if(!document.getElementById('feedback').value.trim())return toastMsg('Please add your feedback');toastMsg('Feedback submitted successfully')}
function openAsk(){go('department');setTimeout(()=>document.getElementById('q')?.focus(),50)}
function openNotifications(){document.getElementById('notificationList').innerHTML=notificationHtml();drawer.classList.add('show')}
document.querySelectorAll('.nav[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
document.getElementById('notifications').onclick=openNotifications;
document.getElementById('closeDrawer').onclick=()=>drawer.classList.remove('show');
function toggleAppearance(){dark=!dark;document.body.classList.toggle('dark',dark);localStorage.setItem('kode-mode',dark?'dark':'light');toastMsg(dark?'Dark mode enabled':'Light mode enabled',800)}
document.getElementById('theme').onclick=toggleAppearance;
document.getElementById('language').onclick=()=>{arabic=!arabic;document.documentElement.dir=arabic?'rtl':'ltr';document.body.classList.toggle('rtl',arabic);document.getElementById('language').innerHTML=arabic?'◉ AR ⌄':'◉ EN ⌄';toastMsg(arabic?'تم تفعيل العربية':'English enabled')};
document.getElementById('settings').onclick=()=>{modal.classList.add('show');document.getElementById('modalBody').innerHTML=`<h2 style="font-size:18px">Settings</h2><p style="color:var(--muted);font-size:11px">Personalize your KODE experience.</p><div class="form"><button class="btn light" onclick="document.getElementById('language').click();document.getElementById('closeModal').click()">Language · English / العربية</button><button class="btn light" onclick="document.getElementById('theme').click();document.getElementById('closeModal').click()">Appearance · Light / Dark</button><button class="btn light" onclick="toastMsg('Notification preferences opened');document.getElementById('closeModal').click()">Notification preferences</button></div>`};
document.getElementById('closeModal').onclick=()=>modal.classList.remove('show');
document.getElementById('logout').onclick=()=>toastMsg('Demo logout — connect authentication for production');
document.getElementById('mobileMenu').onclick=()=>document.querySelector('.sidebar').classList.toggle('mobile-open');
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter'){go('news');toastMsg('Showing searchable content')}})
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('search').focus()}})
render();


/* =========================================================
   KODE THEME SELECTOR
   ========================================================= */
const themeNames={
  default:'KODE Blue / Purple', ocean:'Ocean', emerald:'Emerald',
  sunset:'Sunset', rose:'Rose', indigo:'Indigo'
};
function setTheme(name){
  document.body.dataset.theme=name==='default'?'':name;
  localStorage.setItem('kode-theme',name);
  document.querySelectorAll('.theme-choice').forEach(x=>x.classList.toggle('active',x.dataset.theme===name));
  toastMsg(themeNames[name]+' theme enabled',800);
}
function openThemes(){
  modal.classList.add('show');
  const current=document.body.getAttribute('data-theme')||'default';
  document.getElementById('modalBody').innerHTML=`
    <h2 style="font-size:18px;margin:0">Appearance & Themes</h2>
    <p style="color:var(--muted);font-size:11px">Choose a palette, then choose its light or dark version.</p>
    <div class="theme-mode"><button class="theme-mode-choice ${!dark?'active':''}" onclick="if(dark)toggleAppearance()">☼ Light</button><button class="theme-mode-choice ${dark?'active':''}" onclick="if(!dark)toggleAppearance()">☾ Dark</button></div>
    <div class="theme-picker">
      <button class="theme-choice ${current==='default'?'active':''}" data-theme="default" onclick="setTheme('default')"><span class="theme-dot dot-default"></span>KODE Blue / Purple</button>
      <button class="theme-choice ${current==='ocean'?'active':''}" data-theme="ocean" onclick="setTheme('ocean')"><span class="theme-dot dot-ocean"></span>Ocean</button>
      <button class="theme-choice ${current==='emerald'?'active':''}" data-theme="emerald" onclick="setTheme('emerald')"><span class="theme-dot dot-emerald"></span>Emerald</button>
      <button class="theme-choice ${current==='sunset'?'active':''}" data-theme="sunset" onclick="setTheme('sunset')"><span class="theme-dot dot-sunset"></span>Sunset</button>
      <button class="theme-choice ${current==='rose'?'active':''}" data-theme="rose" onclick="setTheme('rose')"><span class="theme-dot dot-rose"></span>Rose</button>
      <button class="theme-choice ${current==='indigo'?'active':''}" data-theme="indigo" onclick="setTheme('indigo')"><span class="theme-dot dot-indigo"></span>Indigo</button>
    </div>
    <div style="margin-top:14px"><button class="btn light" onclick="document.getElementById('closeModal').click()">Done</button></div>`;
}
document.getElementById('themes').onclick=openThemes;
const savedTheme=localStorage.getItem('kode-theme')||'default';
if(savedTheme!=='default')document.body.setAttribute('data-theme',savedTheme);
dark=localStorage.getItem('kode-mode')==='dark';
document.body.classList.toggle('dark',dark);

/* =========================================================
   KODE BUDDY
   ========================================================= */
const petData={
  fox:{file:'fox.svg',name:'KODE Fox'},
  cat:{file:'cat.svg',name:'KODE Cat'},
  dog:{file:'dog.svg',name:'KODE Dog'},
  bull:{file:'bull.svg',name:'KODE Bull'},
  panda:{file:'panda.svg',name:'KODE Panda'},
  bunny:{file:'bunny.svg',name:'KODE Bunny'},
  penguin:{file:'penguin.svg',name:'KODE Penguin'},
  bear:{file:'bear.svg',name:'KODE Bear'}
};
let petKey=localStorage.getItem('kode-pet')||'dog';
let petPaused=false;

function applyPet(){
  const p=petData[petKey]||petData.dog;
  const img=document.getElementById('petImage');
  img.src='assets/mascots/'+p.file;
  img.alt=p.name;
  document.getElementById('petName').textContent=p.name;
}
function openPetPicker(){
  modal.classList.add('show');
  const current=petKey;
  document.getElementById('modalBody').innerHTML=`
    <h2 style="font-size:18px;margin:0">Choose your KODE Buddy</h2>
    <p style="color:var(--muted);font-size:11px">Pick a cute illustrated companion. It can wander from the edges, move between the top and bottom, and stay out of the way of your work.</p>
    <div class="pet-picker">
      ${Object.entries(petData).map(([k,p])=>`
        <button class="pet-option ${current===k?'active':''}" data-pet="${k}" onclick="choosePet('${k}')">
          <img src="assets/mascots/${p.file}" alt="${p.name}">
          ${p.name.replace('KODE ','')}
        </button>`).join('')}
    </div>
    <div style="margin-top:14px;display:flex;gap:7px;align-items:center">
      <button class="btn light" onclick="togglePetVisibilityExplicit()">Show / hide buddy</button>
      <button class="btn" onclick="document.getElementById('closeModal').click()">Done</button>
    </div>`;
}
function choosePet(k){
  petKey=k;
  localStorage.setItem('kode-pet',k);
  applyPet();
  document.querySelectorAll('.pet-option').forEach(x=>x.classList.toggle('active',x.dataset.pet===k));
  const el=document.querySelector('.pet-character');
  if(el){el.classList.remove('pet-bounce'); void el.offsetWidth; el.classList.add('pet-bounce')}
  toastMsg(petData[k].name+' selected');
}
function togglePet(){
  petPaused=!petPaused;
  const el=document.getElementById('petCompanion');
  el.classList.toggle('moving',!petPaused);
  document.getElementById('petPlay').textContent=petPaused?'▶':'Ⅱ';
  toastMsg(petPaused?'KODE Buddy paused':'KODE Buddy is wandering');
}
function togglePetVisibility(){
  const el=document.getElementById('petCompanion');
  el.classList.toggle('pet-hidden');
  localStorage.setItem('kode-pet-visible',el.classList.contains('pet-hidden')?'0':'1');
}
document.getElementById('petCustomize').onclick=openPetPicker;
document.getElementById('petPlay').onclick=togglePet;
applyPet();


/* =========================================================
   OPTIONAL BUDDY VISIBILITY
   ========================================================= */
function setPetVisibility(show){
  const buddy=document.getElementById('petCompanion');
  const controls=document.getElementById('petControls');
  const pill=document.getElementById('petShowPill');
  if(!buddy || !controls || !pill) return;
  buddy.classList.toggle('pet-hidden',!show);
  controls.classList.toggle('pet-hidden',!show);
  pill.classList.toggle('pet-hidden',show);
  localStorage.setItem('kode-pet-visible',show?'1':'0');
}
function togglePetVisibilityExplicit(){
  const buddy=document.getElementById('petCompanion');
  setPetVisibility(buddy.classList.contains('pet-hidden'));
  toastMsg(buddy.classList.contains('pet-hidden')?'KODE Buddy hidden':'KODE Buddy enabled');
}
const petToggle=document.getElementById('petToggle');
const petShowButton=document.getElementById('petShowButton');
if(petToggle) petToggle.onclick=togglePetVisibilityExplicit;
if(petShowButton) petShowButton.onclick=()=>setPetVisibility(true);

/* If the user has never made a choice, show the Buddy.
   If they previously hid it, respect that choice. */
const petVisibility=localStorage.getItem('kode-pet-visible');
setPetVisibility(petVisibility!=='0');
