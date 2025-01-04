---
title: gqlgen で異常にメモリが消費される
date: 2025-01-04
---

gqlgen を用いて実装した GraphQL サーバーに対してある条件を満たしたリソースを全件取得しようとすると異常（= 取得するデータ量以上）にメモリが消費されることに関する記事です。

## 前提条件

例えば以下のような schema があるとします。

```gql
type Query {
    posts: [Post!]!
}

type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    tags: [Tag!]!
}

type User { ... }
type Tag { ... }
```

このとき、`author` と `tags` が `posts` 用のリゾルバではないリゾルバ（いわゆる子リゾルバ）で処理される場合、この `posts` がリクエストされた場合にメモリが異常に消費される可能性があります。ページネーションがないなら当たり前と思われるかもしれませんが、本記事で触れる gqlgen の仕様はページネーションを適切に実装していても**呼び出される子リゾルバの数が多ければ**同様の現象に遭遇する可能性があります。

## 根本原因


「子リゾルバが存在するリゾルバを呼び出すとメモリを異常に消費する」という根本の原因は gqlgen の仕様に存在します。

gqlgen では子リゾルバを呼び出す際に、[複数のオブジェクトを処理する場合はオブジェクト毎に goroutine を生成します](https://github.com/99designs/gqlgen/blob/5424fb7f1ad3a804168bb3580d3041a64f23acf1/codegen/type.gotpl#L131-L135)。リゾルバを実行する際は基本的に外部（DB や別サーバー）との通信が発生するため、この仕様は妥当な実装に思えます。しかしながら v0.17.56 まではこの生成される goroutine の数を制限することができなかったため、1万個であろうが10万個であろうが goroutine が生成されるという状態でした（後述しますがこの問題は修正されています）。

goroutine は従来の thread に比べて軽量に設計されており、並列処理がより低コストに扱えるようになったことは go が流行した一因だと言われるほどですが、ノーコストな訳ではありません。環境によって goroutine の最低サイズは変わるらしいのですが、少なくとも goroutine ひとつで 2KiB のメモリが消費されます。したがって、例に出したような子リゾルバが2つ存在するオブジェクトを 10,000 件取得する場合、 5MiB ほどがほぼ同時に要求されます。また、`Tag` に子リゾルバが存在しており `posts.tags` の要素数が増えれば増えるほど更に要求されるメモリ量が増えていきます。これはあくまで goroutine の実行に最低限必要なメモリ量ですので、ここに外部から引っ張ってきたデータであったり諸々の処理に必要なメモリを考慮するともう少し増えます。それが1リクエスト毎に必要となるため、例えばユーザーが一斉にアクセスする時間帯であったりバッチ処理で全件取得をするなど、一度にたくさんのリクエストを処理する必要があればすぐにメモリ使用量は跳ね上がります。

## 解決策

前提として仕様上ページネーションを実装できる場合はまずはそちらを実装するべきです（[Pagination | GraphQL](https://graphql.org/learn/pagination/)）。全件取得が必須などの要件で取り扱うオブジェクト数に制限を設けられない場合、v0.17.57 から導入された `worker_limit` を使うことで同時に実行する子リゾルバの数を制限することができます。

例えば `gqlgen.yaml` に以下のように `worker_limit` を追加します。

```yaml
exec:
  filename: graph/generated.go
  package: graph
  worker_limit: 1000
```

すると同時に実行される goroutine が1000個まで制限されます。例えば全件取得の結果5000件のデータを処理しなくてはいけない場合、この制限によって1リクエストあたりで必要となるメモリ量を軽減させることができます。このオプションはあくまで **gqlgen が子リゾルバを実行する際に生成する goroutine の数に上限を設ける**オプションであり、それ以外の部分が原因の場合に効果を発揮しません。また同時に実行する子リゾルバの数を制限することはパフォーマンスの低下に直結します。このオプションを使う場合はパフォーマンスをモニタリングしながら少しずつ数値をいじってください。

## 余談

この `worker_limit` は[私が追加](https://github.com/99designs/gqlgen/pull/3376)しました。業務中に本記事で述べてきた問題に直面し、解決した結果を gqlgen へ還元したという形です。もともとは gqlgen がコード生成に利用する template をユーザーが自由に変更してはどうかという[提案](https://github.com/99designs/gqlgen/issues/3371)をしていたのですが、メンテナの方からオプションならマージできるということで今の形に落ち着きました。

最初に提案をした際にメンテナからは以下の[コメント](https://github.com/99designs/gqlgen/issues/3371#issuecomment-2476847499)をいただきました。

> Currently, when a large organization like reddit/uber/dgraph/etc. privately forks gqlgen (or any open source software), those organizations no longer benefit from ecosystem contributions (like GraphQL spec changes) or have to painfully reconcile their own changes. It's just easier for those organization to contribute their internal improvements back upstream to the benefit of all. Your PR makes it easy to continue to enjoy all the benefits of other gqlgen community improvements without having to go to any effort to upstream their private execution improvements.

DeepL 訳

> 現在、reddit/uber/dgraph/などのような大きな組織がgqlgen（または任意のオープンソースソフトウェア）を私的にフォークすると、それらの組織はもはやエコシステムの貢献（GraphQL仕様の変更のような）から利益を得たり、彼ら自身の変更を苦労して調整したりする必要がなくなります。そのような組織にとっては、内部の改良を上流に還元して、すべての人の利益に貢献する方が簡単なのです。あなたのPRは、他のgqlgenコミュニティの改良のすべての利点を、私的な実行の改良をアップストリームする努力をすることなく、簡単に享受し続けることを可能にします。

あまりにカスタマイズ性が高いと利用者側の工夫が gqlgen へマージされないという話ですね。今回初めて実装で OSS へコントリビュートしたのですが、ただマージされるだけでなくこのようなメンテナの意見に触れることができたので非常に良い経験でした。
