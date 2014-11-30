function ergodic(obj,indentation){
  var indent = "  " + indentation;
  if(obj.constructor == Array || obj.constructor == Object){
 
    for(var p in obj){
      if(obj[p].constructor == Array|| obj[p].constructor == Object){
        console.log(indent + "["+p+"] => "+typeof(obj)+"");
        console.log(indent + "{");
        ergodic(obj[p], indent);
        console.log(indent + "}");
      } else if (obj[p].constructor == String) {
        console.log(indent + "["+p+"] => '"+obj[p]+"'");
      } else {
        console.log(indent + "["+p+"] => "+obj[p]+"");
      }
    }
  }
}
 
function print_r(obj) {
  console.log("{")
  ergodic(obj, "");
  console.log("}")
}
 
module.exports = {print_r: print_r}