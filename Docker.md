## Dockerでのアプリ環境構築

- [Node.js Web アプリケーションを Docker 化する](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)
- [Dockerでnginx + Node.js + MongoDBの環境を用意する](https://zenn.dev/cizneeh/articles/nginx-node-mongo-docker-example)

### 古いデータを全て削除する場合

```
全コンテナ一括削除
$ docker rm -f `docker ps -a -q`

未使用イメージ一括削除
$ docker rmi `docker images -q`

未使用ボリューム一括削除
$ docker volume prune

未使用ネットワーク一括削除
$ docker network prune
'''

### コンポーネント一括操作

コンポーネントを一括作成し、起動
$ docker compose up -d

http://localhost

コンポーネントを削除する場合
$ docker compose down -v
```

### 状態の確認

```
イメージ
$ docker images

実行中コンテナ
$ docker ps

全てのコンテナ
$ docker ps -a

状態確認
$ docker logs nginx
$ docker logs app
$ docker logs mongo

接続
$ docker exec -it nginx bin/bash
$ docker exec -it app bash
$ docker exec -it mongo bin/bash