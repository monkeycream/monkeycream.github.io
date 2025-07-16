const touchesMap = new Map();
const TOUCH_LIMIT = 10;

const COLORS = new Set([
  'hsl(0, 80%, 50%)',
  'hsl(20, 70%, 40%)',
  'hsl(30, 90%, 55%)',
  'hsl(50, 90%, 55%)',
  'hsl(90, 80%, 50%)',
  'hsl(140, 70%, 45%)',
  'hsl(190, 70%, 50%)',
  'hsl(220, 90%, 55%)',
  'hsl(270, 60%, 60%)',
  'hsl(330, 70%, 60%)',
]);

const COLORS2 = new Set([
  'hsl(0, 100%, 40%)',    // Rosso carminio
  'hsl(15, 80%, 35%)',    // Marrone ruggine
  'hsl(30, 100%, 45%)',   // Arancione scuro
  'hsl(45, 100%, 50%)',   // Giallo oro
  'hsl(80, 70%, 45%)',    // Verde oliva brillante
  'hsl(150, 60%, 35%)',   // Verde foresta
  'hsl(195, 80%, 40%)',   // Turchese scuro
  'hsl(210, 100%, 35%)',  // Blu navy
  'hsl(280, 60%, 40%)',   // Viola melanzana
  'hsl(340, 80%, 55%)',    // Rosa corallo
]);

// const COLORS = new Set((new Array(TOUCH_LIMIT)).fill(0).map((_, idx) =>
// {
//   let h = Math.round(idx*(360 / TOUCH_LIMIT));
//   return `hsl(${h}, 80%, 60%)`;
// }));

const ctx = {
  colors:new Set(COLORS),
  teamCount:0,
  figerCount:1,
};


function canCreateCircle()
{
  return touchesMap.size < TOUCH_LIMIT;
}

function printCtx()
{
  document.getElementById('ctx_debug').innerHTML = `ctx.colors=#${ctx.colors?.length || 0}, touchesMap=#${touchesMap.size}, ctx.result=${ctx.result}, canCreateCircle()=${canCreateCircle()}`;
}

function pickColor()
{
  const colorSize = ctx.colors.size;
  if (colorSize > 0)
  {
    let c;
    if (colorSize > 1)
    {
      let i = Math.round(Math.random() * (colorSize - 1)); 
      for (let x of ctx.colors.values())
      {
        if (i > 0)
        {
          i--;
        }
        else
        {
          c = x;
          break;
        }
      }
    }
    else
    {
      c = ctx.colors.values().next();
    }
    ctx.colors.delete(c);
    return c;
  }
  else
  {
    console.error('no colors left');
  }
}

function stopTimer()
{
  clearTimeout(ctx.runningTimer);
  clearTimeout(ctx.runningInterval);
  delete ctx.runningTimer;
  delete ctx.runningInterval;

  document.getElementById('testissimo').innerHTML = '';
  printCtx();
}


function pickFromIds(ids, n)
{
  const pickedCircles = new Map();
  for (let i = 0; i < n; i++)
  {
    const idx = Math.round(Math.random() * (ids.length - 1));
    const [id] = ids.splice(idx, 1);
    const circle = touchesMap.get(id);
    pickedCircles.set(id, circle);
  }
  return pickedCircles;
}

function timerEnd()
{
  stopTimer()
  document.getElementById('testissimo').innerHTML = 'ABEMUS TEAM!!!!!';
  ctx.result = 'done';
  
  const { teamCount, figerCount } = ctx;
  
  let pickedCircles = new Map();
  const ids = Array.from(touchesMap.keys());
  if (figerCount > 0)
  {
    pickedCircles = pickFromIds(ids, figerCount);
    Array.from(touchesMap.entries()).forEach(([id, circle]) =>
    {
      if (pickedCircles.get(id))
      {
        circle.classList.add('pulse-circle');
      }
      else
      {
        circle.remove();
      }
    });
  }
  else if (teamCount > 0)
  {
    let fingers = touchesMap.size;
    const teamFingers = Math.trunc(fingers / teamCount);
    let d = fingers % teamCount;
    for (let i = 0; i < teamCount; i++)
    {
      const pickedTeam = pickFromIds(ids, teamFingers + d);
      pickedCircles.set(`team_${i+1}`, pickedTeam);
      if (d > 0)
      {
        d--;
      }
    }
    Array.from(pickedCircles.entries()).forEach(([teamId, team]) =>
    {
      let teamColor;
      Array.from(team.entries()).forEach(([id, circle]) =>
      {
        if (teamColor)
        {
          circle.style.backgroundColor = teamColor;
        }
        else
        {
          teamColor = circle.style.backgroundColor + '';
        }
      });
    });
  }
}

function isFingerSizeValid()
{
  let r = false
  const fingers = touchesMap.size;
  const { teamCount, figerCount } = ctx;
  if (fingers > 1 && (teamCount > 0 || figerCount > 0))
  {
    if (teamCount > 0)
    {
      r = (fingers / teamCount ) > 0;
    }
    else if (figerCount > 0)
    {
      r = fingers > figerCount;
    }
  }
  return r;
}

