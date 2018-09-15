var request = require("request");

exports.handler = (event, context, callback) => {
    // read price.json
    var url = "https://s3.ap-northeast-2.amazonaws.com/hanbitco/price.json";
    var strCurrency = "KRW";

     request({
        url: url,
        json: true
     }, function (error, response, priceInput) {
        if (!error && response.statusCode === 200) {   
            var data = new Object();
            
            for (let curr in priceInput)
            {
                if(event.currency == ""){
                    if((curr).substr(curr.length -3) != strCurrency){
                        continue;
                    }
                }
                else{
                    if((curr) != (event.currency).toUpperCase() + "_" + strCurrency){
                        continue;
                    }
                }                            
                
                data[curr] = new Object();
                
                for (let exchange in priceInput[curr])
                {
                    data[curr][exchange] = new Object();
                    data[curr][exchange]["originPair"] = priceInput[curr][exchange].originPair;
                    data[curr][exchange]["last"] = priceInput[curr][exchange].last;      
                }
            }
    
            var status = "";

            if(JSON.stringify(data).length <= 2){
                status = "failed"; 
            }
            else{
                status = "success";
            }
            
            const result = {
                status: status,
                data: data
            };
            
            callback(null, result);                        
        }
     });
};