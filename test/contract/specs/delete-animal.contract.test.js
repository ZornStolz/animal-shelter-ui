import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to delete an animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to delete an animal",
        state: "delete an animal",
        withRequest: {
          method: "DELETE",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
          body: {
            id: Matchers.like(69),
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
            vaccines: ["lupus", "rabia"],
          },
        },
      });
    });

    test("should return the correct data", async () => {
      const response = await AnimalController.delete("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});
