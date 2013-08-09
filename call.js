        // note that num must be obtained
        var URL_LINX_AUTH="http://payfone.snkpk.com/test/php2js/linxauth.php?";
        var link = "msisdn="+num;
        var sendURL=URL_LINX_AUTH+link;
        $.ajax({
            type:           'GET',
            url:            sendURL,
            async :         true,
            dataType:       'JSONP', 
            jsonpCallback:  "jsonpcallback",
            success:        function(res){
              // use the result here
              eval(callback.replace("%1",res));
            },
            error: function (xhr, ajaxOptions, thrownError) {
               eval(callback.replace("%1","ERROR "+thrownError));
            }
        });