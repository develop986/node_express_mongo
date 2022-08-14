FROM nginx:latest

# デフォルトの設定を削除
RUN rm /etc/nginx/conf.d/default.conf

# 作成した設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d