## これは何?
- esa.ioのタグの正規化を促すスクリプトです
- `bigquery`と`BigQuery`のような内容が同じなのに、タグの表層がずれていて検索に引っかからない、といったことを防ぐ目的で作っています

## 使い方
GitHub Actions上で動きます。リポジトリのSecretsに以下のものを設定しましょう。

- `ESA_TEAM_NAME`: esaのチーム名
- `ESA_ACCESS_TOKEN`: esaのアクセストークン
- `SLACK_WEBHOOK`: slackのincomming webhook
