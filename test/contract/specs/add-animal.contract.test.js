import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to post an animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to post an animal",
        state: "add animal",
        withRequest: {
          method: "POST",
          path: "/animals",
        },
        willRespondWith: {
          status: 201,
          body: Matchers.eachLike({
            id: Matchers.like(69),
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
      const animal = {
        name: "manchas",
        breed: "Bengali",
        gender: "Female",
        vaccinated: true,
        vaccines: ["Leptospirosis", "Parvovirus"],
      };
      const response = await AnimalController.register(animal);

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});
