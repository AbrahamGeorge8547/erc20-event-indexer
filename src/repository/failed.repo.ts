import { Bfailed } from '../interfaces/failed.interface';
import failedModel from '../models/failed.model';


const failedRepo = {
    async bulkWrite(docs: Bfailed[]) {
        await failedModel.bulkWrite(
            docs.map((doc) => ({
              insertOne: {
                  document: doc
              },
            }))
          );
    }
}

export default failedRepo;