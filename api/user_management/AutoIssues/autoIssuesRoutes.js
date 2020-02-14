import express from "express"
import autoIssueController from "./autoIssuesController";

let router = express.Router();

router.get("/", autoIssueController.findAll);
router.get("/:id", autoIssueController.find);
router.post("/save", autoIssueController.insert);
router.patch("/update/:id", autoIssueController.update);
router.patch("/delete/:id", autoIssueController.delete);

router.get("/auto/complaint", autoIssueController.findAutoComplaint);

export default router;