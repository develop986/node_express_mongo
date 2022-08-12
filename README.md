[Node.js Web アプリケーションを Docker 化する](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)

```
$ docker build --no-cache -t develop986/debian_nodejs_server .
$ docker run -p 3000:3000 -d --name testserver develop986/debian_nodejs_server
$ curl -i localhost:3000
$ docker logs testserver


コンテナに接続する場合
$ docker exec -it testserver /bin/bash
```

### 削除する場合

```
$ docker ps -a
$ docker rm -f testserver
$ docker images
$ docker image rm -f develop986/debian_nodejs_server
$ docker image rm -f node:16
```

[Dockerでnginx + Node.js + MongoDBの環境を用意する](https://zenn.dev/cizneeh/articles/nginx-node-mongo-docker-example)

```
$ docker compose up -d

コンポーネントを削除する場合
$ docker compose down -v
```