function restartTimer()
{
  stopTimer()
  if (isFingerSizeValid())
  {
    ctx.runningTimer = setTimeout(() =>
    {
      timerEnd();
    }, 1000 * 3);
    let str = '+++';
    document.getElementById('testissimo').innerHTML = str;
    ctx.runningInterval = setInterval(() =>
    {
      str = str.substring(1);
      document.getElementById('testissimo').innerHTML = str;
    }, 1000);
  }
}

// Funzione per creare un nuovo cerchio per un touch
function createCircle(id, x, y)
{
  if (ctx.result === 'done')
  {
    return;
  }
  if (!canCreateCircle())
  {
    return;
  }
  const circle = document.createElement('div');
  circle.classList.add('touch-circle');

  // Colore casuale per ogni tocco
  //circle.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;
  circle.style.backgroundColor = pickColor();

  document.body.appendChild(circle);
  moveCircle(circle, x, y);
  touchesMap.set(id, circle);
  restartTimer();
}

// Aggiorna la posizione del cerchio
function moveCircle(circle, x, y)
{
  if (ctx.result === 'done')
  {
    return;
  }
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
}

// Rimuove il cerchio
function removeCircle(id, doRestart = true)
{
  if (ctx.result === 'done')
  {
    return;
  }
  const circle = touchesMap.get(id);
  if (circle)
  {
    const backgroundColor = circle.style.backgroundColor + '';
    if (backgroundColor && backgroundColor !== '')
    {
      ctx.colors.add(backgroundColor);
    }
    circle.remove();
    touchesMap.delete(id);
    if (doRestart)
    {
      restartTimer();
    }
  }
}

window.addEventListener('contextmenu', (e) =>
{
  e.preventDefault();
});

function clearAll()
{
  stopTimer();
  Array.from(touchesMap.keys()).forEach((id) =>
  {
    removeCircle(id, false);
  });
}

function upateCtx()
{
  clearAll();
  const { teamCount, figerCount } = ctx;
  document.getElementById('team_count_value').innerHTML = teamCount + '';
  document.getElementById('finger_count_value').innerHTML = figerCount + '';
}

function bttUpdateFun(opts)
{
  const { teamCount, figerCount } = opts;
  const { teamCount:oldCtxTeamCount, figerCount:oldCtxFigerCount } = ctx;
  if (Number.isInteger(teamCount))
  {
    const c = ctx.teamCount + teamCount;
    if (c >= 0)
    {
      ctx.teamCount = c;
    }
  }
  if (Number.isInteger(figerCount))
  {
    const c = ctx.figerCount + figerCount;
    if (c >= 0)
    {
      ctx.figerCount = c;
    }
  }
  if (ctx.teamCount !== oldCtxTeamCount)
  {
    if (ctx.figerCount > 0)
    {
      ctx.figerCount = 0;
    }
  }
  else if (ctx.figerCount !== oldCtxFigerCount)
  {
    if (ctx.teamCount > 0)
    {
      ctx.teamCount = 0;
    }
  }

  if (ctx.figerCount === 0 && ctx.teamCount === 0)
  {
    ctx.figerCount = 1;
  }
  upateCtx();
}


function mainLoad()
{
  document.addEventListener('click', (e) =>
  {
    const evtId = Date.now() + 'tabubu';
    createCircle(evtId, e.clientX, e.clientY);
    const circle = touchesMap.get(evtId);
    if (circle)
    {
      circle.addEventListener('click', (e) =>
      {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        removeCircle(evtId);
      });
    }
  });

  document.addEventListener('touchstart', (e) =>
  {
    for (const touch of e.changedTouches)
    {
      createCircle(touch.identifier, touch.clientX, touch.clientY);
    }
  }, { passive:true });

  document.addEventListener('touchmove', (e) =>
  {
    for (const touch of e.changedTouches)
    {
      const circle = touchesMap.get(touch.identifier);
      if (circle)
      {
        moveCircle(circle, touch.clientX, touch.clientY);
      }
    }
  }, { passive:true });

  document.addEventListener('touchend', (e) =>
  {
    for (const touch of e.changedTouches)
    {
      removeCircle(touch.identifier);
    }
  }, { passive:true });

  document.addEventListener('touchcancel', (e) =>
  {
    for (const touch of e.changedTouches)
    {
      removeCircle(touch.identifier);
    }
  }, { passive:true });

  [
    { id:'team_count_minus', cb:() => bttUpdateFun({ teamCount:-1, figerCount:0 }) },
    { id:'team_count_value', cb:() => {} },
    { id:'team_count_plus', cb:() => bttUpdateFun({ teamCount:+1, figerCount:0 }) },
    { id:'finger_count_minus', cb:() => bttUpdateFun({ teamCount:0, figerCount:-1 }) },
    { id:'finger_count_value', cb:() => {} },
    { id:'finger_count_plus', cb:() => bttUpdateFun({ teamCount:0, figerCount:1 }) },
  ].forEach(it =>
  {
    const el = document.getElementById(it.id);
    const doCb = (e) =>
    {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      if (ctx.result === 'done')
      {
        return;
      }
      console.debug('stoppete');
      it.cb();
    };
    el.addEventListener('touchstart', doCb);//, { passive:true });
    el.addEventListener('click', doCb);
  });
    
  document.getElementById('testissimo').addEventListener('click', () =>
  {
    window.location.reload();
  });
      
  upateCtx();
  printCtx();
}

document.addEventListener("DOMContentLoaded", mainLoad);