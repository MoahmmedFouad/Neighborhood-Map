/*
update when resize the window
*/
var LocationListWidth = $('.application .locationsList').width();
$('.searchIcon .search input').width(LocationListWidth-10);

$(window).resize(function(){
    var innerwid = window.innerWidth;
     var locationListWidth = $('.application .locationsList').width();
    if(innerwid>=767)
    {
        $('.searchIcon .search input').width(locationListWidth-32);   
    }
    
    else{
        $('.searchIcon .search input').css('width','100%');
    }
    
});
