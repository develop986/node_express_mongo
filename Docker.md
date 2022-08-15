## Dockerでのアプリ環境構築

- [Node.js Web アプリケーションを Docker 化する](https://nodejs.org/ja/docs/guides/nodejs-docker-webapp/)
- [Dockerでnginx + Node.js + MongoDBの環境を用意する](https://zenn.dev/cizneeh/articles/nginx-node-mongo-docker-example)
- [Let’s EncryptとcertbotとDockerを使ってwebアプリをSSL化する](https://blog.panicblanket.com/archives/6759)
- [dockerでlet's encryptを使ってSSLを有効にする](https://paulownia.hatenablog.com/entry/2020/09/12/150658)

### 構成

- 開発環境（パソコンでの作業）
  - アプリ：[リンク](./app/)、[docker-compose.yml](./app/docker-compose.yml)、[Dockerfile](./app/Dockerfile)

- 公開環境（VPSでの作業）
　- 全体：[docker-compose.yml](docker-compose.yml)
    - アプリ：[リンク](./app/)、[Dockerfile](./app/Dockerfile)
    - Nginx：[リンク](./nginx/)
    - MongoDB：[リンク](./mongo/)
  - SSL証明書作成、更新
    - Certbot：[リンク](./certbot/)、[docker-compose.yml](certbot/docker-compose.yml)


### 開発環境（パソコンでの作業）

#### ビルド（合わせて起動）

```
$ cd app
$ docker compose up -d
$ curl -v http://localhost:3000
```

http://localhost:3000
http://localhost:3000/users/new

#### 構成の確認

```
イメージ一覧
$ docker images

コンテナ一覧（実行中のみ）
$ docker ps

コンテナ一覧（未実行分も含む）
$ docker ps -a
```

#### 最新化

```
$ docker compose down && docker image rm -f app_app:latest && docker compose up -d
```

#### 状況確認用

```
$ docker logs app
$ docker exec -it app bash

$ docker logs mongo
$ docker exec -it mongo bin/bash
```

#### 起動、停止

```
$ docker stop app
$ docker start app
```



    

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

キャッシュの削除
$ docker system df
$ docker builder prune
```

### コンポーネント一括操作

```
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

ネットワーク状況確認用
# apt update && apt install -y iputils-ping net-tools dnsutils iproute2
# ip addr
# ping app

http://172.21.0.3:3000/
```

### 公開環境（VPSでの作業）

> [Dockerインストール](https://github.com/develop986/ubuntu_server/blob/main/02.Docker.md) まで終わらせておくこと

```
$ sudo su -
# git clone https://github.com/develop986/node_express_mongo
# cd node_express_mongo/certbot/
# docker compose up -d nginx
# docker compose run --rm certbot certonly --webroot -w /var/www/html -d nodeexpressmongo.mysv986.com

 (Enter 'c' to cancel): kuhataku@gmail.com

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server. Do you agree?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: Y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing, once your first certificate is successfully issued, to
share your email address with the Electronic Frontier Foundation, a founding
partner of the Let's Encrypt project and the non-profit organization that
develops Certbot? We'd like to send you email about our work encrypting the web,
EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: N


これで証明書が /etc/letsencrypt 以下に保存される

一旦削除
# docker compose down -v


# cd
# cd node_express_mongo
# docker compose up -d

# curl -v http://nodeexpressmongo.mysv986.com
# curl -v https://nodeexpressmongo.mysv986.com
```

自動更新設定

```
# vi /etc/cron.weekly/renew-cert 

#!/bin/bash
{
    echo "---- start renew-cert $(date '+%Y-%m-%d %H:%M:%S')"
    docker compose -f /root/node_express_mongo/certbot/docker-compose.yml run --rm certbot renew \
    && docker exec nginx nginx -s reload
} >> /var/log/renew-cert.log 2>&1
```