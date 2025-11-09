import{d as i}from"./DespatchCustomEvent-1b1c0d09.js";import{h as u}from"./KeyEventHandlers-211c5d42.js";const d=e=>{localStorage.setItem("language",e)},m=()=>localStorage.getItem("language")||"Fr",_=e=>{document.documentElement.classList.toggle("rtl",e==="Ar")},f=(e,t,n)=>{e.setAttribute("aria-expanded",n),t.setAttribute("aria-hidden",!n)},c=(e,t)=>{const n=t.classList.toggle("open");return f(e,t,n),n},L=(e,t)=>t.findIndex(n=>n.lang===e),p=(e,t)=>{const n=L(e,t);return t[n]},y=(e,t)=>t.filter(n=>n.lang!==e),A=e=>`
    <div class="lang">
      <p>${e.lang}</p>
      <img src="${e.flag}" alt="${e.lang} language" />
    </div>
  `,S=e=>`
    <li role="menuitem" class="lang__menu__item" tabindex="0">
      <div class="lang">
        <p>${e.lang}</p>
        <img src="${e.flag}" alt="${e.lang} language" />
      </div>
    </li>
  `,M=(e,t)=>{t.forEach(n=>{n.innerHTML=A(e)})},E=(e,t)=>{t.forEach(n=>{n.innerHTML=e.map(S).join("")})},h=e=>{d(e),_(e)},g=(e,t)=>{const n=p(t,e),a=y(t,e),o=document.querySelectorAll(".lang__menu"),s=document.querySelectorAll(".lang__btn");M(n,s),E(a,o),h(t)},q=(e,t)=>{var a;c(e,t),(a=Array.from(t.querySelectorAll(".lang__menu__item"))[1])==null||a.focus()},x=e=>e==null?void 0:e.querySelector("p").textContent,l=(e,t,n,a)=>{const o=Array.from(n.querySelectorAll(".lang__menu__item")),s=x(o[e]);g(a,s),c(t,n),t.focus(),i("set-locale",{lang:s})},I=(e,t,n,a)=>{const o=e.target.closest(".lang__menu__item");if(!o)return;const s=Array.from(n.querySelectorAll(".lang__menu__item")),r=s.indexOf(o);e.type==="keydown"?u(e,r,()=>l(r,t,n,a),s):e.type==="click"&&l(r,t,n,a)},v=(e,t)=>{const n=e.querySelector(".lang__menu"),a=e.querySelector(".lang__btn");if(!a)return;const o=m();g(t,o),a.addEventListener("click",()=>q(a,n));const s=r=>{I(r,a,n,t)};e.addEventListener("keydown",s),e.addEventListener("click",s)},$=()=>{const e=[{lang:"En",flag:"./assets/en.png"},{lang:"Fr",flag:"./assets/fr.png"},{lang:"Ar",flag:"./assets/ar.png"}];document.querySelectorAll(".lang__menu__container").forEach(n=>{v(n,e)})};export{$ as default};
