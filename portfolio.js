/* script.js
   - profile card 3D tilt (smooth)
   - small accessibility: focus handling
*/

(function(){
  const card = document.getElementById('profileCard');
  if(!card) return;

  // follow mouse but with smoothing using requestAnimationFrame
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;
  const ease = 0.12; // smoothing (0.05 super smooth, 0.18 snappier)

  function onMove(e){
    const rect = card.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) - rect.width/2;
    mouseY = (e.clientY - rect.top) - rect.height/2;
  }

  function update(){
    // ease current towards mouse
    currentX += (mouseX - currentX) * ease;
    currentY += (mouseY - currentY) * ease;

    // map to degrees
    const rotateY = (currentX / (card.offsetWidth/2)) * 10; // +/- 10deg
    const rotateX = -(currentY / (card.offsetHeight/2)) * 10;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    requestAnimationFrame(update);
  }

  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseenter', () => card.classList.add('is-hover'));
  card.addEventListener('mouseleave', () => {
    mouseX = mouseY = currentX = currentY = 0;
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  });

  // start loop
  requestAnimationFrame(update);

  // Optional: small tilt from device orientation (mobile)
  if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', (ev) => {
      // gamma: left to right, beta: front to back
      if(ev.gamma == null) return;
      // scale down heavily to avoid wild rotations
      const g = Math.max(Math.min(ev.gamma, 30), -30);
      const b = Math.max(Math.min(ev.beta, 30), -30);
      mouseX = (g/30) * (card.offsetWidth/2) * 0.6;
      mouseY = (b/30) * (card.offsetHeight/2) * 0.6;
    }, true);
  }

})();
