# Node.Js Express MongoDB サンプルアプリ

> Node.Js、Express、MongoDB で作成した、簡易作業管理アプリです
> - ログイン認証
> - CRUD
> - パスワード変更

## プロジェクト作成方法

```
$ npm init
$ npm install ejs express express-ejs-layouts express-session express-validator http-status-codes method-override mongoose passport passport-local-mongoose cookie-parser connect-flash
```

## 実行方法

```
$ npm install
$ node main.js
```

## ビルド

```
$ ng build

$ sudo npm install -g http-server
$ http-server ./dist/ng_bootstrap_sample -p3000 -c-1
```

- http://localhost:3000/

## 参考文献

- Angular
  - [Angular Docs](https://angular.jp/docs)
  - [Angular2によるモダンWeb開発 基礎編](https://project.nikkeibp.co.jp/bnt/atcl/17/P96530/)
  - [AngularによるモダンWeb開発 基礎編 第2版](https://project.nikkeibp.co.jp/bnt/atcl/19/P54530/)
  - [Angular powered Bootstrap](https://ng-bootstrap.github.io/#/getting-started)
- Bootstrap
  - [Bootstrap v5.0](https://getbootstrap.jp/docs/5.0/getting-started/introduction/)

## サーバー構築（CentOS Stream release 8）

> 動作環境
> - [WebARENA Indigo](https://web.arena.ne.jp/indigo/)
>   - 事前に以下で、Webサーバー環境を作っておく
>     - `01_Indigo.md`
>     - `02_Apache.md`
>     - `80_NodeJs.md`

> https://github.com/develop986/centos_server

### 動作環境構築

```
# npm install -g @angular/cli@13.3.5
# git clone https://github.com/develop986/ng_bootstrap_sample
# git pull
# mkdir /var/www/ng_bootstrap_sample
# cp -a ng_bootstrap_sample/dist/ng_bootstrap_sample/* /var/www/ng_bootstrap_sample/
```

```
ビルドする場合は、更に以下を実施

# cd ng_bootstrap_sample
# npm install
$ ng build
```

### VirtualHost 設定

```
# vi /etc/httpd/conf/httpd.conf

以下のファイルを作成する

<VirtualHost *:80>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/ng_bootstrap_sample/
    ServerName ngbootstrapsample.mysv986.com
    ServerAlias ngbootstrapsample.mysv986.com
RewriteEngine on
RewriteCond %{SERVER_NAME} =ngbootstrapsample.mysv986.com
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

```
# systemctl restart httpd
# certbot --apache -d ngbootstrapsample.mysv986.com
# systemctl restart httpd
```

```
# cat /etc/httpd/conf/httpd-le-ssl.conf

以下のファイルが作成される。

<VirtualHost *:443>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/ng_bootstrap_sample/
    ServerName ngbootstrapsample.mysv986.com
    ServerAlias ngbootstrapsample.mysv986.com

SSLCertificateFile /etc/letsencrypt/live/ngbootstrapsample.mysv986.com/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/ngbootstrapsample.mysv986.com/privkey.pem
Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
```

https://ngbootstrapsample.mysv986.com