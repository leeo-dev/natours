const express = require("express");
const TourController = require("./../controllers/TourController");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();


router.get("/top-5-cheap", TourController.aliasTopTours, TourController.allTours);
router.get("/tours-stats", TourController.getTourStats);
router.get("/monthly-plan/:year", TourController.getMonthlyPlan);
router.get("/", authenticationController.protect, TourController.allTours);
router.post("/", TourController.createTour);
router.get("/:id", TourController.singleTour);
router.patch("/:id", TourController.updateTour);
router.delete("/:id", authenticationController.protect, authenticationController.restrictTo('admin', 'lead-guide'), TourController.deleteTour);

module.exports = router;