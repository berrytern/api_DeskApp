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
    {
        nqme:"dsasd",
        age:10
    }
];
console.log(arr.map((isso=>isso['name'])))
console.log(arr.reduce(((isso,next)=>{console.log(isso,next);if(typeof isso!='undefined'){if(typeof isso.name!='undefined'){console.log('first',isso.name);if(isso.age<15){if(next.age<15){return [{'age':isso.age},{'age':next.age}]}else{return [{'age':isso.age}]}}else if(next.age<14){return [{'age':next.age}]}}else if(next.age<15){return isso.push([{"age":next.age}])}else{return isso}}})))
console.log(arr.filter((isso)=>isso.age<15).map((isso)=>{return{'age':isso.age}}))