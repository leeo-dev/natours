const express = require("express");
const router = express.Router();
const TourController = require("./../controllers/TourController");



router.get("/top-5-cheap", TourController.aliasTopTours, TourController.allTours);
router.get("/", TourController.allTours);
router.post("/", TourController.createTour);
router.get("/:id", TourController.singleTour);
router.patch("/:id", TourController.updateTour);
router.delete("/:id", TourController.deleteTour);

module.exports = router;