const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const Response = require("../models/Response");

// POST - Save form
// routes/forms.js
router.post("/", async (req, res) => {
  try {
    console.log("Received form data:", req.body); // ✅ already working

    const { title, description, fields } = req.body;

    const newForm = new Form({ title, description, fields });
    await newForm.save();

    res.status(201).json({ message: "Form saved", form: newForm });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ message: "Error saving form", error });
  }
});


// GET - Fetch all forms
router.get("/", async (req, res) => {
  const forms = await Form.find();
  console.log("Fetched forms:", forms);
  res.json(forms);
});

router.post("/submit/:formId", async (req, res) => {
  try {
    const formId = req.params.formId;
    const formData = req.body; // this should be an object of field: value
    // Save to new collection or embed in form document
    res.status(200).json({ message: "Form data received", data: formData });
  } catch (err) {
    res.status(500).json({ error: "Submit error", details: err });
  }
});

// GET form by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error fetching form", error });
  }
});
// PUT /api/forms/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Form.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        fields: req.body.fields // ✅ Add this line to update form fields
      },
      { new: true }
    );
    console.log("Updated form:", updated);

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating form" });
  }
});


// routes/forms.js
router.delete("/:id", async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting form", error });
  }
});


router.post("/:formId/responses", async (req, res) => {
  const { formId } = req.params;
  const userResponses = req.body;

      // console.log("Response saved:", userResponses, formId);

  try {
    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    // Create new response entry
    const newResponse = new Response({
      formId,
      answers: userResponses,
    });

    await newResponse.save().then(() => {
      console.log("Response saved successfully",newResponse);
    });

    res.status(200).json({ message: "Response saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving response", error: err });
  }
});


// GET /api/responses/:formId
router.get("/responses/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const responses = await Response.find({ formId });
    res.json({ responses });
  } catch (err) {
    res.status(500).json({ message: "Error fetching responses", error: err });
  }
});

module.exports = router;
