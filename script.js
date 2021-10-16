const copyAnimate = () =>
{
  navigator.clipboard.writeText("BetterNamePending#0053")
  let copy = document.getElementById("copy");
  copy.style.["animation-name"] = "";
  setTimeout(
    () =>
    {
      copy.style.["animation-name"] = "copied";
    }
    ,1)
}