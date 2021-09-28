<p align="center">
  <a href="#" target="blank"><img src="https://github.com/Rebiss/mongo-tranfer-elastic/raw/main/migration/assets/nia.png"  alt="Nia" /></a>
</p>

<p align="center">
  <a href="#" target="_blank">Nia.js</a> a very simple tool for transfer MongoDB collection into Elasticsearch.
</p>

<p align="center">
  <a href="https://www.npmjs.com/" target="_blank"><img src="https://img.shields.io/badge/npm-v7.20.5-green" alt="NPM Version" /></a>
  <a href="https://www.mongodb.com/" target="_blank"><img src="https://img.shields.io/badge/mongodb-v4.1.2-green" alt="MongoDB" /></a>
  <a href="https://www.elastic.co/" target="_blank"><img src="https://img.shields.io/badge/elasticsearch-v16.7.2-green" alt="Elasticsearch" /></a>
  <div align="center">

  </div>

  <div align="center">

  [![nia](https://github.com/Rebiss/nia/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/Rebiss/nia/actions/workflows/main.yml)

  </div>
</p>

## Install
```sh
npm install nia.js
```

## Delete Old Elastic data
```sh
curl -XDELETE localhost:9200/*
```

## Usage

```typescript

import { Nia } from 'nia.js';

Nia(opts);

```

```typescript

const opts = {
  esOpts: {
    esHost: 'localhost',
    esPort: '9200',
    log: 'error',
    apiVersion: '7.2',
    requestTimeout: 50000,
  },
  esIdx: '{by default collection_name}',
  esType: '{by default collection_name}',
  moColl: '{collection_name}',
  moUrl: `mongodb://localhost:27017/{database_name}`,
  pQueue: 250,
};

```

