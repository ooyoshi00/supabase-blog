## ホスティングするまでの手順
1. `terraform init`
    - terraformを実行する際の初期化コマンド
    - 必要なバイナリファイルなどが可憐度ディレクトリにDLされる
2. `terraform plan`
    - クラウド上に構築されるリソースの確認
    - 作成は「+」、変更は「~」、削除は「-」で表示される
3. `terraform apply`
    - クラウド上に実際にリソースを構築するためのコマンド
    - アプリケーションをホスティングするわけではないので注意
        - ホスティングにはfirebase deploy...が必要
4. `firebase login`
5. `firebase use --add nextjs-myportfolio`
6. `firebase deploy --only hosting`