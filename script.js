const header=document.querySelector('.site-header');const menuButton=document.getElementById('menuButton');const mobileMenu=document.getElementById('mobileMenu');const contactForm=document.getElementById('contactForm');function updateHeader(){header.classList.toggle('scrolled',window.scrollY>12)}window.addEventListener('scroll',updateHeader);updateHeader();menuButton.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');menuButton.classList.toggle('active',open);document.body.classList.toggle('menu-open',open)});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menuButton.classList.remove('active');document.body.classList.remove('menu-open')}));document.querySelectorAll('.faq-item').forEach(item=>{const b=item.querySelector('button'),a=item.querySelector('div');b.addEventListener('click',()=>{const open=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(x=>{x.classList.remove('open');x.querySelector('div').style.maxHeight=null});if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+'px'}})});const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const button = contactForm.querySelector('.submit');
  const status = document.getElementById('formStatus');
  const originalText = button.textContent;

  contactForm.classList.add('is-sending');
  button.disabled = true;
  button.textContent = 'Sending enquiry…';
  status.classList.remove('success', 'error');
  status.textContent = 'Sending your enquiry securely…';

  try {
    const formData = new FormData(contactForm);
    const body = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      body.append(key, value);
    }

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) throw new Error('Submission failed');

    contactForm.reset();
    button.textContent = 'Enquiry sent ✓';
    status.textContent = 'Thank you — your enquiry has been sent to Elero Studio.';
    status.classList.add('success');

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.classList.remove('is-sending');
    }, 3500);
  } catch (error) {
    button.textContent = 'Try again';
    button.disabled = false;
    contactForm.classList.remove('is-sending');
    status.textContent = 'Something went wrong. Please call us on 07424 248552 or try again.';
    status.classList.add('error');
  }
});


// Subtle 3D hero tilt. Disabled on touch devices and for reduced-motion users.
const hero3d = document.getElementById('hero3d');
const hero3dScene = document.getElementById('hero3dScene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero3d && hero3dScene && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  hero3d.addEventListener('pointermove', event => {
    const rect = hero3d.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    hero3dScene.style.setProperty('--ry', `${x * 9}deg`);
    hero3dScene.style.setProperty('--rx', `${y * -7}deg`);
  });

  hero3d.addEventListener('pointerleave', () => {
    hero3dScene.style.setProperty('--ry', '0deg');
    hero3dScene.style.setProperty('--rx', '0deg');
  });
}
