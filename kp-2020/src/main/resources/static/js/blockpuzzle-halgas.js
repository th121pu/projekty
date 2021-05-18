let currentRating = 0;
runRating();

function runRating() {
    let userRating = document.getElementById("userRating").textContent;
    let rates = document.getElementsByName('stars');
    console.log(userRating);
    for (let i = 0; i < rates.length; i++) {
        if (rates[i].value == userRating) {
            rates[i].checked = true;
        }
    }
}

function changeRating(rating) {
    currentRating = rating.value;
    console.log(currentRating);
    document.getElementById("userRating").innerHTML = currentRating;
}

function displayOrHideMenu() {
    document.getElementById("menuIts").classList.toggle("mnShow");
}

function hideMenu() {
    let menuClElmCList = document.getElementById("menuIts").classList;
    if (menuClElmCList.contains("mnShow")) menuClElmCList.remove("mnShow");

}

function displayDiff() {
    document.getElementById("login-form-wrap").innerHTML = `
<div class="toCenter">
        <h3>Choose difficulty</h3>

    <div class="commands">

           <a href="/blockpuzzle-halgas/new?difficulty=1">
            <button class="options tooltip">Easy  <span class="tooltiptext"> Hints in every level</span></button>
        </a>

        <a href="/blockpuzzle-halgas/new?difficulty=2">
            <button class="options tooltip">Medium  <span class="tooltiptext"> Hints just in last levels</span></button>
        </a>

        <a href="/blockpuzzle-halgas/new?difficulty=3">
            <button class="options tooltip last">Hard  <span class="tooltiptext"> No hints</span></button>
        </a>
        </div>

        </div>
      `;
}

document.addEventListener("click",
    function (event) {
        if (!event.target.matches("#menuIts")) hideMenu();
    }
);