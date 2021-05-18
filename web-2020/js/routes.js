export default [

    {
        hash: "welcome",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML
    },

    {
        hash: "articles",
        target: "router-view",
        getTemplate: fetchAndDisplayArticles
    },


    {
        hash: "opinions",
        target: "router-view",
        getTemplate: createHtml4opinions
    },


    {
        hash: "addOpinion",
        target: "router-view",
        getTemplate: addOpinion
    },

    {
        hash: "article",
        target: "router-view",
        getTemplate: fetchAndDisplayArticleDetail
    },

    {
        hash: "artEdit",
        target: "router-view",
        getTemplate: editArticle
    },

    {
        hash: "artDelete",
        target: "router-view",
        getTemplate: deleteArticle
    },

    {
        hash: "artInsert",
        target: "router-view",
        getTemplate: insertArticle
    },

    {
        hash: "artComment",
        target: "router-view",
        getTemplate: displayCurrentComment
    },


    {
        hash: "tabulka",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-tabulka").innerHTML
    },

    {
        hash: "vysledky",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-vysledky").innerHTML
    },

    {
        hash: "ostatne",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-ostatne").innerHTML
    },

    {
        hash: "article1",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-article1").innerHTML
    },

    {
        hash: "article2",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-article2").innerHTML
    },

    {
        hash: "article3",
        target: "router-view",
        getTemplate: (targetElm) =>
            document.getElementById(targetElm).innerHTML = document.getElementById("template-article3").innerHTML
    },

];


const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const myCustomTag = "InfoNHLtajne";

function createHtml4opinions(targetElm) {

    //doplnkova 12. cvicenie
    let opinions = [];
    const init = {
        headers: {
            "X-Parse-Application-Id": "o6FsUaCE8fOVRmk1c9DVnda3AzmKjPKSFEohYUex",
            "X-Parse-REST-API-Key": "07wZhNYBidlLrbuZGqs7vttuZGv7SVtPx9FDKeO7",
            "Content-Type": 'application/json'
        }
    };

    const url="https://parseapi.back4app.com/classes/opinions";

    fetch(url,init)
        .then(response =>{
            if(response.ok){
                return response.json();
            }else{
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            console.log(responseJSON);
            opinions = responseJSON.results;
            console.log(opinions);
            opinions.forEach(opinion => {
                opinion.createdDate = (new Date(opinion.createdAt)).toDateString();
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
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-opinions").innerHTML,
                opinions
            );
        })
        .catch (error => {
           console.log(error);
        });

/*
 const opinionsFromStorage = localStorage.myComments;
    if (!opinionsFromStorage) {
    } else {
        opinions = JSON.parse(opinionsFromStorage);
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

    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );

 */


}

let lastCurrent;
let first = true;

async function fetchAndDisplayArticles(targetElm, current, totalCount) {
    let articlesPerPage;
    //DOPLNKOVA2, 11.cvicenie, zistenie poctu mojich clankov
    const urlForCustom = `${urlBase}/article?tag=${myCustomTag}`;
    await fetch(urlForCustom)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            articlesPerPage = responseJSON.meta.totalCount;
            console.log('som zistil ' + articlesPerPage);
        });
    console.log(articlesPerPage);

    //DOPLNKOVA, 9.cvicenie, prve volanie (prvy klik na #articles")
    if (first) {
        current = 1;
        lastCurrent = current;
        first = false;
    }

    //nie prve volanie
    else {
        //prechod medzi clankami, ak sa preklikavame pomocou next a previous, ulozenie posledneho otvoreneho clanku
        if (!isNaN(parseInt(current))) {
            current = parseInt(current);
            lastCurrent = current;
        }

        //nacitanie posledneho clanku, ak klikneme na #articles
        else {
            current = lastCurrent;
        }
    }

    console.log(first);
    console.log(current);
    console.log(lastCurrent);


    console.log('som zistil2 ' + articlesPerPage);
    if (articlesPerPage > 20) {
        articlesPerPage = 20;
    }

    totalCount = articlesPerPage;

    let noContent = [];
    if (totalCount == 0) {
        noContent.nothing = 'Žiaden článok. Pridaj článok';
        document.getElementById(targetElm).innerHTML =
            Mustache.render(
                document.getElementById("template-article").innerHTML,
                noContent
            );

    }

    console.log('pp' + totalCount);
    let urlQuery = "";
    urlQuery = `max=${articlesPerPage}`;
    console.log(urlQuery);

    const url = `${urlBase}/article?tag=${myCustomTag}&${urlQuery}`;
    console.log(url);
    let articleList = [];

    let tmpHtmlElm2CreatePreview = document.createElement("div");

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else { //if we get server error
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            addArtDetailLink2ResponseJson(responseJSON);
            articleList = responseJSON.articles;
            return Promise.resolve();
        })
        .then(() => {
            let cntRequests = articleList.map(
                article => fetch(`${urlBase}/article/${article.id}`)
            );
            return Promise.all(cntRequests);
        })
        .then(responses => {
            let failed = "";
            for (let response of responses) {
                if (!response.ok) failed += response.url + " ";
            }
            if (failed === "") {
                return responses;
            } else {
                return Promise.reject(new Error(`Failed to access the content of the articles with urls ${failed}.`));
            }
        })
        .then(responses => Promise.all(responses.map(resp => resp.json())))
        .then(articles => {
            articles.forEach((article, index) => {
                tmpHtmlElm2CreatePreview.innerHTML = article.content;
                articleList[index].content = tmpHtmlElm2CreatePreview.textContent.substring(0, 500) + "...";
            });
            return Promise.resolve();
        })
        .then(() => {
            renderArticles(articleList, targetElm, current, totalCount);
        })
        .catch(error => errorHandler && errorHandler(error));
}


