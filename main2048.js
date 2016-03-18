//先创建一个空数组，用来存储16个格子的数据
var board=new Array();
//创建score变量用来内存储分数
var score=0;
//在最初完成后，发现了bug，就是2 2 4，直接合并为了8，
//为了消除这个bug，特意创建此变量，用来使一个格子发生一次叠加后，在刷新面板之前，禁止再次叠加。
var hasConflicted=new Array();

var startX=0;
var startY=0;
var endX=0;
var endY=0;

//页面加载完成后，开始一个新游戏
$(document).ready(function(){
  prepareForMobile();
	newGame();
});
function prepareForMobile()
{
  if (documentWidth>500) 
  {
    gridContainerWidth=500;
    cellSpace=20;
    cellSideLength=100;
  }
  $('.grid-container').css('width',gridContainerWidth-2*cellSpace);
  $('.grid-container').css('height',gridContainerWidth-2*cellSpace);
  $('.grid-container').css('padding',cellSpace);
  $('.grid-container').css('border-radius',0.02*gridContainerWidth);

  $('.grid-cell').css('width',cellSideLength);
  $('.grid-cell').css('height',cellSideLength);
  $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
//新游戏的具体过程
function newGame()
{
	//初始化棋盘格
	init();
	//随机生成一个数字
  randomOneNumber();
  //随机生成一个数字，就如同我们看到的新游戏时的两个数字
  randomOneNumber();
  //刷新分数
  updateScore(score);
}
//初始化棋盘格的过程
function init()
{
  //先建立16个棋盘格子
	for(var i=0;i<4;i++)
	{
		for(var j=0;j<4;j++)
		{
			var gridCell=$("#grid-cell-"+i+"-"+j);
      //每个格子的位置用getPosTop(),getPosLeft()来计算，具体步骤在support.js里
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
  //再将用于存储数据的board初始化为4*4的数组
		for(var i=0;i<4;i++)
	{
		board[i]=new Array();
    hasConflicted[i]=new Array();
		for(var j=0;j<4;j++)
		{
			board[i][j]=0;
      //此处依然为每个数字没有发生叠加
      hasConflicted[i][j]=false;
		}
	}
  //分数设置为0
  score=0;
  //刷新面板
	updateBoardView();

	
}
  //刷新面板具体过程
  function updateBoardView()
  {
    //先移除上一次面板数据
  	$(".number-cell").remove();
    //再重新为每个格子插入新数据
  	for(var i=0;i<4;i++)
  	{
      		for(var j=0;j<4;j++)
      		{
            //首先先为整个容器插入4*4的数字块，和格子正好覆盖，并且编好号
      			$(".grid-container").append("<div class='number-cell' id='number-cell-"+i+'-'+j+"'></div>"); 
            //将遍历过程中的某个数字块赋值给theNumberCell
      			var theNumberCell=$("#number-cell-"+i+"-"+j); 
            //如果此数字块的值为0，则此数字块不显示
                  if(board[i][j]==0)
              {
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
              }
              //若不为0，则显示
              else
              {
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getBackGroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);

              } 
              //此处依然为每个数字没有发生叠加
              hasConflicted[i][j]=false;   
      		}
          $('.number-cell').css('line-height',cellSideLength+'px');
          $('.number-cell').css('font-size',0.6*cellSideLength+'px');
  	}
  	
    

  }
//随机生成一个数字的过程
function randomOneNumber()
{
  //如果当前面板没有空余空间可用来生成数字，则退出
    if (noSpace(board)) 
    {
       return false;
    }

    //先随机选择一个位置
    var randomX=parseInt(Math.floor(Math.random()*4));
    var randomY=parseInt(Math.floor(Math.random()*4));
    //此处选择添加一个死循环为了若随机选择的位置已有数字则再随机选择直到找到空位置    
    while(true)
    {
      if(board[randomX][randomY]==0)
      {
         break;
      }
      randomX=parseInt(Math.floor(Math.random()*4));
      randomY=parseInt(Math.floor(Math.random()*4));
    }
    //随机生成一个2或4
    var randNumber=Math.random() < 0.5 ? 2 : 4 ;
    //在随机生成的位置将将随机生成的数字显示出来
    board[randomX][randomY]=randNumber;
    //将数字显示出来的过程是一个动画，具体过程在showanimation2048.js里
    showNumberAnimation(randomX,randomY,randNumber);
    return true;
}
//按下键盘后开始触发游戏
$(document).keydown(function(event){
     //首先先阻止键盘的默认事件，防止出现按上下左右键时网页本身也跟着晃动
     
     //根据不同的按键出现不同的时间
    switch(event.keyCode)
    {
      //left键的键码为37
      case 37: 
         event.preventDefault();
          //如果触发了向左移动
         if(moveLeft())
         {
            //则随机产生一个数字
            setTimeout('randomOneNumber()',210);
            //并且查看是否达到游戏结束的条件，如果是，则游戏结束
            setTimeout('isGameOver()',300);
         }  //left
      break;
      case 38:
          event.preventDefault();
          if(moveUp())
         {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
         }    //up
      break;
      case 39: 
          event.preventDefault();
         if(moveRight())
           {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
           }   //right
      break;
      case 40: 
      event.preventDefault();
        if(moveDown())
           {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
           }   //down
      break;
      default:
      break;
    }  
});

document.addEventListener('touchstart',function(event){
  startX=event.touches[0].pageX;
  startY=event.touches[0].pageY;
});
document.addEventListener('touchmove',function(event){
  event.preventDefault();
});
document.addEventListener('touchend',function(event)
{
  endX=event.changedTouches[0].pageX;
  endY=event.changedTouches[0].pageY;

  var deltaX=endX-startX;
  var deltaY=endY-startY;
  if (Math.abs(deltaX)<0.2*gridContainerWidth&&Math.abs(deltaY)<0.2*gridContainerWidth) {return;}

  if (Math.abs(deltaX)>=Math.abs(deltaY)) 
  {
    if (deltaX>0)
    {
      if(moveRight())
           {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
           }
    }
    else
    {
       if(moveLeft())
         {
            //则随机产生一个数字
            setTimeout('randomOneNumber()',210);
            //并且查看是否达到游戏结束的条件，如果是，则游戏结束
            setTimeout('isGameOver()',300);
         }  //left
    }
  }
  else
  {
    if (deltaY>0) 
    {
      if(moveDown())
           {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
           }  
    }
    else
    {
      if(moveUp())
         {
            setTimeout('randomOneNumber()',210);
            setTimeout('isGameOver()',300);
         } 
    }

  }
});

//向左移动的具体过程
function moveLeft()
{
  //首先要判断是否可以向左移动，具体判断过程在support2048.js里
    if(!canMoveLeft(board))
    {
      return false;
    }
    //moveLeft
    for(var i=0;i<4;i++)
    {
      for(var j=1;j<4;j++)
      {
        //首先要判断一下要移动的某个数字是否不为0，若不为0，则接着进行
        if(board[i][j]!=0)
        {
          for(var k=0;k<j;k++)
          {
            //如果[i][j]位置的数字要运动到[i][k]位置，且此位置为0，
            //并且两个位置之间没有障碍物，如何判断是否有障碍物在support2048.js
            if(board[i][k]==0&&noRowBlock(i,k,j,board))
            {
              //则移动到[i][k]位置，并且显示移动的动画
              showMoveAnimation( i , j , i , k );
              board[i][k]=board[i][j]
              board[i][j]=0;
              continue;
            }
            //如果[i][j]位置的数字要运动到[i][k]位置，且此位置的值和[i][j]位置的值相等，
            //并且两个位置之间没有障碍物，如何判断是否有障碍物在support2048.js，另外还要判断目的位置是否已经发生过一次叠加
            else if(board[i][k]==board[i][j]&&noRowBlock(i,k,j,board)&&!hasConflicted[i][k])
            {
              //则移动到[i][k]位置，并且显示移动的动画
              showMoveAnimation( i , j , i , k );
              //并且和原有的值叠加
              board[i][k]+=board[i][j];
              board[i][j]=0;
              //计算分数
              score+=board[i][k];
              //刷新网页显示分数
              updateScore(score);
              //将目的位置标记为发生过叠加
              hasConflicted[i][k]=true;
              continue;
            }
          }
        }
      }
    }
    setTimeout('updateBoardView()',200);
    return true;
}
function moveUp()
{
    if(!canMoveUp(board))
    {
      return false;
    }
    //moveLeft
    for(var i=1;i<4;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(board[i][j]!=0)
        {
          for(var k=0;k<i;k++)
          {
            if(board[k][j]==0&&noColBlock(j,k,i,board))
            {
              showMoveAnimation( i , j , k , j );
              board[k][j]=board[i][j]
              board[i][j]=0;
              continue;
            }
            else if(board[k][j]==board[i][j]&&noColBlock(j,k,i,board)&&!hasConflicted[k][j])
            {
              showMoveAnimation( i , j , k , j );
              board[k][j]+=board[i][j];
              board[i][j]=0;
              score+=board[k][j];
              updateScore(score);
              hasConflicted[k][j]=true;
              continue;
            }
          }
        }
      }
    }
    setTimeout('updateBoardView()',200);
    return true;
}
function moveRight()
{
    if(!canMoveRight(board))
    {
      return false;
    }
    //moveLeft
    for(var i=0;i<4;i++)
    {
      for(var j=2;j>=0;j--)
      {
        if(board[i][j]!=0)
        {
          for(var k=3;k>j;k--)
          {
            if(board[i][k]==0&&noRowBlock(i,j,k,board))
            {
              showMoveAnimation( i , j , i , k );
              board[i][k]=board[i][j]
              board[i][j]=0;
              continue;
            }
            else if(board[i][k]==board[i][j]&&noRowBlock(i,j,k,board)&&!hasConflicted[i][k])
            {
              showMoveAnimation( i , j , i , k );
              board[i][k]+=board[i][j];
              board[i][j]=0;
              score+=board[i][k];
              updateScore(score);
              hasConflicted[i][k]=true;
              continue;
            }
          }
        }
      }
    }
    setTimeout('updateBoardView()',200);
    return true;
}
function moveDown()
{
    if(!canMoveDown(board))
    {
      return false;
    }
    //moveLeft
    for(var i=0;i<3;i++)
    {
      for(var j=0;j<4;j++)
      {
        if(board[i][j]!=0)
        {
          for(var k=3;k>i;k--)
          {
            if(board[k][j]==0&&noColBlock(j,i,k,board))
            {
              showMoveAnimation( i , j , k , j );
              board[k][j]=board[i][j]
              board[i][j]=0;
              continue;
            }
            else if(board[k][j]==board[i][j]&&noColBlock(j,i,k,board)&&!hasConflicted[k][j])
            {
              showMoveAnimation( i , j , k , j );
              board[k][j]+=board[i][j];
              board[i][j]=0;
              score+=board[k][j];
              updateScore(score);
              hasConflicted[k][j]=true;
              continue;
              
            }
          }
        }
      }
    }
    setTimeout('updateBoardView()',200);
    return true;
}
//判断是否游戏结束的具体过程
function isGameOver()
{
  //如果已经没有空间可产生新数字并且现有的数字没有可移动的了
  if (noSpace(board) && noMove()) 
  {
    //则弹出Game Over!
    alert('Game Over!');
  }
}
//判断没有数字可移动的过程
function noMove()
{
  if(canMoveDown(board)||canMoveLeft(board)||canMoveRight(board)||canMoveUp(board))
  {
    return false;
  }
  return true;
}
