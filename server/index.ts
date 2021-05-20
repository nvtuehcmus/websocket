import dotenv from "dotenv";
import net from "net";
import { getTrips, updateTrip } from "./model/db";
import { ITripModel, ITicketRequest } from "./model/type";

dotenv.config();

const server = net.createServer((connect) => {
  connect.on("data", async (res: string) => {
    if (res.toString() === "get-info") {
      const result = (await getTrips(
        process.env.DB ?? "",
        process.env.COLLECTION ?? "",
        undefined
      )) as ITripModel[];
      connect.write(JSON.stringify(result));
      connect.end();
    } else {
      const data: ITicketRequest = JSON.parse(res);
      const { trip, type, amount } = data;
      const result = (await getTrips(
        process.env.DB ?? "",
        process.env.COLLECTION ?? "",
        trip ?? undefined
      )) as ITripModel[];
      if (result[0].type[type].amount >= Number(amount)) {
        try {
          await updateTrip(
            process.env.DB ?? "",
            process.env.COLLECTION ?? "",
            trip,
            { amount: result[0].type[type].amount - Number(amount), type: type }
          );
          const res = {
            status: 200,
            message: "successful",
            total: Number(amount) * result[0].type[type].price,
            remainingAmount: result[0].type[type].amount - Number(amount),
          };
          connect.write(JSON.stringify(res));
          connect.end();
        } catch (e) {
          const res = {
            status: 500,
            message: "ERROR:internal server error",
            total: 0,
            remainingAmount: result[0].type[type].amount,
          };
          connect.write(JSON.stringify(res));
          connect.end();
        }
      } else {
        const res = {
          status: 400,
          message: "error",
          total: 0,
          remainingAmount: result[0].type[type].amount,
        };
        connect.write(JSON.stringify(res));
        connect.end();
      }
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
