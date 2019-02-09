var c = [ 0,0,0,0,0,0,0,0,0];
var gameover = 0;
function getPlayerName(x){
    return x == 1 ? 'Player 1' : 'Player 2';
}

function changeMessage(message){
    $('.message').text(message);
}

function getRandomChance(){

    return Math.floor(Math.random()*2) == 0?-1:1;
}
var chance = getRandomChance();
changeUI();

function changeUI(){

    $('.player').removeClass('player-highlighted');        
    $('.player').eq(chance==1?0:1).addClass('player-highlighted');        
    changeMessage(getPlayerName(chance) + " Chance");

}
function changeChance(){
    if(chance == 1)
        chance = -1;
    else
        chance = 1;

    changeUI();
}

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
     { changeMessage('Player 1 Wins');
      return 1;
     }
     else if(sum == -3)
     { changeMessage('Player 2 Wins');
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
     {changeMessage('Player 1 Wins');
      return 1;
     }
     else if(sum == -3)
     { changeMessage('Player 2 Wins');
      return 1;
     }
     console.log(c);

    }

    if((c[0] == c[4]) && (c[4] == c[8]) && (c[0]!=0))
    {
        if(c[0] == 1)
        { changeMessage('Player 1 Wins');
         return 1;
        }
        else
        { changeMessage('Player 2 wins');
         return 1;
        }
    }

    if((c[2] == c[4]) && (c[4] == c[6]) && (c[2]!=0))
    {
        if(c[2] == 1)
        { changeMessage('Player 1 Wins');
         return 1;
        }
        else
        { changeMessage('Player 2 wins');
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


$('td').click(function(){    
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

$('.restart-btn').click(function(){
    window.location.reload();
})
