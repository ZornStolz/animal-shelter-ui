import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to list all animals is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to list all animals",
        state: "has animals",
        withRequest: {
          method: "GET",
          path: "/animals",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });

    test("should return a list with animals", async () => {
      const response = await AnimalController.list();

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });

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

    test("The Sought animal was found and has the correct data", async () => {
      const response = await AnimalController.getAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });

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

    test("The animal was created and has the correct data", async () => {
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

  describe("When a request to update an animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to update an animal",
        state: "update animal",
        withRequest: {
          method: "PUT",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
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

    test("The animal was updated and has the correct data", async () => {
      const response = await AnimalController.updateAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });

  describe("When a request to delete an animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
      await provider.addInteraction({
        uponReceiving: "a request to delete an animal",
        state: "delete animal",
        withRequest: {
          method: "DELETE",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 204,
        },
      });
    });

    test("The animal was deleted and the status is 204", async () => {
      const response = await AnimalController.delete("manchas");
      expect(response).toMatchSnapshot();
      await provider.verify();
    });

    afterAll(() => provider.finalize());
  });
});
