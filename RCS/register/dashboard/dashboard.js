var currentUser=localStorage.getItem("currentUser");
document.getElementById("welcome_msg").innerHTML="welcome" +"\t\t"+ currentUser;



function logout(){

    localStorage.removeItem("currentUser");
    window.location.href="../login/login.html"
}
 
document.getElementById("savebtn").style.display="none";
//localStorage.setItem("posts",posts);

function getTimeStamp(){

    var date = new Date();

    var d = date.getDate()+'/'+(date.getMonth)+1 + '/' + date.getFullYear();
    var t = date.getHours()+':' +date.getMinutes() + ':' + date.getSeconds();


    return date + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + t;
}

var allUsers=JSON.parse(localStorage.getItem("users"));

var userListItems = "";
allUsers.forEach(user =>{

    if(user.emailId != currentUser){
        userListItems=userListItems + "<li>" + user.username +'&nbsp;&nbsp;&nbsp;&nbsp;'+"<button id='connected' onclick='connect("+user.userId+")'>Connect</button>"+ '&nbsp;&nbsp;' +"<button id='cancelbtn' onclick='requestsent("+user.userId+")'>Request sent</button>" +"</li>"+ "<br>";
    }

    document.getElementById("allUsers").innerHTML=userListItems;

})

document.getElementById("cancelbtn").style.display="none";


var pendingListItems = "";

allUsers.forEach(user => {
   if (user.emailId == currentUser) {

      console.log('pendng reqs', user.pendingRequests);

         user.pendingRequests.forEach(request => {
         console.log('request', request);
         localStorage.setItem('currentPendingRequest', request);
        pendingListItems = pendingListItems + "<li>" + request + "<button onclick='accept()'>Accept</button>" + "  " + "<button onclick='decline(" + user.emailId + ")'>Decline</button>" + "</li>";
      })
   }
})


document.getElementById("pendingreqs").innerHTML=pendingListItems;


var connectionListItems= "";

allUsers.forEach( user => {
  if(user.emailId == currentUser ){
    console.log("inside");
                  user.connections.forEach(connection => {
                  
              connectionListItems = connectionListItems + "<li>"+ connection + "<button onclick='accept()'>Send Message</button>"+ "&nbsp;&nbsp;"+ "</li>";
            })
  }
})

//document.getElementById("connections").innerHTML=connectionListItems ;

function test(){
    alert("In test");
  }
  

  function accept(){
    event.preventDefault();
     var pendingRequestEmail=localStorage.getItem('currentPendingRequest');
     
    var allUsers=JSON.parse(localStorage.getItem("users"));
    allUsers.forEach( function(user) {
      if(user.emailId == currentUser ){
                      user.pendingRequests.forEach(function(request,i) {
                       if(request == pendingRequestEmail){
                                  
                         user.connections.push(pendingRequestEmail);
                         user.pendingRequests.splice(i,1);

                         allUsers.forEach(function(u) {
                            if(u.emailId == pendingRequestEmail){
                              u.connections.push(currentUser);
                              return;
                            }
                         })
                         localStorage.setItem('users', JSON.stringify(allUsers));
                         showPosts();
                         return;
                       }
                })
      }

  })
}



function connect(userId){
    event.preventDefault();
    console.log("userId",userId);
    document.getElementById("connected").innerHTML="request sent";
    var allUsers=JSON.parse(localStorage.getItem("users"));
    
    allUsers.forEach(user =>{

        if(user.userId == userId){
            console.log("user",user)
            user.pendingRequests.push(currentUser);
            console.log('user',user);
        }
    
        localStorage.setItem("allUsers",JSON.stringify(allUsers));
    
    })
    
}

showPosts();

if(localStorage.getItem("posts") == null){
    localStorage.setItem("posts",JSON.stringify([]));
}


function getUniqueId(){

    if(localStorage.getItem("currentId") == null){

        localStorage.setItem("currentId",1);
    }

    var currentId=parseInt(localStorage.getItem("currentId"));

    currentId++;

    localStorage.setItem("currentId",currentId);

    return currentId;
}

//document.getElementById("cancelbtn").style.display="none";
function post(){
    event.preventDefault();
    var post=getValueById("postId");

    var userPost={
        post:post,
        postId:getUniqueId(),
        timestamp:getTimeStamp(),
        postedBy:currentUser,
        username:getUsernameByEmail(currentUser)
     }

    console.log(userPost);
   var allposts=JSON.parse(localStorage.getItem("posts"));
   console.log("posts")
    allposts.push(userPost);
    localStorage.setItem("posts",JSON.stringify(allposts))
   showPosts();
   document.getElementById("postId").value="";

}



function showPosts(){

    var listofposts = document.getElementById("listofposts");

    var listItems = "";

    var posts= JSON.parse(localStorage.getItem("posts"));

    console.log("posts",posts);

    for(i=0;i<posts.length;i++){

        if(currentUser == posts[i].postedBy){

            listItems = listItems +'<li>'+  "<b>" + posts[i].username + ":"+"</b>" + "&nbsp;&nbsp;&nbsp;&nbsp;" +  posts[i].post  + '&nbsp;&nbsp;&nbsp;&nbsp;' + posts[i].timestamp +"&nbsp;&nbsp;&nbsp;&nbsp;" + "<button onclick='deletePost("+posts[i].postId+")'>Delete</button>"+"&nbsp;&nbsp;&nbsp;&nbsp;"+"<button onclick='editPost("+posts[i].postId+")'>Edit</button>" +'</li>'+"<br>" ;
        }
    }
        listofposts.innerHTML=listItems;

        console.log(listItems);
}


function updatePost(postId){
    event.preventDefault();
    console.log("postId",postId);
  var posts=JSON.parse(localStorage.getItem("posts"));

    posts.forEach(
        function(p){
            if(p.postId == postId){
               var NewValue  = document.getElementById("postId").value;
                p.post=NewValue;
                localStorage.setItem("posts",JSON.stringify(posts)); 
                document.getElementById("posted").style.display="inline";
                document.getElementById("savebtn").style.display="none";
                document.getElementById("postId").value="";

                showPosts();
            }
        }

    )
   
}
function getUsernameByEmail(emailID){
    var users=JSON.parse(localStorage.getItem('users'));
  
      for(var i=0;i<users.length;i++){
        if(emailID == users[i].emailId)
        {
          return users[i].username;
        }
      }
  }

function deletePost(postId){
           event.preventDefault();
           console.log("postId",postId);

           var posts=JSON.parse(localStorage.getItem("posts"));

           for(i=0;i<posts.length;i++){
               if(postId == posts[i].postId){
          
                  posts.splice(i,1);
               }
        
               localStorage.setItem('posts',JSON.stringify(posts));
            }

            showPosts()
    }

    function editPost(postId){
        event.preventDefault();
        console.log("postId",postId);
        document.getElementById("posted").style.display="none";
        document.getElementById("savebtn").style.display="inline";  
               
        var posts=JSON.parse(localStorage.getItem("posts"));

           posts.forEach(
               function(p){
                   if(p.postId == postId){
                       document.getElementById("postId").value=p.post;
                       document.getElementById("savebtn").setAttribute('onclick','updatePost('+postId+')');
                       return;
                   }
               }

           )

         showPosts()
    }

    

