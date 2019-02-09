var c = [ 0,0,0,0,0,0,0,0,0];
var gameover = 0;
var is_player_1_loggedin = 0;
var is_player_2_loggedin = 0;
var player1 = {};
var player2 = {};
var chance;

//Function to check whether both players are logged in
function areBothLoggedIn()
{
    console.log(is_player_1_loggedin);
    console.log(is_player_2_loggedin);
    return is_player_1_loggedin && is_player_2_loggedin;
}

//Function to get Player name
// Not Used 
function getPlayerName(x){
    return x == 1 ? 'Player 1' : 'Player 2';
}

//changes game message 

function changeMessage(message){
    $('.message').text(message);
}


//Changes UI and saves player data after login 
function afterLogin(player,id,data)
{

    player.find('.login-txt').addClass('display-none');
    player.find('.player-details').removeClass('display-none');
    player.find('.player-name').text(data.username);
    player.find('.player-points').text(data.points + ' Pts');
    player.find('.logout').removeClass('display-none');
    window['is_player_' + id + '_loggedin'] = 1;
    localStorage.setItem("username" + id,data.username);
    window['player'+id].username = data.username;
    window['player'+id].points = data.points;
    if(areBothLoggedIn())
    {
        startGame();
    }

}

//Check if previously logged in players are there
function checkPrevPlayers()
{
    if(localStorage.getItem('username1') != null)
    {
        let username1 = localStorage.getItem('username1');
        $.ajax({
            url:localhost + '/api/Users/'+username1+'/Points',
            statusCode : {
                '200' : function(data)
                {
                    let player  = $('.player').eq(0);
                   afterLogin(player,1,data);

                }
            }
        })

    }

    if(localStorage.getItem('username2') != null)
    {
        let username2 = localStorage.getItem('username2');
        $.ajax({
            url:localhost + '/api/Users/'+username2+'/Points',
            statusCode : {
                '200' : function(data)
                {
                    let player  = $('.player').eq(1);
                   afterLogin(player,2,data)
                }
            }
        })

    }

}

//Changes UI and update points on frontend & database if one wins
function updateWinner(id)
{
    changeMessage('Player '+id + ' Wins');
    player1.points = player1.points + (id==1?10:-5);
    player2.points = player2.points + (id==2?10:-5);
    $('.player-points').eq(0).text(player1.points + ' Pts');
    $('.player-points').eq(1).text(player2.points + ' Pts');
    console.log('winner is : '+ id);
    $('.crackers-img').removeClass('display-none');
    savePoints(player1);
    savePoints(player2);
}

//Save points to database
function savePoints(player)
{
    $.ajax({     
        url:localhost + '/api/Users',
        'type':'PATCH',
        data: { 'UserName' :  player.username, 
               'Points' :  player.points
              },

        statusCode : {
            '200' : function(){
                console.log('saved');
            }
        }
    })
}


//Chooses who starts first?

function getRandomChance(){

    return Math.floor(Math.random()*2) == 0?-1:1;
}

//Function to initiate the game
function startGame()
{
    chance = getRandomChance();
    changeUI();
}

//Changes ui on change of turn of players
function changeUI(){

    $('.player').removeClass('player-highlighted');        
    $('.player').eq(chance==1?0:1).addClass('player-highlighted');        
    changeMessage(getPlayerName(chance) + " Chance");

}

//Function to alternate between players 
function changeChance(){
    if(chance == 1)
        chance = -1;
    else
        chance = 1;

    changeUI();
}


//Function to check win/lose/draw cases
function check()
{

    var i;
    //Check All rows
    var sum =0;
    for( i= 0;i<7;i=i+3)
    {    sum = 0;
     for( j=i;j<i+3;j++)
         sum +=c[j];

     if(sum == 3)
     { updateWinner(1);
      return 1;
     }
     else if(sum == -3)
     { updateWinner(2);
      return 1;
     }
     console.log(c);

    }
    //check all columns
    for( i= 0;i<3;i++)
    {  sum = 0;
     for( j=i;j<i+7;j=j+3)
         sum +=c[j];
     console.log("sum : " + sum);

     if(sum == 3)
     {updateWinner(1);
      return 1;
     }
     else if(sum == -3)
     { updateWinner(2);
      return 1;
     }
     console.log(c);

    }

    if((c[0] == c[4]) && (c[4] == c[8]) && (c[0]!=0))
    {
        if(c[0] == 1)
        { updateWinner(1);
         return 1;
        }
        else
        { updateWinner(2);
         return 1;
        }
    }

    if((c[2] == c[4]) && (c[4] == c[6]) && (c[2]!=0))
    {
        if(c[2] == 1)
        { updateWinner(1);
         return 1;
        }
        else
        { updateWinner(2);
         return 1;
        }
    }
    var k =0;
    for(i=0;i<10;i++)
    {
        if(c[i] == 0)
        {
            k =1;
            break;
        }
    }
    if(k == 0)
    {
        changeMessage('Draw');
        return 1;
    }
    return 0;

}


//Handles click on each cell of tic tac toe

$('td').click(function(){    

    if(!areBothLoggedIn())
    {
        alert('Both Players Login to Continue');
        return;
    }

    if(!gameover)
    {  var t = chance == 1?'X':'0';
     var pos = Number($(this).attr('id'));
     if(c[pos] != 0)
     {alert('Already Marked');
      return;
     }
     $(this).html(t);
     c[pos] = chance;


     if(check())
     {gameover = 1;
      $('td').addClass('win-box');
      setTimeout(function(){
          $('.message').addClass('message-win');
      },1000)
      $('.restart-btn').fadeIn(1000);

      return;
     }
     changeChance();
    }
    else
    {
        //alert('gameover');
    }

})

//Restart -> reload the page

$('.restart-btn').click(function(){
    window.location.reload();
})

// Login Form Submit Function 
$(document).on('submit','.login-form',function(e){
    e.preventDefault();
    alert('in login');
    console.log($(this).serialize());
    var form = $(this);
    $.ajax({
        url:localhost + '/api/login',
        'type':'POST',
        data:$(this).serialize(),
        statusCode : {
            '400':function(){
                console.log('Bad Request');
            },
            '404' : function(){
                alert('Login Failed');
            },
            '200' : function(data){
                var id = form.find('input[type=hidden]').val();
                console.log(id);
                form.parent().hide();
                let player  = form.closest('.player');
                afterLogin(player,id,data);

            }
        }
    })
})


//Logout Function
$('.logout').click(function(){
    var id = $(this).next().find('input[type=hidden]').val();
    localStorage.removeItem("username"+id); 
    window.location.reload();
});

//On click toggle login dropdown
$('.login-txt').click(function(){
    $(this).parent().find('.login-dropdown').toggle();
})

checkPrevPlayers();




