## 文法

- TerraformはHCL(HashiCorp Configuration Language)という文法によりコーディングする
- HCLでは「ブロック」を定義して記述し、resourceやvariableもその一つ

### terraform


### provider

- 特定のクラウドプロバイダ・サービス(awsやgcpなど)を使うときに設定する
- リージョン、バージョン、プロファイルなど

```
# awsを使う場合
provider "aws" {
  region  = "ap-northeast-1"
  version = "~> 3.0"
}

# gcpのbeta(firebase-hostingとか)を使う場合
provider "google-beta" {
    user_project_override = true
    region="asia-northeast1"
    alias = "user_project_override"
}
```

### resource

- 何のリソースを作成したいのかを指定する
- 種類：`<プロバイダー>_<リソースタイプ>`
    - 各クラウドプロバイダおよびリソースによって一意に決まっている
    - 例えばaws ec2なら`aws_instance`, gcp(beta)のfirebase-hostingなら`google_firebase_hosting_site`など
- 識別子:`<リソース名>`(terraform設定ファイル内で一意になるようにする)

```
  resource "種類" "識別子" {
    # ...
  }
```

### variable

- 変数定義をするブロック
- 変数定義用に別ファイルとして切り出すことも可能(後述)

```
variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}
```

### output

- 値を出力するブロック
- 記述方法は以下の通り

```
output "<名前>" {
  value = <値>
  description = "<説明>" # オプション
  sensitive = <true | false> # オプション
}
```

- 名前は一意にすること
- 利用用途
    - 例1: resourceで作成したインフラリソースのidを出力して確認する(ログ出力)
    - 例2: コマンドライン上で出力(`terraform output`)して、出力した値を別のコマンドに渡したりして利用する
    - 例3: モジュールで出力した値を呼び出し元のファイルで再度呼び出す
        - 補足: 子モジュールで定義したoutputは、親モジュールからも呼び出せる

### data source

- 既存のインフラリソースのデータを参照・読み取るための方法
- `data "<プロバイダー>_<データソースタイプ>" "<データソース名>" {...`で定義
- 直感的にはresourceと似ていると感じるかもだが、resourceはインフラの作成・変更・削除、dataは既存のインフラや外部サービスに関する情報を取得する、という点で異なる
- 動的に値を取得したり、それを再利用したりできる

```
# 書き方
data "<プロバイダー>_<データソースタイプ>" "<データソース名>" {
  <引数1> = "<値1>"
  <引数2> = "<値2>"
  ...
}

# 実例
data "aws_s3_bucket" "existing_bucket" {
  bucket = "my-existing-s3-bucket" # 参照したいS3バケットの名前を指定
}
output "bucket_arn" {
  value = data.aws_s3_bucket.existing_bucket.arn
}
```

### module

- terraform構成の一部を共通化したりして、再利用可能にする単位のこと
- 例えば以下のようなディレクトリ構成にしてtfファイルを保存する
    - main.tfにresourceとしてaws_vpcリソースに関する定義が書かれている
    - module定義のために特別な記述は必要ない

```
vpc-module/
  ├── main.tf
  ├── variables.tf
  └── outputs.tf
```

- これをmoduleとして呼び出す場合は以下のようになる

```
module "vpc" {
  source      = "./vpc-module"  # モジュールのディレクトリパス
  cidr_block  = "10.0.0.0/16"
  subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "subnet_ids" {
  value = module.vpc.subnet_ids
}
```

- 環境(develop,staging,productionなど)ごとにterraformでリソースを分けて定義したいとき、単一ファイルに書くと行数が長くなったりする
- 適度にmoduleとして共通化することで再利用性が上がったり、コードが簡素化して管理しやすくなったりする

### functions

- 色々ある