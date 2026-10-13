// نسخة العرض: قاعدة بيانات وهمية داخل المتصفح (localStorage) بدل Firebase وCloudinary
(function(){
  const KEY='demo_db_v1';
  const svg=(t,c)=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420"><rect width="600" height="420" fill="${c}"/><text x="300" y="225" font-size="42" font-family="Cairo,Arial" fill="#fff" text-anchor="middle">${t}</text></svg>`);
  const now=Date.now(), mk=(o,i)=>({...o,time:now-i*3600000});
  const seed=()=>({
    ticker:{a:mk({text:'أهلاً بكم في منصة نشاط الطالبات — مدرسة النور الابتدائية (نسخة عرض)'},0),b:mk({text:'ننشط .. نتعلم .. نتطور'},1),c:mk({text:'التسجيل مفتوح في برنامج الإذاعة المدرسية'},2)},
    heroBubble:'أهلاً بكِ في عالم النشاط!',
    visitCount:128,
    announcementsLive:{a:mk({title:'انطلاق أسبوع النشاط الطلابي',date:'الأحد'},0),b:mk({title:'اجتماع أولياء الأمور',date:'الثلاثاء'},1)},
    parentAnnounce:{a:mk({title:'ورشة «القراءة مع طفلي» لأولياء الأمور',date:'الخميس'},0)},
    parentComments:{a:mk({name:'أم سارة',text:'برامج رائعة، شكراً لكم على الجهود.'},0)},
    comments:{a:mk({name:'معلمة',text:'منصة مرتبة وسهلة الاستخدام.'},0),b:mk({name:'طالبة',text:'أحب الأنشطة كثيراً!'},1)},
    studentsLive:{a:mk({name:'لينا محمد',grade:'الصف الخامس',achievement:'المركز الأول في مسابقة الخط'},0),b:mk({name:'جود أحمد',grade:'الصف الرابع',achievement:'طالبة الأسبوع المتميزة'},1),c:mk({name:'ريماس خالد',grade:'الصف السادس',achievement:'قائدة الإذاعة المدرسية'},2)},
    importantFiles:{a:mk({name:'الخطة الفصلية (نموذج)',url:'#'},0),b:mk({name:'نموذج مشاركة في نشاط',url:'#'},1)},
    galleryPhotos:{a:mk({url:svg('فعالية ١','#12355B')},0),b:mk({url:svg('فعالية ٢','#14A38B')},1),c:mk({url:svg('فعالية ٣','#FF7A59')},2),d:mk({url:svg('فعالية ٤','#2B5C94')},3)}
  });
  let db; try{db=JSON.parse(localStorage.getItem(KEY));}catch(e){}
  if(!db){db=seed();}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));}catch(e){}};
  const parts=p=>p.replace(/^\/+|\.json$/g,'').split('/').filter(Boolean);
  const get=(p)=>parts(p).reduce((o,k)=>o==null?null:(o[k]===undefined?null:o[k]),db);
  const rid=()=>'-'+Math.random().toString(36).slice(2,10);
  const real=window.fetch.bind(window);
  const json=(v)=>Promise.resolve(new Response(JSON.stringify(v),{status:200,headers:{'Content-Type':'application/json'}}));
  window.fetch=async function(url,opt){
    url=String(url); opt=opt||{};
    const m=(opt.method||'GET').toUpperCase();
    if(url.includes('firebaseio.invalid')){
      const path=new URL(url).pathname, ks=parts(path);
      if(m==='GET') return json(get(path));
      let body=opt.body?JSON.parse(opt.body):null;
      if(m==='DELETE'){ const par=ks.slice(0,-1).reduce((o,k)=>o&&o[k],db); if(par) delete par[ks[ks.length-1]]; save(); return json(null); }
      let ref=db; ks.slice(0,-1).forEach(k=>{ref=ref[k]=ref[k]||{};});
      const last=ks[ks.length-1];
      if(m==='POST'){ const id=rid(); ref[last]=ref[last]||{}; ref[last][id]=body; save(); return json({name:id}); }
      if(m==='PUT'){ if(body&&body['.sv']){ body=(Number(ref[last])||0)+body['.sv'].increment; } ref[last]=body; save(); return json(body); }
    }
    if(url.includes('api.cloudinary.com')){
      const f=opt.body&&opt.body.get&&opt.body.get('file');
      const u=await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f);});
      return json({secure_url:u});
    }
    if(url.includes('api.github.com')||url.includes('example.invalid')) return json([]);
    return real(url,opt);
  };
  // شريط نسخة العرض
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.createElement('div');
    b.style.cssText='position:fixed;bottom:12px;left:12px;z-index:9999;background:#222;color:#fff;padding:10px 14px;border-radius:12px;font:600 13px Cairo,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3);display:flex;gap:10px;align-items:center;direction:rtl';
    const on=localStorage.getItem('nashat_admin')==='1';
    b.innerHTML='<span>نسخة عرض تجريبية</span><button id="demoAdm" style="border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font:inherit">'+(on?'إيقاف وضع الإدارة':'تجربة وضع الإدارة')+'</button><button id="demoRst" style="border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font:inherit">إعادة ضبط</button>';
    document.body.appendChild(b);
    document.getElementById('demoAdm').onclick=()=>{on?localStorage.removeItem('nashat_admin'):localStorage.setItem('nashat_admin','1');location.reload();};
    document.getElementById('demoRst').onclick=()=>{localStorage.removeItem(KEY);localStorage.removeItem('nashat_admin');location.reload();};
  });
})();
