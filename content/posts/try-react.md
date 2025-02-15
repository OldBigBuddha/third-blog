---
title: React をようやく触ったみた
date: 2020-06-02
tags:
  - React
---
前々から話題の React ですが、恥ずかしいことに全く触っていませんでした。最近ふと作りたい Web サービスを思いついて、ついでに React を使ってみたいと思ったので今更ながら YouTube に上がっていたチュートリアル動画を参考に小さなサービスを作ってみました。

参考にしたチュートリアル: [Learn the MERN Stack - Full Tutorial (MongoDB, Express, React, Node.js) | YouTube](https://www.youtube.com/watch?v=7CqJlxBYj-M)

完成したソースコード: [OldBigBuddha/mern-exercise-tracker | GitHub](https://github.com/OldBigBuddha/mern-exercise-tracker)

## 学んだこと

バックエンドに関する知識は全て知っている内容だったので、フロントエンドに関する知識を沢山得ました。いくつか羅列しておきます。

### MERN という構成

MEAN は聞いたことありましたが MERN は初めて聞きました。Angular が React に置き換わったやつのようです。納得。これが Vue.js とかだと MEVN とかになるんですかね。

### React の書き方

React の基本的な書き方を学びました。コンポーネントはこう書いて、ステータスはこう使って、指定の要素が更新されたときの処理はこう書いてと、本当に初歩の域だと思いますが触りは分かったような気がします。

コンポーネント最強ですね、これは流行るわけだ。HTML/CSS を書き始めたときここを共通化する方法はないのかと思ってましたが、React にありました。もっと早くから触っておけばよかった。

Hooks と Content API を利用した [チュートリアル動画](https://www.youtube.com/watch?v=XuFDcZABiDQ) を見つけたので、動画を見た後に今回作ったコードにそれらを適用しようと思います。

### フロントとバックのつなぎ方

今回は axios というモジュールを使ってバックエンドの API を叩いてデータを引っ張ってきたり保存したりしました。これまでバックエンドの開発をするときはルーティングの処理としてテンプレートを返すか JSON を吐き出すだけのどちらかだったので、フロントとバックを繋ぐ新しい方法を学びました。

いつも API を叩くときは Nodejs や Python で作ったコマンドツールだったり、得意の Android からばかりだったので、フロントから API を叩くことが初めてでした。そう言えば fetch API なんてのもありますが、どっちのほうがいいのでしょう。適材適所なのでしょうか、要調査です。

### Bootstrap の使い方

これまで Bootstrap は過去の遺物で使うとかありえないという思想がありましたが、それは間違えなのかもしれないと思い始めています。特に今回のようなサンプルコードを書くときや、とりあえず動くものを作るときにはとても重宝することに気が付きました。[チートシート](https://hackerthemes.com/bootstrap-cheatsheet/) とかもあるようなので、個人で開発を行うときには積極的に使うべきなのかというのが今の考えです。動作に注力したいのにデザインで止まるというのは悲しいですからね。

よほど特別な UI じゃない限り使う UI ってのは数が限られてると思うので、使えそうなレイアウトを見つけてはストックしておくと非デザイナでも開発速度を落とさずにイケてるサイトができるかもしれません。これからは良さげな画面やコンポーネントを見かけたらストックしておこうと思います。そういうストックするためのサービスがあるといいですね。該当するコードとスクショとメモをひとつの要素としていっぱいストックしていけるみたいな。余裕ができたら練習として作ってみます、もちろん MERN Stack で。

## 感想

触れた部分としては少しでしたが、とても楽しかったです。今回を気に React にハマりそうなので、最新の書き方を追いかけつつ成果物を作っていきたいです。まずはポートフォリオからかな。

Twitter: [@OldBigBuddha](https://twitter.com/OldBigBuddha)
