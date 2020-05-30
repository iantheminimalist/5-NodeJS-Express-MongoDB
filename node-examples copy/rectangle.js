module.exports = (x, y , callback) => { //assign a function as the value for the entire export
    if(x <= 0 || y <= 0){  //if the arguements that are received are invalid.
        //standard practice for asybc functions return an error function first. 
        callback(new Error(`Rectangle dimensions must be greater than zero. Recieved ${x}, ${y}`));
    } else{
        //simulate a situation where a asynce needs to be made.
        setTimeout(() => 
        callback(null, { // object with 2 methods
                perimeter : () => 2 * (x + y),
                area : () => x * y
        }),
        2000 //duration
        );
    }
};



