## アプリ説明と開発環境

- 管理者ユーザーと、通常ユーザーの二種類が作成できます。
- どちらのユーザーも、入退登録と、作業登録の二種類の入力と
  以下テーブルのCRUD操作が可能です。
  - 入室項目（マスタテーブル）
  - 作業項目（マスタテーブル）
- 管理者ユーザーは、更に以下テーブルのCRUD操作が可能ですが、  
  履歴テーブルは下手に編集すると、データがおかしくなってしまいます。
  あくまでも保守用の機能ですので、割り切って使用して下さい。
  - 社員一覧（マスタテーブル）
  - 入退管理（履歴テーブル）
  - 作業管理（履歴テーブル）

### 事前準備

- [MongoDB Community Server](https://www.mongodb.com/try/download/community) をインストールし、起動しておくこと
- 必要であれば [MongoDB Compass](https://www.mongodb.com/try/download/compass) もインストールしておくこと
- Hostsを設定しておくこと

```
$ sudo vi /etc/hosts

127.0.0.1       mongo

$ ping mongo

$ sudo mkdir -p /data/db
$ sudo mongod

$ cd app/
```

### プロジェクト作成方法

```
$ npm init
$ npm install ejs express express-ejs-layouts express-session express-validator http-status-codes method-override mongoose passport passport-local-mongoose cookie-parser connect-flash
```

## 実行方法

```
$ npm install
$ node main.js
```

http://localhost:3000/

> 初期実行時はユーザー情報は空のため  
> ユーザー情報を追加してログインすること  
> *（今は管理者権限を外しています）*

http://localhost:3000/users/new

## ビルド

```
```

## 参考文献

- Angular
  - [入門Node.jsプログラミング](https://www.shoeisha.co.jp/book/detail/9784798158624)