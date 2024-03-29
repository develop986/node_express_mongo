## CentOSでのアプリ環境構築（CentOS Stream release 8）

> 動作環境
> - [WebARENA Indigo](https://web.arena.ne.jp/indigo/)
>   - 事前に以下で、Webサーバー環境を作っておく
>     - `01_Indigo.md`
>     - `02_Apache.md`
>     - `80_NodeJs.md`
>     - `80_MongoDB.md`

> https://github.com/develop986/centos_server

### 動作環境構築

```
# git clone https://github.com/develop986/node_express_mongo
# git pull
# cd node_express_mongo/app
# npm install
```

## サービス作成

```
  580  vi /etc/systemd/system/nodeexpressmongo.service
  581  cat /etc/systemd/system/nodeexpressmongo.service
  582  systemctl enable nodeexpressmongo.service
  583  systemctl start nodeexpressmongo.service
  584  systemctl stop nodeexpressmongo.service
  586  systemctl restart nodeexpressmongo.service

[root@centos ~]# cat /etc/systemd/system/nodeexpressmongo.service
[Unit]
Description=nodeexpressmongo server
After=syslog.target network.target

[Service]
Type=simple
ExecStart=/usr/bin/node /root/node_express_mongo/app/main.js
WorkingDirectory=/root/node_express_mongo/app
KillMode=process
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target
```

### VirtualHost 設定

```
# vi /etc/httpd/conf/httpd.conf

以下のファイルを作成する

<VirtualHost *:80>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/html/
    ServerName nodeexpressmongo.mysv986.com
    ServerAlias nodeexpressmongo.mysv986.com
RewriteEngine on
RewriteCond %{SERVER_NAME} =nodeexpressmongo.mysv986.com
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

```
# systemctl restart httpd
# certbot --apache -d nodeexpressmongo.mysv986.com
# systemctl restart httpd
```

```
# vi /etc/httpd/conf/httpd-le-ssl.conf

Include以下に、SSLProxy設定を追記する。

<VirtualHost *:443>
    ServerAdmin room@mysv986.com
    DocumentRoot /var/www/html/
    ServerName nodeexpressmongo.mysv986.com
    ServerAlias nodeexpressmongo.mysv986.com

SSLCertificateFile /etc/letsencrypt/live/nodeexpressmongo.mysv986.com/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/nodeexpressmongo.mysv986.com/privkey.pem
Include /etc/letsencrypt/options-ssl-apache.conf

    SSLEngine on
    SSLProxyVerify none
    SSLProxyCheckPeerCN off
    SSLProxyCheckPeerName off
    SSLProxyCheckPeerExpire off
    SSLProxyEngine on
    ProxyRequests off
    ProxyPass / http://nodeexpressmongo.mysv986.com:3000/
    ProxyPassReverse / http://nodeexpressmongo.mysv986.com:3000/

</VirtualHost>
```

```
# systemctl restart httpd
```

## アクセス

- https://nodeexpressmongo.mysv986.com

> テスト用に、権限なしでユーザーを追加できるようにしています。  
> 以下にアクセスして下さい。

- https://nodeexpressmongo.mysv986.com/users/new