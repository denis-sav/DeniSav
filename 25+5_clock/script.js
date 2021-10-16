let breaklen = 5;
let seslen = 25;
let minut = 25;
let sec = 0;
let stopped = true;
let session = true;
let interval;
function updateCounts()
{
  document.getElementById("break-length").innerHTML = breaklen;
  document.getElementById("session-length").innerHTML = seslen;
}

function addZero(num)
{
  if(num < 10) return "0" + num;
  return num;
}
function updateTimer()
{
  document.getElementById("time-left").innerHTML = String(addZero(minut) + ":" + addZero(sec));
}
function changeLen(element, howMuch)
{
  if(stopped)
   {
  let change = -1;
  if(element.id.includes("increment"))
    change = 1;
  if(element.id.includes("break"))
    {
     if(breaklen + change > 0 && breaklen + change <= 60)
      breaklen+=change;
      if(!session)
        {
      minut = breaklen;
      sec = 0;
        }
    }
  else
    {
      if(seslen + change > 0
         && seslen + change <= 60)
       seslen+=change;
      if(session)
        {
      minut = seslen;
      sec = 0;
        }
    }
    updateCounts();
    console.log(change);
    updateTimer();
   }
}

function reset()
{
  console.log("reset")
  if(!stopped)
  {
    toggleTimer();
  }
  session = true;
  breaklen = 5;
  seslen = 25;
  minut = 25;
  sec = 0;
  stopped = true;
  updateButton();
  updateCounts();
  updateTimer();
  updateSession();
  document.getElementById("beep").pause();
  document.getElementById("beep").currentTime = 0;
}
function updateButton()
{
  let first = "fa-pause";
  let second = "fa-play";
  if(!stopped)
  {
    let temp = first;
    first = second;
    second = temp;
  }     document.getElementById("start_stop").childNodes[1].classList.remove(first);     document.getElementById("start_stop").childNodes[1].classList.add(second);
}
function updateSession()
{
  let name = "Session";
  if(!session) name = "Break";
  document.getElementById("timer-label").innerText = name;
}
function decrement()
{
  sec -= 1;
  if(sec < 0)
  {
      sec = 59;
      minut -= 1;
    console.log("underflow");
  }
  if(minut < 0)
  {
    document.getElementById("beep").play();
      session = !session;
      if(session)
        {
          minut = seslen;
        }
      else
        {
          minut = breaklen;
        }
      updateSession();
  }
  updateTimer();
}
function toggleTimer()
{
  console.log("pauseStart");
  stopped = !stopped;
  if(!stopped)
  {
      setTimeout(interval = setInterval(decrement, 1000), 1000);
  }
  else
  {
      clearInterval(interval);
  }
  updateButton();
}