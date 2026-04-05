const express = require("express");
const router = express.Router();

 const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
  getDashboard
} = require("../controllers/recordController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

//  Create (Admin + Analyst)
router.post("/", protect, authorizeRoles("admin", "analyst"), createRecord);

//  Get (All users)
router.get("/", protect, getRecords);
router.get("/dashboard", protect, getDashboard);
//  Update (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), updateRecord);

//  Delete (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteRecord);

module.exports = router;