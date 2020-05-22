const arr = [
    {
      name: "x", 
      age: 14
    },
    {
      name: "xdd", 
      age: 11
    },
    {
      name: "t", 
      age: 144
    },
    {
      name: "yy", 
      age: 19
    },
    {
      name: "yyy", 
      age: 20
    },
];

function filter(array,limit,mult) {
    let shadow =[]
    for(pessoa in array){
        if(array[pessoa].age<limit){
            shadow.push({"name":array[pessoa].name,"age":array[pessoa].age})
        }else{shadow.push({"name":array[pessoa].name,"age":array[pessoa].age*mult})}
    } 
    return shadow
}
console.log(filter(arr,14,3))
console.log(arr.map((pessoa)=>{if(pessoa.age<14){return pessoa}else{return {'name':pessoa.name,"age":pessoa.age*3}}}))