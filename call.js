        // note that num must be obtained
        var link=LINX_URL+"clientId="+LINX_CLIENT_ID+"&msisdn="+num+"&requestId="+uniqid('1linx_');
        var sendURL=URL_LINX_AUTH+"link="+encodeValue(link);
        $.ajax({
            type:           'GET',
            url:            sendURL,
            async :         true,
            dataType:       'JSONP', 
            jsonpCallback:  "jsonpcallback",
            success:        function(res){
              // formats and puts the return in div id="result"
              document.getElementById("result").innerHTML = "";
              var result = JSON.stringify(JSON.parse(res), undefined, 2);
              $("#result").append("<pre class="+ "\"" +"prettyprint"+ "\""+ ">" + result + "</pre>");
              $.getScript("https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js?lang=css&skin=sunburst");
              client.log(" - reply:\n"+res);
              eval(callback.replace("%1",res));
            },
            error: function (xhr, ajaxOptions, thrownError) {
               eval(callback.replace("%1","ERROR "+thrownError));
            }
        });