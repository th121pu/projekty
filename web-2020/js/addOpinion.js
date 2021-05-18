function processFormular(event) {
    event.preventDefault();
    let inputs = document.getElementById("formular").elements;

    if (inputs["meno"].value.trim() == "" || inputs["mail"].value.trim() == "" || inputs["comment"].value.trim() == "") {
        window.alert("Please, enter both your name and opinion");
        return;
    }

    const newOpinion = {
        name: inputs["meno"].value.trim(),
        mail: inputs["mail"].value.trim(),
        url: inputs["url"].value.trim(),
        comment: inputs["comment"].value.trim(),
        choice: inputs["section-choice"].value.trim(),
        impr1: inputs["imprA"].checked,
        impr2: inputs["imprB"].checked,
        impr3: inputs["imprC"].checked,
        rating: inputs["rating"].value
    };


    //doplnkova 12.cvicenie, post
    const init = {
        headers: {
            "X-Parse-Application-Id": "o6FsUaCE8fOVRmk1c9DVnda3AzmKjPKSFEohYUex",
            "X-Parse-REST-API-Key": "07wZhNYBidlLrbuZGqs7vttuZGv7SVtPx9FDKeO7",
            "Content-Type": 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newOpinion)
    };

    const url="https://parseapi.back4app.com/classes/opinions";

    fetch(url,init)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => { //here we process the returned response data in JSON ...
            console.log(responseJSON);
        })
        .catch(error => {
            const errMsgObj = {errMessage: error};
            console.log(errMsgObj);
        });


    let opinions = [];

    if (localStorage.myComments) {
        opinions = JSON.parse(localStorage.myComments);
    }

    opinions.push(newOpinion);
    localStorage.myComments = JSON.stringify(opinions);

    window.location.hash = "#opinions";

}


function deleteOld() {
    let opinions = [];
    if (localStorage.myComments) {
        opinions = JSON.parse(localStorage.myComments);
    }
    let length = opinions.length;
    let newOpinions = [];
    //pred
    if (opinions.length > 0) {
        for (let i = 0; i < length; i++) {
            if (Date.now() - new Date(opinions[i].created) < 86400000) {
                console.log("saved " + i);
                console.log(opinions[i].comment);
                console.log(Date.now() - new Date(opinions[i].created));
                newOpinions.push(opinions[i]);
            }
        }

        if (opinions.length > 0) {
            opinions = newOpinions;
            console.log(opinions);

            if (!localStorage.myComments) {
            } else {
                opinions.forEach(opinion => {
                    opinion.createdDate = (new Date(opinion.created)).toDateString();

                    //RADIO
                    if (opinion.rating == 0) opinion.createdRating = "Výborná";
                    else if (opinion.rating == 1) {
                        opinion.createdRating = "Dobrá";
                    } else opinion.createdRating = "Nedostatočná";

                    //CHECKBOX
                    let impovements = 0;
                    if (opinion.impr1) {
                        opinion.dizajn = "Dizajn";
                        impovements++;
                    }
                    if (opinion.impr2) {
                        opinion.obsah = "Obsah";
                        impovements++;
                    }
                    if (opinion.impr3) {
                        opinion.akt = "Aktuálnosť";
                        impovements++;
                    }
                    if (impovements > 0) opinion.wantImpr = "Chcem zlepšit:";
                });
            }

            localStorage.myComments = JSON.stringify(newOpinions);
            document.getElementById("router-view").innerHTML = Mustache.render(
                document.getElementById("template-opinions").innerHTML,
                opinions
            );
        }

    }
}


