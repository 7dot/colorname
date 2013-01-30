var filedata, average, w, h, imagedata;

$(function(){

  reset();

  var reader = new FileReader();
  reader.onload = function(e){
    filedata = e.target.result;
   
    if(filedata){
      var img = new Image();
      img.src = filedata;
      $(img)
        .load(function(){
          $('#sample').append(img);
          define_color_name();
        })
        .css('cursor','crosshair')
        .mouseout(function(){
           $('#average').css('background-color','rgb('+average[0]+','+average[1]+','+average[2]+')');
           define_name(average);
         })
        .mousemove(function(e){
          var kw = w / $(this).width();
          var kh = h / $(this).height();
          var pos = $(this).position();
          var x = Math.floor( (e.clientX - pos.left) * kw );
          var y = Math.floor( (e.clientY - pos.top) * kh );
          var i = 4 * (w * y + x);
          var r = imagedata[i], g = imagedata[i+1], b = imagedata[i+2]; 
          $('#average').css('background-color','rgb('+r+','+g+','+b+')');
          define_name([r,g,b]);
         });
    } 

  };

  $('#file').change(function(e){
    reset();
    reader.readAsDataURL(e.target.files[0]);                  
  });
  
});

function reset(){
  $('#sample').html('');
  $('#name').html('');
  $('#average').css('background-color','rgb(255,255,255)');
  $('#color').css('background-color','rgb(255,255,255)');
  $('#headers').hide();
  $('#name').hide();
}

function define_color_name(){

  $('#headers').show();

  var img = new Image();
  img.src = filedata;
  img.style.position = "absolute";
  img.style.left = "-9999px";
  document.body.appendChild(img);
  w = img.offsetWidth;
  h = img.offsetHeight;

  var canvas, ctx;
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img,0,0,w,h);
  var imgdata=ctx.getImageData(0,0,w,h);
  imagedata = imgdata.data;
  document.body.removeChild(img);
  define_average(imgdata);

}

function define_average(imgdata){

  var data = imgdata.data;
  var w = imgdata.width;
  var h = imgdata.height;
  var w4 = w*4;
  var amount = w * h;
  var r=0, g=0, b=0;
  var y = h;
  do {
       var offsetY = (y-1)*w4;
       var x = w;
       do{
            var offset = offsetY + (x-1)*4;
            r += data[offset];
            g += data[offset+1];
            b += data[offset+2];
       } while (--x);
  } while (--y);
  r = Math.round( r / amount );
  g = Math.round( g / amount );
  b = Math.round( b / amount );
  $('#average').css('background-color','rgb('+r+','+g+','+b+')').height($('#sample').height());
  average = [r,g,b];
  similar = define_name(average);
}

function define_name(rgb){
  var i = compare_rgb(rgb, wikiColors);
  $('#color').css('background-color','rgb('+wikiColors[i][2][0]+','+wikiColors[i][2][1]+','+wikiColors[i][2][2]+')')
             .height($('#sample').height()); 
  $('#name').html('<div class="well">'+wikiColors[i][1] + ' ( ' + wikiColors[i][0] + ' )</div>').show();
  return i; 
}

function compare_rgb(sample, colors){
  var index, d=195076;

  for(var i=0,l=colors.length; i<l; i++){
    var delta = Math.pow(colors[i][2][0]-sample[0],2)+Math.pow(colors[i][2][1]-sample[1],2)+Math.pow(colors[i][2][2]-sample[2],2); 
    if(delta < d){
      index = i;
      d = delta;
    }
  }
  return index;	
}