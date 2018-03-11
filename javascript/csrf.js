$(document).ready(()=>{
    $.ajax({
        
         url: "http://luffy.ee.ncku.edu.tw:17487/",
         data: {
        
         zipcode: 97201
        
         },
        
         success: function( result ) {
        
         $( "#csrf" ).html( "<h3>sucess</h3>" );
        
         }
        
        });
});