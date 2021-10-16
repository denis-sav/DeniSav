let $ = (name) =>
{
  if(name[0] == '.') return document.getElementById(name.substring(1))
}
let selection;
let mode = 0;
let stop = false;

function ToggleMode()
{
  mode = !mode;
  if(mode)
    {
      $(".mode").innerHTML = "Mode: fast";
    }
  else
    {
      $(".mode").innerHTML = "Mode: slow";
    }
}
let Select = (event) =>
{
  console.log(event.target.id);
  
  if(selection != undefined)
  {
      $(selection).classList.remove("cell-selected");
  }
  selection = '.' + event.target.id;
  let i = Math.floor(selection.substring(1) / 9);
              let j = selection.substring(1) % 9;
  //console.log(canPlaceFast(i, j));
  //console.log(makeAssumptions(0));
  $(selection).classList.add("cell-selected");
}
let cells = new Array(9);
let fastArr = new Array(81);
let Arr = () =>
{
  for(let i = 0; i < 9; i++)
    {
      cells[i] = new Array(9);
    }
  for(let i = 0; i < 81; i++)
    {
     fastArr[i] = 0;
     const cell = document.createElement("div");
     cell.id = i
     cell.innerHTML = ' ';
     cell.className = "cell";
     cell.onclick = Select;
     $(".container").appendChild(cell);
     cells[Math.floor(i / 9)][i % 9] = $("." + i);
     }
     console.log(cells);
}

let AddKeyListener = () =>
{
  document.addEventListener("keydown", (e) =>
    {
      
      if(selection != undefined)
        {
          if(e.key >= '1' && e.key <= '9')
            {
              
             let i = Math.floor(selection.substring(1) / 9);
              let j = selection.substring(1) % 9;
              
              console.log(i + " " + j + ' ' + e.key);
              if(canPlace(i, j, e.key))
                {
                  $(selection).innerHTML = e.key;
                  fastArr[selection.substring(1)] = parseInt(e.key);
                  //console.log(fastArr)
                }
              //makeAssumptions();
            }
          else if(e.key == '0')
            {
              $(selection).innerHTML = ' ';
              fastArr[selection.substring(1)] = 0;
            }
        }
    })
}
let Clear = () =>
{
  stop = true;
  if(selection != undefined)
  {
      $(selection).classList.remove("cell-selected");
      selection = undefined;
  };
  for(let i = 0; i < 9; i++)
    {
      for(let j = 0; j < 9; j++)
        {
          //console.log(cells);
          cells[i][j].innerHTML = ' ';
          fastArr[i * 9 + j] = 0;
          //console.log(cells);
        }
    }
  $(".result").innerHTML = ' ';
}

let canPlace = (ii, jj, num) =>
{
  for(let i = 0; i < 9; i++)
  {
    if(cells[ii][i].innerHTML == num || num == cells[i][jj].innerHTML) return false;
  }
  let col = Math.floor(ii / 3);
  let row = Math.floor(jj / 3);
  //console.log(col + ' ' + row);
  for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
        {
          if(cells[col * 3 + i][row * 3 + j].innerHTML == num) return false;
        }
    }  
  return true;
}
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let counter = 0;
async function solve(ii, jj)
{
  if(stop) return false;
  counter++;
  console.log(counter);
  await sleep(0);
  //sleep(5).then( () => {
  //console.log(ii + ' ' + jj);
  if(ii == 8 && jj == 9) return true;
  if(jj == 9)
  {
    ii++;
    jj=0;
  }
  //cells[ii][jj].innerHTML = 'i';
  if(cells[ii][jj].innerHTML != ' ') return solve(ii, jj + 1);
  //cells[ii][jj].innerHTML = 'i';
  for(let i = 1; i <= 9; i++)
  {
    if(canPlace(ii, jj, i))
    {
      //console.log(ii * 9 + jj);
      cells[ii][jj].innerHTML = i;
      if(await solve(ii, jj + 1)) return true;
    }
  }
  cells[ii][jj].innerHTML = ' ';
  return false;
  //})
}
let values = new Array(9);
function canPlaceFast(ii, jj)
{
  for(let i = 0; i < 9; i++)
  {
     values[i] = 0;
  }
  for(let i = 0; i < 9; i++)
  {
    if(fastArr[ii * 9 + i] > 0)
      values[fastArr[ii * 9 + i] - 1] = 1;
    if(fastArr[i * 9 + jj] > 0)
      values[fastArr[i * 9 + jj] - 1] = 1;
  }
  let col = (ii - ii % 3) / 3;
  let row = (jj - jj % 3) / 3;
  for(let i = 0; i < 3; i++)
    {
      for(let j = 0; j < 3; j++)
        {
          if(fastArr[(col * 3 + i) * 9 + row * 3 + j] > 0)
          values[fastArr[(col * 3 + i) * 9 + row * 3 + j] - 1] = 1;
        }
    }  
  let arr = [];
  for(let i = 0; i < values.length; i++)
    {
      if(!values[i]) arr.push(i + 1);
    }
  return arr;
}

