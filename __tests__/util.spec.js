//const fetchMock = require("fetch-mock");
import {getDatesDifferenceInDays, getTripDate} from "../src/client/js/util";
describe("Util helper functions", () => {
  it("Should return 1", async ()=> {
    expect(getDatesDifferenceInDays("2020-04-15", "2020-04-16")).toBe(1);
  });

  it("Should return an object with the travelDate, returnDate and duration as properties", async ()=> {
    expect(getTripDate("2020-04-15 to 2020-04-16", getDatesDifferenceInDays)).toEqual(
      { travelDate: "2020-04-15", returnDate: "2020-04-16", duration: 1 }
    );
  });
});