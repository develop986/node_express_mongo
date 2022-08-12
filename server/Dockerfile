FROM node:latest

# アプリケーションディレクトリを作成する
WORKDIR /var/www/
RUN git clone https://github.com/develop986/node_express_mongo
WORKDIR /var/www/node_express_mongo


# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./

RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production

# アプリケーションのソースをバンドルする
# COPY . .

EXPOSE 3000
CMD [ "node", "main.js" ]