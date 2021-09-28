import elasticsearch from 'elasticsearch';
import { MongoClient } from 'mongodb';
import PQueue from 'p-queue';
import ProgressBar from 'progress';
export var Nia = function (opts, total) {
    if (total === void 0) { total = 0; }
    var counts = [], client = new elasticsearch.Client(opts.esOpts), queue = new PQueue({ concurrency: opts.pQueue });
    queue
        .onEmpty()
        .then(function (i) {
        counts[0].then(function (c) {
            console.log(c + " -> Data transferred");
            process.exit();
        });
    })
        .catch(function (error) { return console.log(error); });
    MongoClient.connect(opts.moUrl, function (error, moClient) {
        if (error)
            throw error;
        var db = moClient === null || moClient === void 0 ? void 0 : moClient.db(opts.moColl);
        db === null || db === void 0 ? void 0 : db.collections().then(function (collections) {
            if (Array.isArray(opts.moColl) || typeof opts.moColl === 'string') {
                Array.isArray(opts.moColl)
                    ? (collections = collections.filter(function (_a) {
                        var collectionName = _a.collectionName;
                        return opts.moColl.indexOf(collectionName) != -1;
                    }))
                    : (collections = collections.filter(function (_a) {
                        var collectionName = _a.collectionName;
                        return opts.moColl === collectionName;
                    }));
            }
            if (!collections.length) {
                console.error('Collection not found.');
                process.exit();
            }
            for (var _i = 0, collections_1 = collections; _i < collections_1.length; _i++) {
                var collection = collections_1[_i];
                counts.push(db === null || db === void 0 ? void 0 : db.collection(collection === null || collection === void 0 ? void 0 : collection.collectionName).count());
            }
            Promise.all(counts).then(function (counts) {
                total = counts.reduce(function (a, b) { return a + b; });
                var bar = new ProgressBar(':current/:total document', { total: total });
                collections.map(function (_a) {
                    var collectionName = _a.collectionName;
                    db === null || db === void 0 ? void 0 : db.collection(collectionName).find().forEach(function (doc) {
                        queue.add(function () {
                            bar.tick();
                            var _doc = JSON.parse(JSON.stringify(doc));
                            delete _doc._id;
                            return client.bulk({
                                body: [
                                    {
                                        index: {
                                            _index: (opts === null || opts === void 0 ? void 0 : opts.esIdx) || collectionName,
                                            _type: (opts === null || opts === void 0 ? void 0 : opts.esIdx) || collectionName,
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
