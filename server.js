import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import Transfer from "./models/transfer.js";
import IsoForms from "./models/isoForms.js";
import Clearance from "./models/clearance.js";
import Research from "./models/research.js";
import SurveyResponse from "./models/survey.js";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", async (req, res) => {
  try {
    res.json({ message: "Hello, this is my REST API for monitoring log" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Save a transfer request
app.post("/api/transfers", async (req, res) => {
  try {
    if (!req.body.name || req.body.name.length < 8) {
      return res
        .status(400)
        .json({ error: "Name must be at least 8 characters long." });
    }
    const transfer = new Transfer(req.body);
    await transfer.save();
    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all transfer requests
app.get("/api/transfers", async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a clearance request
app.post("/api/clearance", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ error: "Fill all the input field" });

    const clearance = new Clearance(req.body);
    await clearance.save();
    res.status(201).json(clearance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all clearance requests

app.get("/api/clearance", async (req, res) => {
  try {
    const clearance = await Clearance.find();
    res.json(clearance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a research request
app.post("/api/research", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ error: "Fill all the input field" });

    const research = new Research(req.body);
    await research.save();
    res.status(201).json(research);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all research requests
app.get("/api/research", async (req, res) => {
  try {
    const research = await Research.find();
    res.json(research);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // Create new ISO form entry + send email
app.post("/api/iso", async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: "Server Error All field must be fill!" });
    }
    const isoForm = new IsoForms(req.body);
    await isoForm.save();

    // Normalize iso field to always be an array
    const isoFormsRequested = Array.isArray(req.body.iso)
      ? req.body.iso
      : [req.body.iso];

    // Build attachments array
    const attachments = isoFormsRequested
      .map((formName) => {
        const filePath = path.join(__dirname, "files", `${formName}.pdf`);
        if (fs.existsSync(filePath)) {
          return { filename: `${formName}.pdf`, path: filePath };
        }
        return null;
      })
      .filter(Boolean); // remove nulls if file missing
    // configure transporter

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with multiple attachments
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Your Requested ISO Forms",
      text: `Hello ${req.body.name},\n\nAttached are the ISO forms you requested.`,
      attachments, // 👈 use the array here
    });

    res.status(201).json({ message: "ISO form saved and email sent", isoForm });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all ISO form entries
app.get("/api/iso", async (req, res) => {
  try {
    const forms = await IsoForms.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create post new surveyResponse
app.post("/api/surveyRes", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).json({ error: "Fill all the input field" });

    const surveyRes = new SurveyResponse(req.body);
    await surveyRes.save();
    res.status(201).json(surveyRes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all survey
app.get("/api/surveyRes", async (req, res) => {
  try {
    const survey = await SurveyResponse.find();
    res.json(survey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
