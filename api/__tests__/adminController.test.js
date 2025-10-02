const adminController = require("../controllers/adminController");
const User = require("../models/User");
const Place = require("../models/Place");

// Mock des modèles
jest.mock("../models/User");
jest.mock("../models/Place");

describe("Admin Controller Tests", () => {
  // Test pour createManager
  test("createManager devrait créer un nouvel administratteur", async () => {
    const req = {
      body: {
        name: "Test Admin",
        email: "admin@test1.com",
        password: "password1234",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.prototype.save.mockResolvedValue(req.body);

    await adminController.createManager(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Object),
      })
    );
  });

  // Test pour updateUser
  test("updateUser devrait mettre à jour un utilisateur existant", async () => {
    const req = {
      params: { id: "1234" },
      body: { name: "Updated Name", email: "updated@test1.com" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByIdAndUpdate.mockResolvedValue(req.body);

    await adminController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User updated successfully",
        data: expect.any(Object),
      })
    );
  });

  // Test pour deleteUser
  test("deleteUser devrait supprimer un utilisateur", async () => {
    const req = {
      params: { id: "1234" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByIdAndDelete.mockResolvedValue({});

    await adminController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Utilisateur supprimé",
      })
    );
  });

  // Test pour getAllPerks
  test("getAllPerks devrait retourner tous les avantages", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.find.mockResolvedValue([{ perks: ["wifi", "parking"] }]);

    await adminController.getAllPerks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.any(Array),
      })
    );
  });

  // Test pour updateUserRole
  test("updateUserRole devrait mettre à jour le rôle d'un utilisateur", async () => {
    const req = {
      params: { id: "1234" },
      body: { role: "admin" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.findByIdAndUpdate.mockResolvedValue({ _id: "1234", role: "admin" });

    await adminController.updateUserRole(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { _id: "1234", role: "admin" },
    });
  });

  // Test pour addPerk
  test("addPerk devrait ajouter un nouvel avantage", async () => {
    const req = {
      body: { name: "newPerk" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockPlace = {
      perks: [],
      save: jest.fn().mockResolvedValue(true),
    };
    Place.findOne.mockResolvedValue(mockPlace);

    await adminController.addPerk(req, res);

    expect(mockPlace.perks).toContain("newPerk");
    expect(mockPlace.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: ["newPerk"],
    });
  });

  // Test pour deletePerk
  test("deletePerk devrait supprimer un avantage de tous les lieux", async () => {
    const req = {
      params: { name: "wifi" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.updateMany.mockResolvedValue({ nModified: 1 });

    await adminController.deletePerk(req, res);

    expect(Place.updateMany).toHaveBeenCalledWith(
      { perks: "wifi" },
      { $pull: { perks: "wifi" } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Perk supprimé avec succès de tous les lieux.",
    });
  });

  // Test pour getAllPlaces
  test("getAllPlaces devrait retourner tous les lieux", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockPlaces = [{ name: "Place 1" }, { name: "Place 2" }];
    Place.find.mockResolvedValue(mockPlaces);

    await adminController.getAllPlaces(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockPlaces,
    });
  });

  // Test pour addPlace
  test("addPlace devrait ajouter un nouveau lieu", async () => {
    const req = {
      body: { name: "New Place", address: "123 Main St" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.prototype.save.mockResolvedValue(req.body);

    await adminController.addPlace(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Place added successfully",
      data: req.body,
    });
  });

  // Test pour updatePlace
  test("updatePlace devrait mettre à jour un lieu existant", async () => {
    const req = {
      params: { id: "place123" },
      body: { name: "Updated Place Name" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const updatedPlace = { _id: "place123", name: "Updated Place Name" };
    Place.findByIdAndUpdate.mockResolvedValue(updatedPlace);

    await adminController.updatePlace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Place updated successfully",
      data: updatedPlace,
    });
  });

  // Test pour deletePlace
  test("deletePlace devrait supprimer un lieu", async () => {
    const req = {
      params: { id: "place123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.findByIdAndDelete.mockResolvedValue({ _id: "place123" });

    await adminController.deletePlace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Place deleted successfully",
      data: { _id: "place123" },
    });
  });

  // Test pour updateUserProfile
  test("updateUserProfile devrait mettre à jour le profil d'un utilisateur", async () => {
    const req = {
      params: { id: "user123" },
      body: { name: "New User Name" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const updatedUser = { _id: "user123", name: "New User Name" };
    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    await adminController.updateUserProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedUser,
    });
  });

  // Test pour getAllUsers
  test("getAllUsers devrait retourner tous les utilisateurs", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockUsers = [{ name: "User 1" }, { name: "User 2" }];
    User.find.mockResolvedValue(mockUsers);

    await adminController.getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockUsers,
    });
  });

  // Test pour getAllReviews
  test("getAllReviews devrait retourner tous les avis", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockPlacesWithReviews = [
      { reviews: [{ _id: "review1", user: { name: "User A" } }] },
      { reviews: [{ _id: "review2", user: { name: "User B" } }] },
    ];
    Place.find.mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockPlacesWithReviews),
    }));

    await adminController.getAllReviews(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.any(Array),
    });
  });

  // Test pour deleteReview
  test("deleteReview devrait supprimer un avis", async () => {
    const req = {
      params: { reviewId: "review123" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.updateMany.mockResolvedValue({ nModified: 1 });

    await adminController.deleteReview(req, res);

    expect(Place.updateMany).toHaveBeenCalledWith(
      {},
      { $pull: { reviews: { _id: "review123" } } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  });

  // Test pour deleteReply
  test("deleteReply devrait supprimer une réponse à un avis", async () => {
    const req = {
      params: { reviewId: "review123", replyId: "reply456" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    Place.updateOne.mockResolvedValue({ nModified: 1 });

    await adminController.deleteReply(req, res);

    expect(Place.updateOne).toHaveBeenCalledWith(
      { "reviews._id": "review123" },
      { $pull: { "reviews.$.replies": { _id: "reply456" } } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Réponse supprimée avec succès",
    });
  });
});