let makeAssumptions = (place) =>
{
  let assumptions = [];
  
  let madeAssumptions = true;
  
  while(madeAssumptions)
  {
    madeAssumptions = false;
  for(let i = place; i < 81; i++)
  {
    let ii = (i - i % 9) / 9;
    let j = i % 9;
          if(fastArr[ii * 9 + j] == 0)
          {
          let arr = canPlaceFast(ii, j);
          if(arr.length == 1)
            {
              madeAssumptions = true;
              assumptions.push(ii * 9 + j);
              fastArr[ii * 9 + j] = arr[0];
              $("." + (ii * 9 + j)).innerHTML = arr[0];
              //console.log(arr[0]);
              console.log(assumptions)
            }
          }
  }
  }
  //console.log(assumptions)
  return assumptions;
  /*let assArr = new Array(81)
  for(let i = 0; i < assArr.length; i++)
    {
      assArr[i] = new Set;
    }
  for(let i = 0; i < 81; i++)
    {
      if(fastArr[i] > 0)
        {
          let ii = (i - i % 9) / 9;
          let jj = i % 9;
          for(let j = 0; j < 9; j++)
          {
              assArr[ii * 9 + j].add(fastArr[i])// = 1;
              assArr[j * 9 + jj].add(fastArr[i])// = 1;
          }
          ii = (ii - ii % 3) / 3;
          jj = (jj - jj % 3) / 3;
          for(let j = 0; j < 3; j++)
            {
              for(let k = 0; k < 3; k++)
                {
                  assArr[(ii * 3 + j) * 9 + jj * 3 + k].add(fastArr[i])// = 1;
                }
            }
        }
    }
  //unfinished
  //let nums = new Array(9);
  for(let i = 0; i < 9; i++)
  {
     
  }
  //console.log(assArr)
  //console.log("here")
  
  return assumptions;
  */
}

function solveFast(ii, jj)
{
  //console.log(ii + ' ' + jj);
  //if(jj == 2) return true;
  if(ii == 8 && jj == 9) return true;
  if(jj == 9)
  {
    ii++;
    jj=0;
  }
  if(fastArr[ii * 9 + jj] != 0) return solveFast(ii, jj + 1);
    let arr = canPlaceFast(ii, jj);
    //console.log(arr);
    if(arr.length == 0) return false;
   // let assumptions = [];
   // assumptions = makeAssumptions(ii * 9 + jj + 1);
   // console.log(assumptions)
    for(let i = 0; i < arr.length; i++)
    {
      //console.log(ii * 9 + jj);
      fastArr[ii * 9 + jj] = arr[i];
      if(solveFast(ii, jj + 1)) return true;
    }
  //for(let i = 0; i < assumptions.length; i++)
   //      {
   //         fastArr[assumptions[i]] = 0;
   //       }
  fastArr[ii * 9 + jj] = 0;
  return false;
}


let solving = false;
async function Solve()
{
  if(solving) return;
  solving = true;
  counter = 0;
  stop = false;
  if(selection != undefined)
  {
      $(selection).classList.remove("cell-selected");
      selection = undefined;
  }
  if(mode)
    {
      if(solveFast(0, 0))
        {
          //console.log(fastArr)
          for(let i = 0; i < 81; i++)
            {
              $('.' + i).innerHTML = fastArr[i];
            }
        }
        else
          {
            $(".result").innerHTML = "cant solve";
          }
    }
  else
    {
      let ans = await solve(0, 0);
  if(!ans)
  {
    $(".result").innerHTML = "cant solve";
  }
  else
    {
      $(".result").innerHTML = "solved";
      for(let i = 0; i < 81; i++)
        {
          fastArr[i] = $("." + i).innerHTML;
        }
    }
    }
  solving = false;
}

window.addEventListener('DOMContentLoaded', (event) => {
    console.log($(".container"))
    Arr();
    AddKeyListener();  
});