const express = require("express");
const router = express.Router();
const TourController = require("./../controllers/TourController");

router.param('id', TourController.checkId);

router.get("/", TourController.allTours);
router.post("/", TourController.checkBody, TourController.createTour);
router.get("/:id", TourController.singleTour);
router.patch("/:id", TourController.updateTour);
router.delete("/:id", TourController.deleteTour);

module.exports = router;