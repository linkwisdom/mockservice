# !env/bash
node index.js
&
curl http://localhost:8848/request.ajax?path=GET/user&param={"userid":12}
&
curl -d  param={"userid":12} http://localhost:8848/request.ajax?path=GET/user