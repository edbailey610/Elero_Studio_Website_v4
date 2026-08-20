const header=document.querySelector('.site-header');
const menuButton=document.getElementById('menuButton');
const mobileMenu=document.getElementById('mobileMenu');
const contactForm=document.getElementById('contactForm');

function updateHeader(){
  if(header) header.classList.toggle('scrolled',window.scrollY>12);
}
window.addEventListener('scroll',updateHeader,{passive:true});
updateHeader();

if(menuButton && mobileMenu){
  menuButton.addEventListener('click',()=>{
    const open=mobileMenu.classList.toggle('open');
    menuButton.classList.toggle('active',open);
    document.body.classList.toggle('menu-open',open);
  });

  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    menuButton.classList.remove('active');
    document.body.classList.remove('menu-open');
  }));
}

document.querySelectorAll('.faq-item').forEach(item=>{
  const b=item.querySelector('button');
  const a=item.querySelector('div');
  if(!b || !a) return;

  b.addEventListener('click',()=>{
    const open=item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(x=>{
      x.classList.remove('open');
      const panel=x.querySelector('div');
      if(panel) panel.style.maxHeight=null;
    });

    if(!open){
      item.classList.add('open');
      a.style.maxHeight=a.scrollHeight+'px';
    }
  });
});

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),{threshold:.12,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else{
  document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
}

if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();

    const button=contactForm.querySelector('.submit');
    const status=document.getElementById('formStatus');
    if(!button || !status) return;

    const originalText=button.textContent;

    contactForm.classList.add('is-sending');
    button.disabled=true;
    button.textContent='Sending enquiry…';
    status.classList.remove('success','error');
    status.textContent='Sending your enquiry securely…';

    try{
      const formData=new FormData(contactForm);
      const body=new URLSearchParams();

      for(const [key,value] of formData.entries()){
        body.append(key,value);
      }

      const response=await fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:body.toString()
      });

      if(!response.ok) throw new Error('Submission failed');

      contactForm.reset();
      button.textContent='Enquiry sent ✓';
      status.textContent='Thank you — your enquiry has been sent to Elero Studio.';
      status.classList.add('success');

      setTimeout(()=>{
        button.textContent=originalText;
        button.disabled=false;
        contactForm.classList.remove('is-sending');
      },3500);
    }catch(error){
      button.textContent='Try again';
      button.disabled=false;
      contactForm.classList.remove('is-sending');
      status.textContent='Something went wrong. Please call us on 07424 248552 or try again.';
      status.classList.add('error');
    }
  });
}


/* ==========================================================
   HERO 3D — ORIGINAL CURSOR FEEL + SAFE SCROLL PARALLAX
   ========================================================== */

const hero=document.querySelector('.hero');
const hero3d=document.getElementById('hero3d');
const hero3dScene=document.getElementById('hero3dScene');
const browser=hero3dScene?.querySelector('.browser');
const cardOne=hero3dScene?.querySelector('.float-card.one');
const cardTwo=hero3dScene?.querySelector('.float-card.two');
const planeOne=hero3dScene?.querySelector('.plane-one');
const planeTwo=hero3dScene?.querySelector('.plane-two');
const chipOne=hero3dScene?.querySelector('.depth-chip-one');
const chipTwo=hero3dScene?.querySelector('.depth-chip-two');
const glowA=document.querySelector('.glow-a');
const glowB=document.querySelector('.glow-b');

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=window.matchMedia('(pointer:fine)').matches;