function renderArticles(articles, targetElm, current, totalCount) {
    const data4rendering = {
        title: articles[current - 1].title,
        author: articles[current - 1].author,
        content: articles[current - 1].content,
        detailLink: articles[current - 1].detailLink,
        currPage: articles[current - 1],
        pageCount: totalCount
    };

    if (current > 1) {
        data4rendering.prevPage = current - 1;
    }

    if (current < totalCount) {
        data4rendering.nextPage = current + 1;
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(document.getElementById("template-articles").innerHTML, data4rendering);

}

function errorHandler(error, targetElm) {
    const errMsgObj = {errMessage: error};
    document.getElementById(targetElm).innerHTML =
        Mustache.render(
            document.getElementById("template-articles-error").innerHTML,
            errMsgObj
        );
}

function addArtDetailLink2ResponseJson(responseJSON) {
    responseJSON.articles =
        responseJSON.articles.map(
            article => (
                {
                    ...article,
                    detailLink: `#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
                }
            )
        );
}

function fetchAndDisplayArticleDetail(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    updateAuthorForComment();
    fetchAndProcessArticle(...arguments, false);
}

function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    updateAuthor();
    fetchAndProcessArticle(...arguments, true);
}



/**
 * Gets an article record from a server and processes it to html according to the value of the forEdit parameter.
 * Assumes existence of the urlBase global variable with the base of the server url (e.g. "https://wt.kpi.fei.tuke.sk/api"),
 * availability of the Mustache.render() function and Mustache templates with id="template-article" (if forEdit=false)
 * and id="template-article-form" (if forEdit=true).
 * @param targetElm - id of the element to which the acquired article record will be rendered using the corresponding template
 * @param artIdFromHash - id of the article to be acquired
 * @param offsetFromHash - current offset of the article list display to which the user should return
 * @param totalCountFromHash - total number of articles on the server
 * @param forEdit - if false, the function renders the article to HTML using the template-article for display.
 *                  If true, it renders using template-article-form for editing.
 */
function fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash, forEdit) {
    const url = `${urlBase}/article/${artIdFromHash}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {

            //doplnkova2, 11.cviko, nezobrazovanie mojho custom tagu pri edite a zobrazeni clanku
            const tagsWithoutCustom = [];

            console.log(responseJSON.tags[0]);

            responseJSON.tags.forEach((tag,index) => {
                if (responseJSON.tags[index] != myCustomTag) {
                    tagsWithoutCustom.push(responseJSON.tags[index]);
                }
            });
            responseJSON.tagsWithoutCustom = tagsWithoutCustom;

            console.log(responseJSON.tags);
            console.log(tagsWithoutCustom);

            if (forEdit) {
                responseJSON.formTitle = "Editácia článku";
                responseJSON.formSubmitCall =
                    `processArtEditFrmData(event,${artIdFromHash},${offsetFromHash},${totalCountFromHash},'${urlBase}')`;
                responseJSON.submitBtTitle = "Ulož článok";
                responseJSON.urlBase = urlBase;
                responseJSON.backLink = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );
            } else {

                fetchComments(targetElm, url, artIdFromHash, 1);

                responseJSON.backLink = `#articles/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.editLink = `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink = `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.IDart =artIdFromHash;
                responseJSON.urlBase = urlBase;



                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        responseJSON
                    );

            }

        })
        .catch(error => {
            const errMsgObj = {errMessage: error};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        });

}


function deleteArticle(targetElm, artIdFromHash) {
    const deleteReqSettings =
        {
            method: 'DELETE'
        };

    fetch(`${urlBase}/article/${artIdFromHash}`, deleteReqSettings)
        .then(response => {
            if (response.ok) {
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-delete-article").innerHTML,
                        response
                    );
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .catch(error => {
            document.getElementById(targetElm).innerHTML += `Attempt failed. Details: <br />  ${error}`;
        });
}

function insertArticle(targetElm) {
    updateAuthor();
    const data = {
        formTitle: "Pridanie článku",
        submitBtTitle: "Odošli článok",
        urlBase: urlBase
    };
    data.formSubmitCall =
        `processInsertFrmData(event,'${targetElm}','${urlBase}')`;


    document.getElementById(targetElm).innerHTML =
        Mustache.render(
            document.getElementById("template-article-form").innerHTML,
            data
        );

}
function addOpinion(targetElm) {
    updateAuthorForOpinion();
    document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML
}
