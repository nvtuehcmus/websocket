import mongodb from "mongodb";
import assert from "assert";
import { type } from "os";

export const getTrips = (DB: string, collect: string, key?: string) => {
  const { MongoClient } = mongodb;
  return new Promise((resolve) => {
    MongoClient.connect(
      process.env.CONNECTION ?? " ",
      { useUnifiedTopology: true },
      async (err, client) => {
        assert.equal(null, err);
        const db = client.db(DB);
        const collection = db.collection(collect);
        const docs = await collection.find(key ? { key: key } : {}).toArray();
        await client.close();
        resolve(docs);
      }
    );
  });
};
export const updateTrip = (
  DB: string,
  collect: string,
  trip: string,
  data: { amount: number; type: string }
) => {
  const { MongoClient } = mongodb;
  return new Promise((resolve) => {
    MongoClient.connect(
      process.env.CONNECTION ?? " ",
      { useUnifiedTopology: true },
      async (err, client) => {
        const { amount, type } = data;
        assert.equal(null, err);
        const db = client.db(DB);
        const collection = db.collection(collect);
        const query = { key: trip };
        const dataKey = `type.${type}.amount`;
        const value = { $set: { [dataKey]: amount } };
        const docs = await collection.updateOne(query, value);
        await client.close();
        resolve(docs);
      }
    );
  });
};
