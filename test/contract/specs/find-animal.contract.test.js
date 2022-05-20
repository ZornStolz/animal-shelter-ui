import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to get an especific animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to find an animal",
        state: "get animal by name",
        withRequest: {
          method: "GET",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
            vaccines: ["Leptospirosis", "Parvovirus"],
          }),
        },
      });
    });

    test("should return the correct data", async () => {
      const response = await AnimalController.getAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});
