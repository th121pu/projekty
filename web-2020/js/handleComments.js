 async function showCommentUpload() {
     document.getElementById('fsetCommentUpload').classList.remove("hiddenElm");
     document.getElementById('btShowCommentUpload').classList.add("hiddenElm");
     await updateAuthorForComment()
 }


//Pridanie funkcionality pre kliknutie na tlacidlo "Zruš nahrávanie / Cancel uploading"
function cancelCommentUpload(){
    document.getElementById('commentAuthor').value = "";
    document.getElementById('commentText').value = "";
    document.getElementById('fsetCommentUpload').classList.add("hiddenElm");
    document.getElementById('btShowCommentUpload').classList.remove("hiddenElm");
}

function uploadComment(serverUrl, articleID) {
    const commentData = {};
    commentData.author = document.getElementById("commentAuthor").value.trim();
    commentData.text = document.getElementById("commentText").value.trim();

    if (!commentData.text) {
        window.alert("Please, enter comment text");
        return;
    }

    if (!commentData.author) {
        commentData.author = "Anonymous";
    }

    const postReqSettings =
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(commentData)
        };

    fetch(`${serverUrl}/article/${articleID}/comment`, postReqSettings)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .then(responseJSON => {
            cancelCommentUpload();
            const comment = {};
            comment.comAuthor = commentData.author;
            comment.comText = commentData.text;
            comment.date = new Date().toDateString();
            document.getElementById("newComment").innerHTML += Mustache.render(document.getElementById("template-new-comment").innerHTML, comment);
            const url = `${serverUrl}/article/${articleID}`;
            fetchComments("router-view", url, articleID, 1);
            return Promise.resolve();
        })
        .catch(error => {
            document.getElementById("router-view").innerHTML +=
                `
                    <h2>Error r</h2>
                    ${error}
                `;
        });


}

 function fetchComments(targetElm, url, artIdFromHash, current) {
     let commentList = [];
     fetch(`${url}/comment?max=10`)
         .then(response => {
             if (response.ok) {
                 return response.json();
             } else {
                 return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
             }
         })
         .then(responseJSON => {
             commentList = responseJSON.comments;
             console.log(artIdFromHash);
             commentList.forEach((comment, index) => {
                 comment.comAuthor = comment.author;
                 comment.comText = comment.text;
                 comment.date = (new Date(comment.dateCreated)).toDateString();
                 comment.pocetKomentarov = commentList.length;
                 if (index > 0) comment.prevCom = index;
                 if (index < commentList.length-1) comment.nextCom = index + 2;
             });
             console.log(commentList.length);
             displayCurrentComment(targetElm,current,commentList.length,commentList, true);

             return Promise.resolve();
         });
 }

 let commentListHistory;

 function displayCurrentComment(targetElm, current, totalCount, commentList, firstCommentDisplay) {
     console.log(firstCommentDisplay);

     if (firstCommentDisplay) {
         commentListHistory = commentList;
         console.log('first '+ commentListHistory);
     }
     else {
         commentList = commentListHistory;
         console.log('second ' + commentListHistory);
     }

     console.log(commentList);
     document.getElementById("commentsForArticle").innerHTML = Mustache.render(document.getElementById("template-comment").innerHTML, commentList[current-1]);
 }