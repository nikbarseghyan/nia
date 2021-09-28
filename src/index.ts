import elasticsearch from 'elasticsearch';
import { MongoClient } from 'mongodb';
import PQueue from 'p-queue';
import ProgressBar from 'progress';
import { IncomingOptionsI } from './interface';

export const Nia = (opts: IncomingOptionsI, total = 0) => {
  const counts: any[] = [],
    client = new elasticsearch.Client(opts.esOpts),
    queue = new PQueue({ concurrency: opts.pQueue })

  queue
    .onEmpty()
    .then((i) => {
      counts[0].then((c: number) => {
        console.log(`${c} -> Data transferred`);
        process.exit();
      });
    })
    .catch((error) => console.log(error));

  MongoClient.connect(opts.moUrl, (error, moClient) => {
    if (error) throw error;
    const db = moClient?.db(opts.moColl);

    db?.collections().then((collections) => {
      if (Array.isArray(opts.moColl) || typeof opts.moColl === 'string') {
        Array.isArray(opts.moColl)
          ? (collections = collections.filter(
              ({ collectionName }) => opts.moColl.indexOf(collectionName) != -1,
            ))
          : (collections = collections.filter(
              ({ collectionName }) => opts.moColl === collectionName,
            ));
      }

      if (!collections.length) {
        console.error('Collection not found.');
        process.exit();
      }

      for (const collection of collections) {
        counts.push(db?.collection(collection?.collectionName).count());
      }

      Promise.all(counts).then((counts) => {
        total = counts.reduce((a, b) => a + b);
        const bar = new ProgressBar(':current/:total document', { total });

        collections.map(({ collectionName }) => {
          db?.collection(collectionName)
            .find()
            .forEach((doc) => {
              queue.add(() => {
                bar.tick();

                const _doc = JSON.parse(JSON.stringify(doc));

                delete _doc._id;

                return client.bulk({
                  body: [
                    {
                      index: {
                        _index: opts?.esIdx || collectionName,
                        _type: opts?.esIdx || collectionName,
                        _id: doc._id,
                      },
                    },
                    _doc,
                  ],
                });
              });
            });
        });
      });
    });
  });
};
