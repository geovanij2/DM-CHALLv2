# DM-CHALLv2
Delivery Much Backend Tech Challenge

Para rodar a applicação:

```shell
$ yarn

$ docker-compose up -d
```

A solução foi desenvolvida utilizando node.js e express.js com banco de dados PostgreSQL.

O acesso ao banco é no localhost:5432

O acesso ao app node é no localhost:8000

O rabbit roda no localhost:5672 e o acesso pelo browser é no localhost:15672

O arquivo .env guarda as informações de ambiente, num repositório real ele não deve ser commitado. Este só é o caso, pois quero facilitar a execução para quem clona o repositório.
