const placeController = require("../controllers/placeController");
const Place = require("../models/Place");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Charger les variables d'environnement pour le test
require("dotenv").config({ path: ".env.test" });

// Mock des modèles et des dépendances
jest.mock("../models/Place");
jest.mock("../models/User");
jest.mock("jsonwebtoken");

describe("Place Controller Tests", () => {
  let testUser, req, res;

  beforeEach(() => {
    testUser = {
      _id: "123456",
      name: "Test User",
      email: "test@example.com",
    };

    jwt.sign.mockReturnValue("mocked_token");

    req = {
      user: { id: testUser._id },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("addPlace", () => {
    it("should add a new place", async () => {
      const newPlace = {
        title: "New Place",
        address: "New Address",
        addedPhotos: ["newphoto.jpg"],
        description: "New Description",
        perks: ["parking"],
        extraInfo: "Some extra info",
        maxGuests: 2,
        price: 50,
        type: "house",
      };

      req.body = newPlace;
      Place.create.mockResolvedValue(newPlace);

      await placeController.addPlace(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ place: newPlace });
    });
  });

  describe("userPlaces", () => {
    it("should return user specific places", async () => {
      const places = [{ title: "Test Place", owner: testUser._id }];
      Place.find.mockResolvedValue(places);

      await placeController.userPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(places);
    });
  });

  describe("updatePlace", () => {
    it("should update a place", async () => {
      const updatedPlaceData = {
        id: "12345",
        title: "Updated Place",
        address: "Updated Address",
        addedPhotos: ["updatedphoto.jpg"],
        description: "Updated Description",
        perks: ["wifi"],
        extraInfo: "Some extra info",
        maxGuests: 4,
        price: 75,
        type: "apartment",
      };

      req.body = updatedPlaceData;
      const mockPlace = {
        _id: "12345",
        owner: testUser._id,
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(updatedPlaceData),
      };
      Place.findById.mockResolvedValue(mockPlace);

      await placeController.updatePlace(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "place updated!" });
    });
  });

  describe("getPlaces", () => {
    it("should return all places", async () => {
      const places = [{ _id: "12345", title: "Test Place" }];
      Place.find.mockResolvedValue(places);

      await placeController.getPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ places });
    });
  });

  describe("singlePlace", () => {
    it("should return a single place", async () => {
      const testPlace = { _id: "12345", title: "Test Place" };
      Place.findById.mockResolvedValue(testPlace);

      req.params.id = "12345";

      await placeController.singlePlace(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ place: testPlace });
    });
  });

  describe("searchPlaces", () => {
    it("should return places matching the search query", async () => {
      const places = [{ _id: "12345", title: "Test Place" }];
      Place.find.mockResolvedValue(places);

      req.params.key = "Test";

      await placeController.searchPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(places);
    });

    it("should return all places if searchword is empty", async () => {
      const places = [{ _id: "123", title: "Place 1" }];
      Place.find.mockResolvedValue(places);

      req.params.key = "";

      await placeController.searchPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(places);
    });

    it("should handle errors when searching places", async () => {
      Place.find.mockRejectedValue(new Error("Database error"));

      req.params.key = "Test";

      await placeController.searchPlaces(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("getReviewsByPlace", () => {
    it("should return reviews for a specific place", async () => {
      const mockReviews = [
        { _id: "review1", user: { name: "User A" }, comment: "Great!" },
      ];
      const mockPlace = { reviews: mockReviews };

      Place.findById.mockImplementation((id) => {
        const chainable = {
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn(),
        };

        if (id === "place123") {
          chainable.exec.mockResolvedValue(mockPlace);
        } else if (id === "placeWithNoReviews") {
          chainable.exec.mockResolvedValue({ reviews: [] });
        } else if (id === "nonexistent") {
          chainable.exec.mockResolvedValue(null);
        } else {
          chainable.exec.mockResolvedValue(null);
        }
        return chainable;
      });

      req.params.placeId = "place123";

      await placeController.getReviewsByPlace(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReviews,
      });
    });

    it("should return 404 if place not found", async () => {
      Place.findById.mockImplementation((id) => {
        if (id === "nonexistent") {
          return {
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(null),
          };
        }
        return {
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(null),
        };
      });

      req.params.placeId = "nonexistent";

      await placeController.getReviewsByPlace(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Aucun avis trouvé pour ce lieu.",
      });
    });

    it("should return 404 if no reviews found for the place", async () => {
      const mockPlace = { reviews: [] };
      Place.findById.mockImplementation((id) => {
        if (id === "placeWithNoReviews") {
          return {
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue(mockPlace),
          };
        }
        return {
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(null),
        };
      });

      req.params.placeId = "placeWithNoReviews";

      await placeController.getReviewsByPlace(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Aucun avis trouvé pour ce lieu.",
      });
    });

    it("should handle errors when fetching reviews", async () => {
      Place.findById.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      req.params.placeId = "place123";

      await placeController.getReviewsByPlace(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Database error",
      });
    });
  });

  describe("replyToReview", () => {
    it("should add a reply to a review", async () => {
      const mockReview = { _id: "review1", comment: "Original" };
      const mockPlace = {
        reviews: Object.assign([
          { _id: "review1", comment: "Original", replies: [] },
        ], {
          id: jest.fn((id) => {
            if (id === "review1") {
              return mockPlace.reviews[0];
            }
            return null;
          }),
        }),
      };

      Place.findOneAndUpdate.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPlace),
      }));

      req.params.placeId = "place123";
      req.params.reviewId = "review1";
      req.body.comment = "Reply comment";
      req.user._id = "user456";

      await placeController.replyToReview(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReview,
      });
    });

    it("should return 404 if place or review not found", async () => {
      Place.findOneAndUpdate.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      req.params.placeId = "nonexistent";
      req.params.reviewId = "nonexistent";

      await placeController.replyToReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Lieu ou avis non trouvé.",
      });
    });

    it("should handle errors when replying to a review", async () => {
      Place.findOneAndUpdate.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error("Database error")),
      }));

      req.params.placeId = "place123";
      req.params.reviewId = "review1";

      await placeController.replyToReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(Error),
        message: "Erreur lors de la réponse à l'avis",
      });
    });
  });

  describe("addReview", () => {
    it("should add a new review to a place", async () => {
      const mockPlace = {
        reviews: [],
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockReturnThis(),
      };

      Place.findById.mockResolvedValue(mockPlace);

      req.params.placeId = "place123";
      req.body.rating = 5;
      req.body.comment = "Great place!";
      req.user._id = "user456";

      await placeController.addReview(req, res);

      expect(mockPlace.reviews.length).toBe(1);
      expect(mockPlace.reviews[0].comment).toBe("Great place!");
      expect(mockPlace.save).toHaveBeenCalled();
      expect(mockPlace.populate).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPlace.reviews,
      });
    });

    it("should return 404 if place not found when adding review", async () => {
      Place.findById.mockResolvedValue(null);

      req.params.placeId = "nonexistent";

      await placeController.addReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Place not found.",
      });
    });

    it("should handle errors when adding a review", async () => {
      Place.findById.mockRejectedValue(new Error("Database error"));

      req.params.placeId = "place123";

      await placeController.addReview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error adding review",
        error: expect.any(Error),
      });
    });
  });
});