if(hero && hero3d && hero3dScene && !reduceMotion){
  let pointerX=0;
  let pointerY=0;
  let scrollProgress=0;
  let ticking=false;

  const clamp=(value,min,max)=>Math.min(Math.max(value,min),max);

  function render3D(){
    ticking=false;

    /* EXACT same cursor tilt strength as the original version */
    hero3dScene.style.setProperty('--ry',`${pointerX*9}deg`);
    hero3dScene.style.setProperty('--rx',`${pointerY*-7}deg`);

    /* Scroll gently adds to the scene instead of replacing cursor movement */
    hero3dScene.style.setProperty('--scroll-rx',`${scrollProgress*5}deg`);
    hero3dScene.style.setProperty('--scroll-ry',`${scrollProgress*-3}deg`);
    hero3dScene.style.setProperty('--scroll-y',`${scrollProgress*-34}px`);
    hero3dScene.style.setProperty('--scroll-z',`${scrollProgress*-55}px`);
    hero3dScene.style.setProperty('--scene-scale',String(1-scrollProgress*.035));
    hero3dScene.style.setProperty('--scene-opacity',String(1-scrollProgress*.16));

    /* These values are fully calculated in JS, avoiding invalid CSS maths */
    if(browser){
      browser.style.setProperty('--browser-x',`${pointerX*5}px`);
      browser.style.setProperty('--browser-y',`${scrollProgress*14 + pointerY*3}px`);
      browser.style.setProperty('--browser-z',`${55-scrollProgress*18}px`);
      browser.style.setProperty('--browser-rz',`${1+scrollProgress*1.1}deg`);
    }

    if(cardOne){
      cardOne.style.setProperty('--fc1-x',`${pointerX*15-scrollProgress*10}px`);
      cardOne.style.setProperty('--fc1-y',`${pointerY*12+scrollProgress*36}px`);
      cardOne.style.setProperty('--fc1-r',`${scrollProgress*-3}deg`);
    }

    if(cardTwo){
      cardTwo.style.setProperty('--fc2-x',`${pointerX*-12+scrollProgress*12}px`);
      cardTwo.style.setProperty('--fc2-y',`${pointerY*-9-scrollProgress*25}px`);
      cardTwo.style.setProperty('--fc2-r',`${scrollProgress*3}deg`);
    }

    if(planeOne){
      planeOne.style.setProperty('--p1-x',`${pointerX*-8-scrollProgress*15}px`);
      planeOne.style.setProperty('--p1-y',`${pointerY*-6+scrollProgress*30}px`);
    }

    if(planeTwo){
      planeTwo.style.setProperty('--p2-x',`${pointerX*10+scrollProgress*17}px`);
      planeTwo.style.setProperty('--p2-y',`${pointerY*7-scrollProgress*26}px`);
    }

    if(chipOne){
      chipOne.style.setProperty('--chip1-x',`${pointerX*9}px`);
      chipOne.style.setProperty('--chip1-y',`${pointerY*7+scrollProgress*24}px`);
    }

    if(chipTwo){
      chipTwo.style.setProperty('--chip2-x',`${pointerX*-11}px`);
      chipTwo.style.setProperty('--chip2-y',`${pointerY*-8-scrollProgress*20}px`);
    }

    if(glowA){
      glowA.style.setProperty('--gx',`${pointerX*24-scrollProgress*18}px`);
      glowA.style.setProperty('--gy',`${pointerY*18+scrollProgress*24}px`);
    }

    if(glowB){
      glowB.style.setProperty('--gx',`${pointerX*-18+scrollProgress*15}px`);
      glowB.style.setProperty('--gy',`${pointerY*-12-scrollProgress*14}px`);
    }
  }

  function requestRender(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(render3D);
  }

  if(finePointer){
    /* Listen on the full hero, not only the mockup area.
       This makes it follow the cursor across the whole hero again. */
    hero.addEventListener('pointermove',event=>{
      const rect=hero.getBoundingClientRect();
      pointerX=clamp((event.clientX-rect.left)/rect.width-.5,-.5,.5);
      pointerY=clamp((event.clientY-rect.top)/rect.height-.5,-.5,.5);
      requestRender();
    });

    hero.addEventListener('pointerleave',()=>{
      pointerX=0;
      pointerY=0;
      requestRender();
    });
  }

  function updateScroll(){
    const rect=hero.getBoundingClientRect();
    const travelled=Math.max(0,-rect.top);
    const range=Math.max(hero.offsetHeight*.85,1);
    scrollProgress=clamp(travelled/range,0,1);
    requestRender();
  }

  window.addEventListener('scroll',updateScroll,{passive:true});
  window.addEventListener('resize',updateScroll);

  updateScroll();
  render3D();
}
