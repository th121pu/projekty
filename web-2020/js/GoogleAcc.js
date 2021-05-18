let auth2 = {};

function signOut() {
    if(auth2.signOut) auth2.signOut();
    if(auth2.disconnect) auth2.disconnect();
}

function userChanged(user){
    document.getElementById("userName").innerHTML=user.getBasicProfile().getName();

    let userNameArticleElm = document.getElementById("author");
    if (userNameArticleElm) {
        console.log('user MENIM');
        userNameArticleElm.value = user.getBasicProfile().getName();
    }

    let userNameOpinionElm = document.getElementById("menoElm");
    if (userNameOpinionElm) {
        userNameOpinionElm.value = user.getBasicProfile().getName();
    }

    let userNameCommentElm = document.getElementById("commentAuthor");
    if (userNameCommentElm) {
        userNameCommentElm.value = user.getBasicProfile().getName();
    }
}

async function updateAuthor() {
    let sgnd = auth2.isSignedIn.get();

    let userNameInputElm;
    while (document.getElementById("author") === null) {
        await new Promise((r => setTimeout(r, 500)));
        userNameInputElm =  document.getElementById("author");
    }

    if (userNameInputElm) {
        console.log('running in if');
        if (sgnd) {
            console.log('upddate MENIM');
            userNameInputElm.value = auth2.currentUser.get().getBasicProfile().getName();
            console.log('google ' +auth2.currentUser.get().getBasicProfile().getName());
        } else {
            userNameInputElm.value = "";
        }
    }

}

async function updateAuthorForOpinion() {
    let sgnd = auth2.isSignedIn.get();

    let userNameOpinionElm;
    while (document.getElementById("menoElm") === null) {
        await new Promise((r => setTimeout(r, 500)));
        userNameOpinionElm = document.getElementById("menoElm");
    }

    if (userNameOpinionElm) {
        if (sgnd) {
            userNameOpinionElm.value = auth2.currentUser.get().getBasicProfile().getName();
        } else {
            userNameOpinionElm.value = "";
        }
    }
}

async function updateAuthorForComment() {
    let sgnd = auth2.isSignedIn.get();
    console.log('comment  running');
    let userNameCommentElm;
    while (document.getElementById("commentAuthor") === null) {
        await new Promise((r => setTimeout(r, 500)));
        console.log('running');
        userNameCommentElm = document.getElementById("commentAuthor");
    }

    if (userNameCommentElm) {
        console.log('running2');
        if (sgnd) {
            userNameCommentElm.value = auth2.currentUser.get().getBasicProfile().getName();
        } else {
            userNameCommentElm.value = "";
        }
    }
}

let updateSignIn = async function () {
    let sgnd = auth2.isSignedIn.get();
    if (sgnd) {
        document.getElementById("SignInButton").classList.add("hiddenElm");
        document.getElementById("SignedIn").classList.remove("hiddenElm");
        document.getElementById("userName").innerHTML = auth2.currentUser.get().getBasicProfile().getName();
    } else {
        document.getElementById("SignInButton").classList.remove("hiddenElm");
        document.getElementById("SignedIn").classList.add("hiddenElm");
    }

    if (!sgnd) {
        renderLogOutInfo();
    }

    await updateAuthor();
}

function startGSingIn() {
    gapi.load('auth2', function() {
        gapi.signin2.render('SignInButton', {

            'longtitle': false,
            'theme': 'dark',
            'onsuccess': onSuccess,
            'onfailure': onFailure
        });
        gapi.auth2.init().then( //zavolat po inicializĂˇcii OAuth 2.0  (called after OAuth 2.0 initialisation)
            function (){
                console.log('init');
                auth2 = gapi.auth2.getAuthInstance();
                auth2.currentUser.listen(userChanged);
                auth2.isSignedIn.listen(updateSignIn);
                auth2.then(updateSignIn); //tiez po inicializacii (later after initialisation)
            });
    });

}

function onSuccess(profile) {
    profile = profile.getBasicProfile();
    console.log('Logged in as: ' + profile.getName());
    console.log('Prihlaseny');
    console.log(profile.getId());
    console.log(profile.getName());
    console.log(profile.getGivenName());
    console.log(profile.getFamilyName());
    console.log(profile.getEmail());
}
function onFailure(error) {
    console.log(error);
}

function renderLogOutInfo() {
    console.log('Odhlaseny');
    let userNameArticleElm = document.getElementById("author");
    if (userNameArticleElm) {
        userNameArticleElm.value = "";
    }

    let userNameOpinionElm = document.getElementById("menoElm");
    if (userNameOpinionElm) {
        console.log('user MENIM');
        userNameOpinionElm.value = "";
    }

    let userNameCommentElm = document.getElementById("commentAuthor");
    if (userNameCommentElm) {
        console.log('user MENIM');
        userNameCommentElm.value = "";
    }

}


