[Node.js Web アプリケーションを Docker 化する](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)

```
$ docker build --no-cache -t develop986/node_express_mongo .
$ docker run -p 3000:3000 -d --name testapp develop986/node_express_mongo
$ curl -i localhost:3000
$ docker logs testapp


コンテナに接続する場合
$ docker exec -it testapp /bin/bash
```

### 削除する場合

```
$ docker ps -a
$ docker rm -f testapp
$ docker images
$ docker image rm -f develop986/node_express_mongo
$ docker image rm -f node:16
```

[Dockerでnginx + Node.js + MongoDBの環境を用意する](https://zenn.dev/cizneeh/articles/nginx-node-mongo-docker-example)

```
$ docker compose up -d

コンポーネントを削除する場合
$ docker compose down -v
```